-- Ejecutar TODO este bloque en Supabase SQL Editor (en orden).
-- Paso 1: crear la columna (obligatorio antes del UPDATE)
-- Paso 2: asignar capacidad a los contenedores verdes

ALTER TABLE public.contenedores
  ADD COLUMN IF NOT EXISTS capacidad integer;

COMMENT ON COLUMN public.contenedores.capacidad IS
  'Capacidad en litros del contenedor (ej. verdes 2500 L).';

UPDATE public.contenedores
SET capacidad = 2500
WHERE tipo = 'verde';

-- Verificar
SELECT id, nombre, tipo, cantidad, capacidad
FROM public.contenedores
WHERE tipo = 'verde'
ORDER BY id;
