# language: es
@frontend
Característica: Alertas de capacidad
  Como administrador
  Quiero ver los contenedores que requieren atención
  Para priorizar su revisión

  Escenario: Listar contenedores con alerta de capacidad
    Dado que tengo una sesión de administrador
    Cuando abro la sección de alertas de capacidad
    Entonces solo se listan los contenedores que requieren atención
