from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, Field, EmailStr, validator
from conexion import get_connection
from typing import Optional
from auth import crear_token, verificar_token
import hashlib
import re
import os
import uuid
from datetime import datetime

app = FastAPI()

@app.get("/", summary="Verificar estado del servidor")
def read_root():
    return {"message": "UbiContainer Backend ejecutándose correctamente 🚀"}

class User(BaseModel):
    nombre_completo: str
    correo: EmailStr
    celular: Optional[str] = None
    password: str = Field(..., alias="contrasena")

    @validator("password")
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Contraseña muy corta")
        return v
    
    @validator("celular")
    def celular_valido(cls, v):
        if v is not None and v != "":
            if not re.fullmatch(r"^\d{7,15}$", v):
                raise ValueError("Celular inválido (debe tener entre 7 y 15 dígitos)")
        return v

class ReportCreate(BaseModel):
    latitude: float
    longitude: float
    description: Optional[str] = None
    container_id: Optional[int] = None

class ContainerCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitud válida entre -90 y 90")
    longitude: float = Field(..., ge=-180, le=180, description="Longitud válida entre -180 y 180")
    type: str = Field(..., description="Tipo de contenedor: 'superficial' o 'soterrado'")
    
    @validator("type")
    def tipo_valido(cls, v):
        if v not in ["superficial", "soterrado"]:
            raise ValueError("Tipo debe ser 'superficial' o 'soterrado'")
        return v

class ContainerUpdate(BaseModel):
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Latitud válida entre -90 y 90")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Longitud válida entre -180 y 180")

class DumpReportCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitud del vertedero")
    longitude: float = Field(..., ge=-180, le=180, description="Longitud del vertedero")
    description: Optional[str] = Field(None, max_length=1000, description="Descripción del vertedero ilegal")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")
    
    user_email = payload.get("sub")
    if user_email is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token sin información de usuario")
    
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM usuarios WHERE correo = %s", (user_email,))
        user_data = cur.fetchone()
        if not user_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")
        return user_data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al obtener user_id: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@app.post("/register", summary="Registrar un nuevo usuario")
