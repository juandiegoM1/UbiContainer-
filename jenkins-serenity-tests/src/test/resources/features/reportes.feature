# language: es
Característica: Reportes de Vertederos Ilegales
  Como administrador de EMSA
  Quiero consultar los reportes de vertederos ilegales
  Para gestionar y atender las denuncias ciudadanas

  Antecedentes:
    Dado que el backend de UbiContainer está corriendo en "http://localhost:8000"

  @regression
  Escenario: No permitir crear un reporte de vertedero sin autenticación
    Cuando intento crear un reporte de vertedero sin autenticarme
    Entonces el código de respuesta debe ser 401
