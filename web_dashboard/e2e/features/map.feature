# language: es
@frontend
Característica: Mapa de contenedores
  Como administrador
  Quiero abrir el módulo del mapa
  Para consultar la vista y sus acciones

  Escenario: Mostrar el mapa y la acción para registrar un contenedor
    Dado que tengo una sesión de administrador
    Cuando abro la sección del mapa
    Entonces se muestran el título del mapa y la acción de contenedores
