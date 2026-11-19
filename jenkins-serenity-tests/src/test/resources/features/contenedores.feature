# language: es
Característica: Contenedores - Gestión de contenedores
  Como operador del sistema
  Quiero gestionar los contenedores registrados
  Para mantener actualizada la información del sistema

  Antecedentes:
    Dado que el backend de UbiContainer está corriendo en "http://localhost:8000"

  @regression
  Escenario: Listar todos los contenedores
    Cuando hago una petición GET a "/containers"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe ser una lista JSON

  @regression
  Escenario: No permitir crear un contenedor sin autenticación
    Cuando creo un contenedor con los siguientes datos:
      | type        | latitude | longitude |
      | superficial | -17.3895 | -66.1568  |
    Entonces el código de respuesta debe ser 401

  @regression
  Escenario: Verificar que un contenedor tiene coordenadas válidas
    Cuando hago una petición GET a "/containers"
    Entonces el código de respuesta debe ser 200
    Y cada contenedor debe tener latitud entre -90 y 90
    Y cada contenedor debe tener longitud entre -180 y 180