def register_user(user: User):
    try:
        print(f"📝 Intento de registro: correo={user.correo}, nombre={user.nombre_completo}, celular={user.celular}")
        conn = get_connection()
        if conn is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        cur = conn.cursor()

        cur.execute("SELECT * FROM usuarios WHERE correo = %s", (user.correo,))
        if cur.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Correo ya registrado")

        hashed_pw = hash_password(user.password)
        print(f"🔐 Password hasheado correctamente")

        cur.execute(
            "INSERT INTO usuarios (nombre_completo, correo, celular, contrasena) VALUES (%s, %s, %s, %s)",
            (user.nombre_completo, user.correo, user.celular, hashed_pw)
        )
        conn.commit()
        print(f"✅ Usuario registrado exitosamente: {user.correo}")

        return {"message": "Usuario registrado exitosamente"}
    except ValueError as ve:
        print(f"❌ Error de validación: {ve}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error interno del servidor al registrar: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error interno del servidor al registrar: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@app.get("/debug/users", summary="Listar todos los usuarios (DEBUG - eliminar en producción)")
def debug_list_users():
    """Endpoint temporal para debug - listar todos los usuarios"""
    try:
        conn = get_connection()
        if conn is None:
            return {"error": "Error de conexión a la base de datos"}
        cur = conn.cursor()

        cur.execute("SELECT id, nombre_completo, correo, celular FROM usuarios")
        users = cur.fetchall()

        cur.close()
        conn.close()

        return {
            "total": len(users),
            "users": [
                {"id": u[0], "nombre": u[1], "correo": u[2], "celular": u[3]}
                for u in users
            ]
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/login", summary="Iniciar sesión y obtener token de acceso")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username
    password = form_data.password

    print(f"🔐 Intento de login: correo={email}")

    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
    cur = conn.cursor()

    hashed_pw = hash_password(password)
    print(f"🔐 Password hasheado para comparación")

    cur.execute(
        "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s",
        (email, hashed_pw)
    )
    result = cur.fetchone()

    print(f"🔍 Resultado de búsqueda: {'encontrado' if result else 'no encontrado'}")

    cur.close()
    conn.close()

    if not result:
        print(f"❌ Credenciales incorrectas para: {email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales incorrectas")

    token = crear_token({"sub": email})
    print(f"✅ Login exitoso para: {email}")
    return {"access_token": token, "token_type": "bearer"}

@app.get("/containers", summary="Obtener lista de ubicaciones de contenedores")
def get_containers():
    try:
        conn = get_connection()
        if conn is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        cur = conn.cursor()
        
        def normalize_lat_lon(lat, lon):
            """Normaliza coordenadas para tolerar datos históricos con columnas invertidas.

            Regla:
            - Latitud válida: [-90, 90]
            - Longitud válida: [-180, 180]
            Si la 'lat' cae fuera de rango de latitud pero la 'lon' sí parece latitud,
            intercambiamos.
            """
            try:
                lat_f = float(lat)
                lon_f = float(lon)
            except Exception:
                return None, None

            if abs(lat_f) > 90 and abs(lon_f) <= 90:
                return lon_f, lat_f
            return lat_f, lon_f

        # Obtener contenedores superficiales (naranjas)
        # Nota: algunos datos históricos pudieron estar invertidos; se normaliza abajo.
        cur.execute("SELECT id, latitud, longitud, nombre FROM contenedores_superficiales")
        naranjas = cur.fetchall()

        # Obtener contenedores superficiales verdes (tabla separada)
        # Esta tabla fue creada para separar los verdes de los naranjas.
        cur.execute("SELECT id, latitud, longitud, nombre FROM contenedores_superficiales_verdes")
        verdes = cur.fetchall()
        
        # Obtener contenedores soterrados
        cur.execute("SELECT id, latitud, longitud FROM contenedores_soterrados") 
        soterrados = cur.fetchall()
        
        cur.close()
        conn.close()
        
        containers = []
        
        # Agregar contenedores naranjas
        for container_id, lat, lon, nombre in naranjas:
            lat_n, lon_n = normalize_lat_lon(lat, lon)
            if lat_n is None:
                continue
            containers.append({
                "id": str(container_id),
                "latitude": lat_n,
                "longitude": lon_n,
                "type": "naranja",
                "name": nombre
            })

        # Agregar contenedores verdes
        for container_id, lat, lon, nombre in verdes:
            lat_v, lon_v = normalize_lat_lon(lat, lon)
            if lat_v is None:
                continue
            containers.append({
                "id": str(container_id),
                "latitude": lat_v,
                "longitude": lon_v,
                "type": "verde",
                "name": nombre
            })
        
        # Agregar contenedores soterrados
        for container_id, lat, lon in soterrados:
            lat_s, lon_s = normalize_lat_lon(lat, lon)
            if lat_s is None:
                continue
            containers.append({
                "id": str(container_id),
                "latitude": lat_s,
                "longitude": lon_s,
                "type": "soterrado"
            })
        
        print(f"📦 Enviando {len(containers)} contenedores al cliente (naranja/verde/soterrado)")
        return containers
    except Exception as e:
        print(f"❌ Error al obtener contenedores: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al obtener contenedores: {e}")

@app.get("/perfil", summary="Obtener perfil del usuario actual (protegido)", response_model=dict)
def perfil_usuario(user_id: int = Depends(get_current_user)):
    return {"mensaje": f"Perfil del usuario con ID: {user_id}"}

@app.post("/report", summary="Enviar un nuevo reporte de contenedor (protegido)")
def create_report(report: ReportCreate, user_id: int = Depends(get_current_user)):
    try:
        conn = get_connection()
        if conn is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO reportes (latitude, longitude, description, user_id, container_id) VALUES (%s, %s, %s, %s, %s)",
            (report.latitude, report.longitude, report.description, user_id, report.container_id)
        )
        conn.commit()

        print(f"Reporte recibido y guardado: Latitud={report.latitude}, Longitud={report.longitude}, Descripción='{report.description}', User ID={user_id}, Container ID={report.container_id}")

        return {"message": "Reporte recibido exitosamente"}

    except Exception as e:
        print(f"ERROR al procesar el reporte: {e}") 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al guardar el reporte: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@app.post("/containers", summary="Crear un nuevo contenedor con coordenadas exactas (protegido)")
def create_container(container: ContainerCreate, user_id: int = Depends(get_current_user)):
    """
    Crea un nuevo contenedor con coordenadas exactas de latitud y longitud.
    
    IMPORTANTE: Para contenedores superficiales, las coordenadas se guardarán invertidas en la BD
    (columna 'latitud' contendrá la longitud y viceversa) para mantener consistencia.
    
    Args:
        container: Datos del contenedor (latitude, longitude, type)
        user_id: ID del usuario autenticado (automático)
    
    Returns:
        dict: Mensaje de éxito con el ID del contenedor creado
    """
    try:
        conn = get_connection()
        if conn is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        cur = conn.cursor()
        
        if container.type == "superficial":
            # Para superficiales: invertir coordenadas al guardar (porque la BD tiene columnas invertidas)
            # Guardamos: columna 'latitud' = longitud, columna 'longitud' = latitud
            cur.execute(
                "INSERT INTO contenedores_superficiales (latitud, longitud) VALUES (%s, %s) RETURNING id",
                (container.longitude, container.latitude)  # Invertidas al guardar
            )
        else:  # soterrado
            # Para soterrados: guardar directamente (las columnas están correctas en la BD)
            cur.execute(
                "INSERT INTO contenedores_soterrados (latitud, longitud) VALUES (%s, %s) RETURNING id",
                (container.latitude, container.longitude)  # Directo
            )
        
        container_id = cur.fetchone()[0]
        conn.commit()
        
        print(f"✅ Contenedor {container.type} creado: ID={container_id}, Lat={container.latitude}, Lon={container.longitude}")
        
        return {
            "message": f"Contenedor {container.type} creado exitosamente",
            "id": container_id,
            "latitude": container.latitude,
            "longitude": container.longitude,
            "type": container.type
        }
        
    except Exception as e:
        print(f"❌ Error al crear contenedor: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al crear contenedor: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@app.put("/containers/{container_type}/{container_id}", summary="Actualizar coordenadas de un contenedor existente (protegido)")
def update_container(container_type: str, container_id: int, container: ContainerUpdate, user_id: int = Depends(get_current_user)):
    """
    Actualiza las coordenadas de un contenedor existente.
    
    IMPORTANTE: Para contenedores superficiales, las coordenadas se guardarán invertidas en la BD.
    
    Args:
        container_type: Tipo de contenedor ('superficial' o 'soterrado')
        container_id: ID del contenedor a actualizar
        container: Nuevas coordenadas (latitude, longitude opcionales)
        user_id: ID del usuario autenticado (automático)
    
    Returns:
        dict: Mensaje de éxito con las coordenadas actualizadas
    """
    try:
        if container_type not in ["superficial", "soterrado"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tipo de contenedor debe ser 'superficial' o 'soterrado'")
        
        if container.latitude is None and container.longitude is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Debe proporcionar al menos latitude o longitude para actualizar")
        
        conn = get_connection()
        if conn is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        cur = conn.cursor()
        
        # Primero obtener las coordenadas actuales
        if container_type == "superficial":
            cur.execute("SELECT latitud, longitud FROM contenedores_superficiales WHERE id = %s", (container_id,))
            table_name = "contenedores_superficiales"
        else:
            cur.execute("SELECT latitud, longitud FROM contenedores_soterrados WHERE id = %s", (container_id,))
            table_name = "contenedores_soterrados"
        
        existing = cur.fetchone()
        if existing is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Contenedor {container_type} con ID {container_id} no encontrado")
        
        # Usar nuevas coordenadas o mantener las existentes
        if container_type == "superficial":
            # Para superficiales: invertir al guardar
            # existing[0] = longitud real (guardada en columna 'latitud')
            # existing[1] = latitud real (guardada en columna 'longitud')
            new_lat_col = container.longitude if container.longitude is not None else existing[0]  # La columna 'latitud' en BD contiene longitud
            new_lon_col = container.latitude if container.latitude is not None else existing[1]   # La columna 'longitud' en BD contiene latitud
            actual_lat = container.latitude if container.latitude is not None else existing[1]   # Latitud real para respuesta
            actual_lon = container.longitude if container.longitude is not None else existing[0]  # Longitud real para respuesta
        else:  # soterrado
            # Para soterrados: guardar directamente
            new_lat_col = container.latitude if container.latitude is not None else existing[0]
            new_lon_col = container.longitude if container.longitude is not None else existing[1]
            actual_lat = new_lat_col
            actual_lon = new_lon_col
        
        # Actualizar en la BD
        cur.execute(
            f"UPDATE {table_name} SET latitud = %s, longitud = %s WHERE id = %s",
            (new_lat_col, new_lon_col, container_id)
        )
        
        conn.commit()
        
        print(f"✅ Contenedor {container_type} ID={container_id} actualizado: Lat={actual_lat}, Lon={actual_lon}")
        
        return {
            "message": f"Contenedor {container_type} actualizado exitosamente",
            "id": container_id,
            "latitude": actual_lat,
            "longitude": actual_lon,
            "type": container_type
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error al actualizar contenedor: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al actualizar contenedor: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@app.delete("/containers/{container_type}/{container_id}", summary="Eliminar un contenedor (protegido)")
def delete_container(container_type: str, container_id: int, user_id: int = Depends(get_current_user)):
    """
    Elimina un contenedor de la base de datos.
    
    Args:
        container_type: Tipo de contenedor ('superficial' o 'soterrado')
        container_id: ID del contenedor a eliminar
        user_id: ID del usuario autenticado (automático)
    
    Returns:
        dict: Mensaje de éxito
    """
    try:
        if container_type not in ["superficial", "soterrado"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tipo de contenedor debe ser 'superficial' o 'soterrado'")
        
        conn = get_connection()
        if conn is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        cur = conn.cursor()
        
        table_name = f"contenedores_{container_type}"
        cur.execute(f"DELETE FROM {table_name} WHERE id = %s RETURNING id", (container_id,))
        
        deleted = cur.fetchone()
        if deleted is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Contenedor {container_type} con ID {container_id} no encontrado")
        
        conn.commit()
        
        print(f"✅ Contenedor {container_type} ID={container_id} eliminado")
        
        return {
            "message": f"Contenedor {container_type} eliminado exitosamente",
            "id": container_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error al eliminar contenedor: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al eliminar contenedor: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()

@app.post("/dump-reports", summary="Crear un reporte de vertedero ilegal con foto (protegido)")
async def create_dump_report(
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(None),
    photo: UploadFile = File(...),
    user_id: int = Depends(get_current_user)
):
    """
    Crea un nuevo reporte de vertedero ilegal con foto.
    
    Args:
        latitude: Latitud del vertedero
        longitude: Longitud del vertedero
        description: Descripción opcional del vertedero
        photo: Archivo de imagen del vertedero
        user_id: ID del usuario autenticado (automático)
    
    Returns:
        dict: Mensaje de éxito con el ID del reporte creado
    """
    try:
        # Validar coordenadas
        if not (-90 <= latitude <= 90):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Latitud inválida")
        if not (-180 <= longitude <= 180):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Longitud inválida")
        
        # Validar tipo de archivo
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        file_extension = os.path.splitext(photo.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Tipo de archivo no permitido. Use: {', '.join(allowed_extensions)}"
            )
        
        # Crear directorio uploads si no existe
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Generar nombre único para la foto
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(uploads_dir, unique_filename)
        
        # Guardar archivo
        with open(file_path, 'wb') as f:
            content = await photo.read()
            f.write(content)
        
        # Guardar en base de datos
        conn = get_connection()
        if conn is None:
            # Si falla, eliminar archivo guardado
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error de conexión a la base de datos")
        
        cur = conn.cursor()
        
        cur.execute(
            """INSERT INTO reportes_vertederos (user_id, latitude, longitude, description, photo_path) 
               VALUES (%s, %s, %s, %s, %s) RETURNING id""",
            (user_id, latitude, longitude, description, unique_filename)
        )
        
        report_id = cur.fetchone()[0]
        conn.commit()
        
        print(f"✅ Reporte de vertedero creado: ID={report_id}, Lat={latitude}, Lon={longitude}, Foto={unique_filename}")
        
        return {
            "message": "Reporte de vertedero creado exitosamente",
            "id": report_id,
            "latitude": latitude,
            "longitude": longitude,
            "description": description,
            "photo_filename": unique_filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Si hay error, eliminar archivo si se guardó
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        print(f"❌ Error al crear reporte de vertedero: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al crear reporte: {e}")
    finally:
        if 'cur' in locals() and cur is not None:
            cur.close()
        if 'conn' in locals() and conn is not None:
            conn.close()
