-- Capacidad volumetrica (litros) por contenedor.
-- Solo para base de datos / reportes internos. No se muestra en app movil ni web.

ALTER TABLE public.contenedores
  ADD COLUMN IF NOT EXISTS capacidad integer;

COMMENT ON COLUMN public.contenedores.capacidad IS
  'Capacidad en litros del contenedor (ej. verdes 2500 L).';
