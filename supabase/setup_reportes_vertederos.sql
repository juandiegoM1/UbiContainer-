-- =============================================================================
-- UbiContainer: reportes de vertederos (app movil + dashboard web)
-- =============================================================================
-- COMO APLICAR:
--   1. Abre https://supabase.com/dashboard → tu proyecto → SQL Editor
--   2. Pega y ejecuta TODO este archivo de una sola vez
--
-- Habilita:
--   - Lectura de reportes en el dashboard
--   - Cambio de estado (pendiente / en_proceso / atendido) desde el dashboard
--   - Tiempo real: cuando el dashboard cambia el estado, la app movil se actualiza
--   - Fotos del bucket dump-reports
-- =============================================================================

BEGIN;

-- Columna de estado (si aun no existe)
ALTER TABLE public.reportes_vertederos
  ADD COLUMN IF NOT EXISTS estado text NOT NULL DEFAULT 'pendiente';

ALTER TABLE public.reportes_vertederos
  DROP CONSTRAINT IF EXISTS reportes_vertederos_estado_check;

ALTER TABLE public.reportes_vertederos
  ADD CONSTRAINT reportes_vertederos_estado_check
  CHECK (estado IN ('pendiente', 'en_proceso', 'atendido'));

-- Necesario para que Realtime envie el id y el estado al actualizar desde el dashboard
ALTER TABLE public.reportes_vertederos REPLICA IDENTITY FULL;

ALTER TABLE public.reportes_vertederos ENABLE ROW LEVEL SECURITY;

-- 1) Dashboard y app: leer reportes
DROP POLICY IF EXISTS "reportes_select_dashboard" ON public.reportes_vertederos;
CREATE POLICY "reportes_select_dashboard"
  ON public.reportes_vertederos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2) App movil: crear reportes (usuario autenticado)
DROP POLICY IF EXISTS "reportes_insert_mobile" ON public.reportes_vertederos;
CREATE POLICY "reportes_insert_mobile"
  ON public.reportes_vertederos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3) Dashboard: cambiar estado de reportes
DROP POLICY IF EXISTS "reportes_update_dashboard" ON public.reportes_vertederos;
CREATE POLICY "reportes_update_dashboard"
  ON public.reportes_vertederos
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4) Storage: usuarios autenticados suben fotos al bucket dump-reports
DROP POLICY IF EXISTS "dump_reports_auth_upload" ON storage.objects;
CREATE POLICY "dump_reports_auth_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dump-reports');

-- 5) Storage: lectura de fotos (dashboard + app)
DROP POLICY IF EXISTS "dump_reports_public_read" ON storage.objects;
CREATE POLICY "dump_reports_public_read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'dump-reports');

-- 6) Bucket publico para URLs de fotos
UPDATE storage.buckets
SET public = true
WHERE id = 'dump-reports';

COMMIT;

-- 7) Tiempo real: cambios de estado en dashboard → app movil
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'reportes_vertederos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reportes_vertederos;
  END IF;
END $$;

-- Verificacion rapida (opcional)
SELECT id, estado, created_at
FROM public.reportes_vertederos
ORDER BY created_at DESC
LIMIT 5;
