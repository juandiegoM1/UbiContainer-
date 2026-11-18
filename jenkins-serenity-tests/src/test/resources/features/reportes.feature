# language: es
Característica: Reportes de Vertederos Ilegales
  Como administrador de EMSA
  Quiero consultar los reportes de vertederos ilegales
  Para gestionar y atender las denuncias ciudadanas

  Antecedentes:
    Dado que el backend de UbiContainer está corriendo en "http://localhost:8000"

  Escenario: Listar reportes de vertederos
    Cuando hago una petición GET a "/dump-reports"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe ser una lista JSON

  Escenario: Cada reporte tiene ubicación geográfica
    Cuando hago una petición GET a "/dump-reports"
    Entonces el código de respuesta debe ser 200
    Y cada reporte debe tener los campos "latitude", "longitude", "estado"

  Escenario: Los estados de reportes son válidos
    Cuando hago una petición GET a "/dump-reports"
    Entonces el código de respuesta debe ser 200
    Y los estados de reporte deben ser "pendiente", "en_proceso" o "atendido"
