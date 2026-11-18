# language: es
Característica: Dashboard - Panel de Control
  Como administrador de EMSA
  Quiero ver el panel de control del dashboard
  Para monitorear el estado operativo de los contenedores urbanos

  Antecedentes:
    Dado que el backend de UbiContainer está corriendo en "http://localhost:8000"
    Y que el dashboard está disponible en "http://localhost:3000"

  @smoke
  Escenario: Verificar que el backend responde correctamente
    Cuando hago una petición GET a "/"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener el campo "message"

  Escenario: Obtener estadísticas de contenedores
    Cuando hago una petición GET a "/contenedores"
    Entonces el código de respuesta debe ser 200
    Y cada contenedor debe tener los campos "id", "tipo", "latitude", "longitude"

  Escenario: Verificar tipos de contenedores válidos
    Cuando hago una petición GET a "/contenedores"
    Entonces el código de respuesta debe ser 200
    Y los tipos de contenedor deben ser "verde", "naranja" o "soterrado"

  @smoke
  Escenario: El login del dashboard carga sin errores
    Cuando accedo al dashboard en "http://localhost:3000/"
    Entonces la página debe responder con código 200
