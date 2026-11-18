-- Permisos para que el dashboard web lea y gestione contenedores
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.contenedores
  ADD COLUMN IF NOT EXISTS creado_por text;

ALTER TABLE public.contenedores
  ADD COLUMN IF NOT EXISTS nivel_llenado integer NOT NULL DEFAULT 0;

ALTER TABLE public.contenedores
  DROP CONSTRAINT IF EXISTS contenedores_nivel_llenado_check;

ALTER TABLE public.contenedores
  ADD CONSTRAINT contenedores_nivel_llenado_check
  CHECK (nivel_llenado >= 0 AND nivel_llenado <= 100);

-- Necesario para que DELETE en tiempo real envie el id al movil y al dashboard
ALTER TABLE public.contenedores REPLICA IDENTITY FULL;

DROP POLICY IF EXISTS "contenedores_select_dashboard" ON public.contenedores;
CREATE POLICY "contenedores_select_dashboard"
  ON public.contenedores
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "contenedores_insert_dashboard" ON public.contenedores;
CREATE POLICY "contenedores_insert_dashboard"
  ON public.contenedores
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "contenedores_update_dashboard" ON public.contenedores;
CREATE POLICY "contenedores_update_dashboard"
  ON public.contenedores
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "contenedores_delete_dashboard" ON public.contenedores;
CREATE POLICY "contenedores_delete_dashboard"
  ON public.contenedores
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Tiempo real: app movil y dashboard web se sincronizan al insertar/actualizar/eliminar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'contenedores'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contenedores;
  END IF;
END $$;
