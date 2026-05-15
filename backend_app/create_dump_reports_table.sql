-- Crear tabla para reportes de vertederos ilegales
CREATE TABLE IF NOT EXISTS reportes_vertederos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    photo_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_reportes_vertederos_user_id ON reportes_vertederos(user_id);
CREATE INDEX IF NOT EXISTS idx_reportes_vertederos_created_at ON reportes_vertederos(created_at DESC);
