-- UbiContainer: capacidad de llenado para contenedores
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.contenedores
  ADD COLUMN IF NOT EXISTS nivel_llenado integer NOT NULL DEFAULT 0;

ALTER TABLE public.contenedores
  DROP CONSTRAINT IF EXISTS contenedores_nivel_llenado_check;

ALTER TABLE public.contenedores
  ADD CONSTRAINT contenedores_nivel_llenado_check
  CHECK (nivel_llenado >= 0 AND nivel_llenado <= 100);

-- estado operativo: activo | fuera_de_servicio | lleno
-- (ademas de nivel_llenado 0-100 para porcentaje de capacidad)
