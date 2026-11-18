#!/bin/bash
# ============================================================
# Script de inicio del backend - UbiContainer
# Uso: ./start_backend.sh
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend_app"

echo "🚀 Iniciando backend UbiContainer..."
echo "   Directorio: $BACKEND_DIR"
echo ""

# Verificar que existe el venv
if [ ! -f "$BACKEND_DIR/venv/bin/python3" ]; then
    echo "❌ No se encontró el venv. Recreando..."
    cd "$BACKEND_DIR"
    python3 -m venv venv
    venv/bin/pip install fastapi "uvicorn[standard]" psycopg2-binary pydantic \
        python-dotenv email-validator python-multipart flask flask-cors \
        "python-jose[cryptography]" passlib bcrypt
fi

# Iniciar servidor
echo "✅ Levantando servidor en http://127.0.0.1:8000 ..."
echo "   (Presiona Ctrl+C para detener)"
echo ""

cd "$BACKEND_DIR"
venv/bin/uvicorn app:app --host 0.0.0.0 --port 8000 --reload
