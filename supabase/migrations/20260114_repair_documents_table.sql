-- REPARACIÓN DE TABLA procedure_documents
-- Este script asegura que todas las columnas necesarias existan.

-- 1. Agregar columnas base que faltaban (causantes del error)
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS document_type text;

-- 2. Agregar columnas extra para mejoras futuras (y evitar errores si el código las usa)
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id);
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS procedure_id uuid references procedures(id);

-- 3. Asegurar permisos (por si acaso)
GRANT ALL ON procedure_documents TO authenticated;
GRANT ALL ON procedure_documents TO service_role;
