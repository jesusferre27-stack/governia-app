-- REPARACION DEFINITIVA DE procedure_documents (V2)
-- Al parecer la tabla original no se creó con la Foreign Key request_id o se borró.

-- 1. Asegurar la columna request_id
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS request_id uuid references procedure_requests(id);

-- 2. Asegurar el resto de columnas necesarias
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS document_type text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS user_id uuid references auth.users(id);
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS procedure_id uuid references procedures(id);

-- 3. Asegurar timestamps
ALTER TABLE procedure_documents ADD COLUMN IF NOT EXISTS created_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- 4. Permisos
GRANT ALL ON procedure_documents TO authenticated;
GRANT ALL ON procedure_documents TO service_role;
