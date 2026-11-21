# language: es
@frontend
Característica: Sesión y navegación del dashboard
  Como administrador
  Quiero mantener protegida mi sesión y navegar por el panel
  Para consultar sus módulos

  @smoke
  Escenario: Redirigir al login al abrir una ruta protegida sin sesión
    Cuando abro directamente el dashboard sin una sesión
    Entonces soy redirigido a la página de inicio de sesión

  Escenario: Navegar por las secciones del dashboard
    Dado que tengo una sesión de administrador
    Cuando sigo la navegación del dashboard
      | label         | path             | heading                 |
      | Dashboard     | /dashboard       | Panel de Control        |
      | Contenedores  | /contenedores    | Contenedores            |
      | Mapa          | /mapa            | Mapa de Contenedores    |
      | Reportes      | /reportes        | Reportes de Vertederos  |
      | Alertas       | /alertas         | Alertas de capacidad    |
      | Configuracion | /configuracion   | Configuracion           |
    Entonces se alcanza cada sección del dashboard
      | path             |
      | /dashboard       |
      | /contenedores    |
      | /mapa            |
      | /reportes        |
      | /alertas         |
      | /configuracion   |

  Escenario: Cerrar sesión y limpiar la sesión local
    Dado que tengo una sesión de administrador
    Cuando cierro mi sesión
    Entonces vuelvo al login y la sesión queda eliminada
