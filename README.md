# UbiContainer-
plataforma web y móvil para la gestión de residuos urbanos en EMSA Cochabamba

## Arquitectura de software del proyecto

UbiContainer está dividido en tres partes principales: una aplicación móvil, un sistema web tipo dashboard y un backend encargado de comunicar ambas partes con la base de datos.

La idea general es que la app móvil sea usada en campo por los usuarios o personal operativo, mientras que el sistema web sirva como panel de control para revisar información, reportes y estado general del sistema.

---

## App móvil

La app móvil está desarrollada con Flutter, lo que permite mantener una sola base de código para Android y iOS.

Su arquitectura está organizada por pantallas, servicios y modelos. Cada pantalla se encarga de una parte visible de la aplicación, mientras que los servicios manejan la comunicación con el backend y la lógica que no debería estar mezclada directamente con la interfaz.

### Partes principales de la app móvil

- **Pantallas de acceso:** incluyen la pantalla de bienvenida, login y registro de usuarios.
- **Pantalla de mapa:** muestra la ubicación de contenedores y permite interactuar con puntos geográficos.
- **Pantallas de reportes:** permiten crear reportes relacionados con contenedores o vertederos ilegales.
- **Servicios:** manejan tareas como autenticación, envío de reportes y almacenamiento temporal cuando sea necesario.
- **Modelos:** representan los datos principales que usa la app, como usuarios, contenedores o reportes.
- **Archivos de configuración:** guardan valores como la URL del backend y tokens locales que no deben subirse al repositorio.

### Flujo básico de la app móvil

1. El usuario abre la app.
2. Inicia sesión o se registra.
3. La app se conecta al backend para validar los datos.
4. El usuario puede ver el mapa, revisar contenedores o enviar reportes.
5. El backend recibe la información y la guarda en la base de datos.

Esta estructura ayuda a separar la parte visual de la lógica del sistema, haciendo que la app sea más fácil de mantener y mejorar.

---

## Sistema web dashboard

El sistema web está desarrollado con React, TypeScript y Vite. Su objetivo es funcionar como un panel administrativo para visualizar y gestionar la información del proyecto desde un navegador.

La arquitectura del dashboard está organizada por rutas y páginas. Cada página representa una sección del sistema, por ejemplo el panel principal, el mapa, los reportes y la configuración.

### Partes principales del sistema web

- **Login:** pantalla inicial para acceder al dashboard.
- **Dashboard principal:** muestra indicadores generales como cantidad de contenedores, reportes y estado del sistema.
- **Mapa:** sección pensada para visualizar contenedores por ubicación.
- **Reportes:** permite revisar reportes registrados y filtrarlos por estado.
- **Configuración:** sección para opciones generales del panel.
- **Configuración de API:** centraliza la URL del backend para poder conectar el frontend con FastAPI.

### Flujo básico del dashboard

1. El administrador entra al sistema web.
2. Accede al dashboard desde el login.
3. Navega entre las secciones usando la barra lateral.
4. Consulta información resumida, reportes y datos relacionados con contenedores.
5. Más adelante, el dashboard puede conectarse directamente al backend para trabajar con datos reales.

El dashboard está pensado para crecer por módulos. Esto significa que se pueden agregar nuevas páginas o funciones sin tener que rehacer toda la estructura.

---

## Backend y base de datos

El backend está desarrollado con FastAPI y funciona como el punto central de comunicación entre la app móvil, el dashboard web y la base de datos PostgreSQL.

Su responsabilidad principal es recibir solicitudes, validar datos, consultar o modificar la base de datos y devolver respuestas a los clientes.

### Responsabilidades del backend

- Registrar usuarios.
- Iniciar sesión y generar tokens de acceso.
- Entregar la lista de contenedores.
- Recibir reportes de contenedores.
- Recibir reportes de vertederos ilegales con fotografía.
- Crear, actualizar o eliminar contenedores cuando sea necesario.
- Conectarse con PostgreSQL usando variables de entorno.

### Flujo general del sistema

```text
App móvil / Dashboard web
            |
            v
        Backend FastAPI
            |
            v
     Base de datos PostgreSQL
```

La app móvil y el sistema web no acceden directamente a la base de datos. Todo pasa por el backend, lo que permite controlar mejor la seguridad, la validación de datos y la lógica del proyecto.

---

## Organización general

```text
ubi_container_new/
├── lib/                  App móvil Flutter
├── backend_app/           Backend FastAPI
├── web_dashboard/         Sistema web React + TypeScript
├── android/               Configuración Android
├── ios/                   Configuración iOS
└── README.md              Documentación general
```

Esta separación permite trabajar cada parte del proyecto de forma ordenada. La app móvil se enfoca en el uso en campo, el dashboard en la visualización administrativa y el backend en la lógica y conexión con datos.

