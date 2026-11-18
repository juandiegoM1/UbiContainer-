-- Corrige la secuencia de IDs tras cargas manuales de inventario.
-- Evita el error: duplicate key value violates unique constraint "contenedores_pkey"

SELECT setval(
  pg_get_serial_sequence('public.contenedores', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM public.contenedores)
);
