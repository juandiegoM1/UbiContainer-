# language: es
@frontend
Característica: Consulta de contenedores
  Como administrador
  Quiero consultar y filtrar contenedores
  Para encontrar registros del sistema

  @smoke
  Escenario: Mostrar la lista y los indicadores de contenedores
    Dado que tengo una sesión de administrador
    Cuando abro la sección de contenedores
    Entonces se muestran la lista de contenedores y sus indicadores

  Escenario: Buscar, filtrar por tipo y limpiar los filtros
    Dado que tengo una sesión de administrador
    Cuando busco, filtro por tipo y limpio los filtros de contenedores
    Entonces se muestran todos los tipos de contenedor y la búsqueda queda vacía
