# language: es
@frontend
Característica: Acceso al panel administrativo
  Como administrador
  Quiero iniciar sesión en UbiContainer
  Para acceder al dashboard

  Escenario: Exigir los campos obligatorios del inicio de sesión
    Dado que abro la página de inicio de sesión
    Cuando envío el formulario sin completar los campos obligatorios
    Entonces el formulario permanece abierto y exige el correo

  @smoke
  Escenario: Iniciar sesión con credenciales demo válidas
    Dado que abro la página de inicio de sesión
    Cuando inicio sesión con credenciales demo válidas
    Entonces se muestra el panel de control

  Escenario: Rechazar credenciales inválidas
    Dado que abro la página de inicio de sesión
    Cuando inicio sesión con credenciales inválidas
    Entonces la página de inicio de sesión muestra un mensaje de credenciales inválidas
