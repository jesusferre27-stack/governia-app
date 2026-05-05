-- ============================================================
-- Configuración de Almacenamiento para Reportes Ciudadanos
-- ============================================================

-- 1. Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-photos', 'report-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de acceso para el bucket 'report-photos'
-- ============================================================

-- Permitir que usuarios autenticados (ciudadanos) suban fotos
CREATE POLICY "Permitir subida de fotos a usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'report-photos');

-- Permitir que todo el mundo vea las fotos (si el bucket es público)
CREATE POLICY "Permitir lectura pública de fotos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'report-photos');

-- Permitir que el staff pueda borrar o actualizar (opcional)
CREATE POLICY "Permitir gestión a administradores"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'report-photos');
