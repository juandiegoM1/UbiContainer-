#!/bin/bash
# ============================================================
# Script de configuración Flutter + iOS para UbiContainer
# Ejecutar DESPUÉS de que Flutter esté instalado
# ============================================================

FLUTTER=/Users/macbook/flutter/bin/flutter
PROJECT_DIR="/Users/macbook/Documents/ubi_container_new"

echo "=============================================="
echo "  UbiContainer - Setup Flutter + Xcode iOS"
echo "=============================================="
echo ""

# 1. Verificar Flutter
echo "1️⃣  Verificando Flutter..."
if [ ! -f "$FLUTTER" ]; then
    echo "❌ Flutter no encontrado en /Users/macbook/flutter/bin/flutter"
    echo "   Asegúrate de que el git clone haya terminado"
    exit 1
fi
$FLUTTER --version
echo ""

# 2. Agregar Flutter al PATH temporalmente
export PATH="/Users/macbook/flutter/bin:$PATH"

# 3. Aceptar licencias de Xcode
echo "2️⃣  Verificando Xcode..."
sudo xcodebuild -license accept 2>/dev/null || echo "   (Licencia ya aceptada o requiere contraseña)"
echo ""

# 4. Flutter pub get
echo "3️⃣  Ejecutando flutter pub get..."
cd "$PROJECT_DIR"
$FLUTTER pub get
echo ""

# 5. Instalar pods de iOS
echo "4️⃣  Instalando CocoaPods..."
cd "$PROJECT_DIR/ios"
pod install --repo-update
echo ""

# 6. Flutter doctor
echo "5️⃣  Flutter doctor:"
$FLUTTER doctor -v
echo ""

echo "=============================================="
echo "✅ Configuración completa!"
echo ""
echo "Para correr en Xcode:"
echo "1. Abre: open $PROJECT_DIR/ios/Runner.xcworkspace"
echo "2. Selecciona un simulador iOS"  
echo "3. Presiona ▶ Run"
echo ""
echo "Para correr desde terminal:"
echo "   $FLUTTER run -d <device_id>"
echo "   $FLUTTER devices  (para ver dispositivos)"
echo "=============================================="
