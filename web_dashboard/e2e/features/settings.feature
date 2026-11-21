# language: es
@frontend
Característica: Preferencias del dashboard
  Como administrador
  Quiero cambiar y restaurar mis preferencias
  Para personalizar la interfaz

  Escenario: Conservar el modo oscuro después de recargar
    Dado que tengo una sesión de administrador
    Y abro la configuración
    Cuando activo el modo oscuro y recargo la configuración
    Entonces el modo oscuro permanece activo después de recargar

  Escenario: Restaurar las preferencias predeterminadas
    Dado que tengo una sesión de administrador
    Y cambié las preferencias de apariencia e idioma
    Cuando restauro la configuración predeterminada
    Entonces se restauran la apariencia y el idioma predeterminados
