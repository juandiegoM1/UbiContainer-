# language: es
Característica: Contenedores - Gestión de contenedores
  Como operador del sistema
  Quiero gestionar los contenedores registrados
  Para mantener actualizada la información del sistema

  Antecedentes:
    Dado que el backend de UbiContainer está corriendo en "http://localhost:8000"

  Escenario: Listar todos los contenedores
    Cuando hago una petición GET a "/contenedores"
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe ser una lista JSON

  Escenario: Crear un nuevo contenedor
    Cuando creo un contenedor con los siguientes datos:
      | tipo     | latitude  | longitude  | nombre               |
      | verde    | -17.3895  | -66.1568   | Test Contenedor BDD  |
    Entonces el código de respuesta debe ser 200
    Y la respuesta debe contener el campo "id"
    Y la respuesta debe contener tipo "verde"

  Escenario: Verificar que un contenedor tiene coordenadas válidas
    Cuando hago una petición GET a "/contenedores"
    Entonces el código de respuesta debe ser 200
    Y cada contenedor debe tener latitud entre -90 y 90
    Y cada contenedor debe tener longitud entre -180 y 180
