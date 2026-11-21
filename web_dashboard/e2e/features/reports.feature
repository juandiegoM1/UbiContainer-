# language: es
@frontend
Característica: Consulta de reportes
  Como administrador
  Quiero revisar y actualizar reportes ciudadanos
  Para dar seguimiento a los incidentes

  @smoke
  Escenario: Filtrar reportes pendientes
    Dado que tengo una sesión de administrador
    Y abro la sección de reportes
    Cuando filtro los reportes por estado pendiente
    Entonces solo se muestran los reportes pendientes

  Escenario: Actualizar el estado de un reporte desde la interfaz
    Dado que tengo una sesión de administrador
    Y abro la sección de reportes
    Cuando cambio el reporte pendiente a en proceso
    Entonces se muestra el nuevo estado y la actualización usa datos de prueba
