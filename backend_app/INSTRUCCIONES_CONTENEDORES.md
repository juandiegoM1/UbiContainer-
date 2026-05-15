# 📦 Instrucciones para Gestionar Contenedores con Coordenadas Exactas

## 🎯 Endpoints Disponibles

Tu backend ahora tiene 3 endpoints para gestionar contenedores:

1. **POST `/containers`** - Crear un nuevo contenedor
2. **PUT `/containers/{container_type}/{container_id}`** - Actualizar coordenadas de un contenedor
3. **DELETE `/containers/{container_type}/{container_id}`** - Eliminar un contenedor

Todos los endpoints requieren **autenticación** (debes estar logueado).

---

## 📍 Cómo Obtener Tu Token de Autenticación

Primero necesitas obtener tu token de autenticación:

```bash
# Login
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=tu_email@ejemplo.com&password=tu_contraseña"
```

Respuesta:
```json
{
  "access_token": "tu_token_aqui",
  "token_type": "bearer"
}
```

Guarda el token para usarlo en las siguientes peticiones.

---

## ✅ 1. Crear un Nuevo Contenedor

**Endpoint:** `POST /containers`

**Headers:**
```
Authorization: Bearer tu_token_aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "latitude": -17.390004,
  "longitude": -66.145537,
  "type": "soterrado"
}
```

**Tipos válidos:** `"superficial"` o `"soterrado"`

**Ejemplo con cURL:**
```bash
curl -X POST "http://localhost:8000/containers" \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -17.390004,
    "longitude": -66.145537,
    "type": "soterrado"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Contenedor soterrado creado exitosamente",
  "id": 123,
  "latitude": -17.390004,
  "longitude": -66.145537,
  "type": "soterrado"
}
```

**Nota importante:** 
- Para contenedores **superficiales**, el backend automáticamente invierte las coordenadas al guardar (porque la BD tiene las columnas invertidas).
- Para contenedores **soterrados**, las coordenadas se guardan directamente.
- **Tú siempre proporcionas las coordenadas correctas** (latitude=-17.xx, longitude=-66.xx para Cochabamba).

---

## 🔄 2. Actualizar Coordenadas de un Contenedor Existente

**Endpoint:** `PUT /containers/{container_type}/{container_id}`

**Parámetros:**
- `container_type`: `"superficial"` o `"soterrado"`
- `container_id`: ID del contenedor a actualizar

**Headers:**
```
Authorization: Bearer tu_token_aqui
Content-Type: application/json
```

**Body (JSON):**
Puedes actualizar solo la latitud, solo la longitud, o ambas:
```json
{
  "latitude": -17.396269,
  "longitude": -66.175344
}
```

O solo una coordenada:
```json
{
  "latitude": -17.396269
}
```

**Ejemplo con cURL:**
```bash
curl -X PUT "http://localhost:8000/containers/soterrado/5" \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -17.396269,
    "longitude": -66.175344
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Contenedor soterrado actualizado exitosamente",
  "id": 5,
  "latitude": -17.396269,
  "longitude": -66.175344,
  "type": "soterrado"
}
```

---

## ❌ 3. Eliminar un Contenedor

**Endpoint:** `DELETE /containers/{container_type}/{container_id}`

**Parámetros:**
- `container_type`: `"superficial"` o `"soterrado"`
- `container_id`: ID del contenedor a eliminar

**Headers:**
```
Authorization: Bearer tu_token_aqui
```

**Ejemplo con cURL:**
```bash
curl -X DELETE "http://localhost:8000/containers/soterrado/5" \
  -H "Authorization: Bearer tu_token_aqui"
```

**Respuesta exitosa:**
```json
{
  "message": "Contenedor soterrado eliminado exitosamente",
  "id": 5
}
```

---

## 📊 Coordenadas de Referencia para Cochabamba

**Ubicación aproximada de Cochabamba:**
- **Latitud:** `-17.39` (rango típico: -17.35 a -17.45)
- **Longitud:** `-66.15` (rango típico: -66.10 a -66.20)

**Ejemplos de coordenadas válidas en Cochabamba:**
```json
// Centro de Cochabamba
{"latitude": -17.3895, "longitude": -66.1568}

// Zona sur
{"latitude": -17.4168, "longitude": -66.1517}

// Zona norte
{"latitude": -17.3693, "longitude": -66.1759}
```

---

## 🛠️ Ejemplos Prácticos

### Agregar varios contenedores soterrados:

```bash
# Contenedor 1
curl -X POST "http://localhost:8000/containers" \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -17.390004, "longitude": -66.145537, "type": "soterrado"}'

# Contenedor 2
curl -X POST "http://localhost:8000/containers" \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -17.396269, "longitude": -66.175344, "type": "soterrado"}'

# Contenedor 3 (superficial)
curl -X POST "http://localhost:8000/containers" \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -17.383859, "longitude": -66.160464, "type": "superficial"}'
```

### Actualizar un contenedor que tiene coordenadas incorrectas:

```bash
# Primero identifica el ID del contenedor incorrecto desde la app o la BD
# Luego actualiza sus coordenadas

curl -X PUT "http://localhost:8000/containers/soterrado/1" \
  -H "Authorization: Bearer tu_token" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -17.390004, "longitude": -66.145537}'
```

---

## 🌐 Usando la Documentación Interactiva de FastAPI

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva:

1. **Swagger UI:** `http://localhost:8000/docs`
2. **ReDoc:** `http://localhost:8000/redoc`

Desde ahí puedes probar los endpoints directamente con una interfaz gráfica.

---

## ⚠️ Errores Comunes

1. **401 Unauthorized:** No has proporcionado el token o el token ha expirado. Haz login nuevamente.

2. **400 Bad Request:** 
   - Tipo de contenedor debe ser "superficial" o "soterrado"
   - Coordenadas fuera de rango (latitude: -90 a 90, longitude: -180 a 180)

3. **404 Not Found:** El contenedor con ese ID no existe.

4. **500 Internal Server Error:** Error en el servidor o base de datos. Revisa los logs del servidor.

---

## 📝 Notas Importantes

1. **Coordenadas:** Siempre proporciona coordenadas en formato decimal:
   - ✅ Correcto: `-17.390004`
   - ❌ Incorrecto: `17°23'24" S`

2. **Precisión:** Usa al menos 6 decimales para precisión de metros:
   - `-17.390004` (buena precisión)
   - `-17.39` (precisión limitada)

3. **Ubicación:** Asegúrate de que las coordenadas estén dentro de Cochabamba:
   - Latitud: aproximadamente `-17.39`
   - Longitud: aproximadamente `-66.15`

---

## 🔍 Cómo Obtener Coordenadas Exactas

Puedes usar:
- **Google Maps:** Click derecho en el lugar → "¿Qué hay aquí?" → Copia las coordenadas
- **GPS de tu teléfono:** Usa una app de GPS para obtener coordenadas precisas
- **Mapbox:** Usa el mapa interactivo para obtener coordenadas

---

¡Listo! Ahora puedes gestionar tus contenedores con coordenadas exactas. 🎉


