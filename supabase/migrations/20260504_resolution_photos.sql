-- ============================================================
-- Soporte para Fotos de Resolución (Evidencia)
-- ============================================================

-- 1. Agregar columna para distinguir fotos de reporte vs resolución
ALTER TABLE public.report_photos ADD COLUMN IF NOT EXISTS is_resolution BOOLEAN DEFAULT false;

-- 2. Asegurar que las políticas de storage permitan subidas de staff/directores
-- (Ya configurado en 20260504_setup_storage.sql, pero lo reforzamos)
DROP POLICY IF EXISTS "Directores pueden subir evidencias" ON storage.objects;
CREATE POLICY "Directores pueden subir evidencias"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'report-photos');

-- 3. Permitir que cualquiera vea las fotos de resolución
DROP POLICY IF EXISTS "Public can view resolution photos" ON public.report_photos;
CREATE POLICY "Public can view resolution photos"
ON public.report_photos FOR SELECT
USING (true);
