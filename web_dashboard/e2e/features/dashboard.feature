# language: es
@frontend
Característica: Resumen del dashboard
  Como administrador
  Quiero ver un resumen operativo
  Para conocer el estado del sistema

  @smoke
  Escenario: Mostrar métricas y secciones operativas
    Dado que tengo una sesión de administrador
    Cuando abro el dashboard
    Entonces se muestran el resumen y las secciones operativas
