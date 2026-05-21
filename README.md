# UbiContainer-
plataforma web y móvil para la gestión de residuos urbanos en EMSA Cochabamba

## Configuración inicial (después de clonar) y evitar poner los token de la API de Mapbox en el código e informacion sensible 

Por seguridad, los **tokens y credenciales** no se versionan en este repositorio.
Después de clonar se  debes crear los siguientes archivos locales para que pueda funcionar sin problemas:

### 1. Backend (FastAPI)

Crear `backend_app/.env` (ver plantilla en `backend_app/.env.example`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ubicontainer
DB_USER=tu_usuario
DB_PASSWORD=mi_password
```

### 2. Mapbox – Android

Agregar tu token al final de `android/local.properties`:

```properties
MAPBOX_ACCESS_TOKEN=TU_TOKEN_DE_MAPBOX_AQUI
```

### 3. Mapbox – iOS

Copiar la plantilla y reemplazar el valor:

```bash
cp ios/Flutter/Mapbox.example.xcconfig ios/Flutter/Mapbox.xcconfig
```

Editar `ios/Flutter/Mapbox.xcconfig` y reemplazar `TU_TOKEN_DE_MAPBOX_AQUI` por tu token real.

### 4. Mapbox – Dart (cliente Flutter)

Copiar la plantilla y reemplazar el valor:

```bash
cp lib/secrets.example.dart lib/secrets.dart
```

Editar `lib/secrets.dart` y reemplazar `TU_TOKEN_DE_MAPBOX_AQUI` por tu token real.

### 5. Build

Después de configurar los tokens:

```bash
flutter clean
flutter pub get
flutter run
```

> ⚠️ Estos 4 archivos están en `.gitignore` y **nunca deben subirse al repositorio por seguridad obviamente dejo esto por aqu**.

