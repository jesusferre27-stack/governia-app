-- ================================================================
-- OBRAS PÚBLICAS — Sistema Operativo Completo
-- Governia — Ejecutar en: Supabase SQL Editor
-- ================================================================

-- ----------------------------------------------------------------
-- 1. PROYECTOS DE OBRAS PÚBLICAS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public_works_projects (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  description   TEXT,
  status        TEXT        NOT NULL DEFAULT 'planning'
                            CHECK (status IN ('planning','in_progress','paused','completed','cancelled')),
  progress      INTEGER     DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget        NUMERIC(14,2),
  spent         NUMERIC(14,2) DEFAULT 0,
  contractor    TEXT,
  contract_number TEXT,
  start_date    DATE,
  end_date      DATE,
  location_text TEXT,           -- Dirección legible: "Av. Central y Calle 5"
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  cover_image   TEXT,           -- URL de imagen de portada
  assigned_supervisor_id UUID REFERENCES auth.users(id),
  department_id UUID REFERENCES departments(id),
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_works_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view projects" ON public_works_projects;
CREATE POLICY "Staff can view projects"
  ON public_works_projects FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can insert projects" ON public_works_projects;
CREATE POLICY "Staff can insert projects"
  ON public_works_projects FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update projects" ON public_works_projects;
CREATE POLICY "Staff can update projects"
  ON public_works_projects FOR UPDATE TO authenticated USING (true);

-- ----------------------------------------------------------------
-- 2. FOTOS DE AVANCE (múltiples por proyecto)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public_works_photos (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID        NOT NULL REFERENCES public_works_projects(id) ON DELETE CASCADE,
  file_path   TEXT        NOT NULL,   -- path en Storage
  file_url    TEXT,                   -- URL pública o firmada
  caption     TEXT,
  taken_at    DATE        DEFAULT CURRENT_DATE,
  uploaded_by UUID        REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_works_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view photos" ON public_works_photos;
CREATE POLICY "Staff can view photos"
  ON public_works_photos FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can insert photos" ON public_works_photos;
CREATE POLICY "Staff can insert photos"
  ON public_works_photos FOR INSERT TO authenticated WITH CHECK (true);

-- ----------------------------------------------------------------
-- 3. BITÁCORA DE AVANCES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public_works_log (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID        NOT NULL REFERENCES public_works_projects(id) ON DELETE CASCADE,
  entry_date  DATE        DEFAULT CURRENT_DATE,
  status_type TEXT        NOT NULL DEFAULT 'green'
                          CHECK (status_type IN ('green','yellow','red')),
  title       TEXT        NOT NULL,
  description TEXT,
  progress_at INTEGER,          -- % de avance al momento de la entrada
  photos      TEXT[],           -- array de file_paths
  author_id   UUID        REFERENCES auth.users(id),
  author_name TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_works_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view log" ON public_works_log;
CREATE POLICY "Staff can view log"
  ON public_works_log FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can insert log" ON public_works_log;
CREATE POLICY "Staff can insert log"
  ON public_works_log FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update log" ON public_works_log;
CREATE POLICY "Staff can update log"
  ON public_works_log FOR UPDATE TO authenticated USING (true);

-- ----------------------------------------------------------------
-- 4. CONTRATOS (carátula procesada por IA)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public_works_contracts (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id      UUID        NOT NULL REFERENCES public_works_projects(id) ON DELETE CASCADE,
  file_path       TEXT        NOT NULL,   -- imagen de carátula en Storage
  file_url        TEXT,
  -- Datos extraídos por IA
  contract_number TEXT,
  contractor_name TEXT,
  contract_amount NUMERIC(14,2),
  start_date      DATE,
  end_date        DATE,
  object_description TEXT,
  ai_raw_response TEXT,       -- JSON completo de Gemini para referencia
  ai_processed    BOOLEAN     DEFAULT false,
  uploaded_by     UUID        REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_works_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view contracts" ON public_works_contracts;
CREATE POLICY "Staff can view contracts"
  ON public_works_contracts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can insert contracts" ON public_works_contracts;
CREATE POLICY "Staff can insert contracts"
  ON public_works_contracts FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update contracts" ON public_works_contracts;
CREATE POLICY "Staff can update contracts"
  ON public_works_contracts FOR UPDATE TO authenticated USING (true);

-- ----------------------------------------------------------------
-- 5. ALERTAS DEL ALCALDE A SUPERVISORES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public_works_alerts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID        NOT NULL REFERENCES public_works_projects(id) ON DELETE CASCADE,
  message     TEXT        NOT NULL,
  priority    TEXT        NOT NULL DEFAULT 'normal'
                          CHECK (priority IN ('normal','urgent','critical')),
  sent_by     UUID        REFERENCES auth.users(id),
  sent_by_name TEXT       DEFAULT 'Alcalde',
  read_by     UUID        REFERENCES auth.users(id),
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public_works_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view alerts" ON public_works_alerts;
CREATE POLICY "Staff can view alerts"
  ON public_works_alerts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff can insert alerts" ON public_works_alerts;
CREATE POLICY "Staff can insert alerts"
  ON public_works_alerts FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update alerts" ON public_works_alerts;
CREATE POLICY "Staff can update alerts"
  ON public_works_alerts FOR UPDATE TO authenticated USING (true);

-- ----------------------------------------------------------------
-- 6. TRIGGER updated_at automático
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_public_works_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_public_works_updated_at ON public_works_projects;
CREATE TRIGGER trg_public_works_updated_at
  BEFORE UPDATE ON public_works_projects
  FOR EACH ROW EXECUTE FUNCTION update_public_works_updated_at();

-- ----------------------------------------------------------------
-- 7. STORAGE BUCKET obras-publicas
-- ----------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('obras-publicas', 'obras-publicas', false)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Staff upload obras docs') THEN
    CREATE POLICY "Staff upload obras docs"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'obras-publicas');
  END IF;
END$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Staff view obras docs') THEN
    CREATE POLICY "Staff view obras docs"
    ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'obras-publicas');
  END IF;
END$$;

-- ----------------------------------------------------------------
-- 8. SEED — Migrar los 3 proyectos existentes a la tabla real
-- ----------------------------------------------------------------

-- Obtener el id del departamento de Obras Públicas
DO $$
DECLARE
  obras_dept_id UUID;
BEGIN
  SELECT id INTO obras_dept_id FROM departments WHERE name = 'Obras Públicas' LIMIT 1;

  INSERT INTO public_works_projects
    (name, description, status, progress, budget, contractor, start_date, end_date, location_text, latitude, longitude, cover_image, department_id)
  VALUES
  (
    'Renovación Parque Central',
    'Rehabilitación integral de áreas verdes, juegos infantiles y alumbrado público. El proyecto incluye la instalación de un nuevo sistema de riego automatizado.',
    'in_progress', 65, 2500000, 'Constructora del Valle S.A.',
    '2024-01-15', '2024-06-30',
    'Av. Central y Calle 5, Soteapan',
    18.2290, -94.8730,
    '/assets/park_construction.png',
    obras_dept_id
  ),
  (
    'Pavimentación Calle 5 de Mayo',
    'Recapeteo asfáltico y señalización vial en la arteria principal del centro histórico. Incluye nivelación de alcantarillas y pintura de cruces peatonales.',
    'planning', 10, 1200000, 'Obras Civiles S.A.',
    '2024-03-01', '2024-04-15',
    'Calle 5 de Mayo, Centro Histórico, Soteapan',
    18.2315, -94.8710,
    '/assets/road_work.png',
    obras_dept_id
  ),
  (
    'Alumbrado Zona Norte',
    'Sustitución de 500 luminarias de vapor de sodio por tecnología LED de alta eficiencia. Reducción estimada del 40% en consumo eléctrico.',
    'completed', 100, 850000, 'EcoLight Solutions',
    '2024-01-10', '2024-02-20',
    'Colonias del Norte, Soteapan',
    18.2350, -94.8695,
    '/assets/lighting_repair.png',
    obras_dept_id
  )
  ON CONFLICT DO NOTHING;
END$$;

-- ----------------------------------------------------------------
-- 9. SEED BITÁCORA para el proyecto 1 (Renovación Parque Central)
-- ----------------------------------------------------------------
DO $$
DECLARE
  project1_id UUID;
BEGIN
  SELECT id INTO project1_id FROM public_works_projects WHERE name = 'Renovación Parque Central' LIMIT 1;
  IF project1_id IS NOT NULL THEN
    INSERT INTO public_works_log (project_id, entry_date, status_type, title, description, progress_at, author_name)
    VALUES
      (project1_id, '2024-02-10', 'green', 'Luminarias zona norte completadas', 'Instalación de luminarias completada en zona norte. Se probó el sistema eléctrico con resultado satisfactorio.', 65, 'Ing. Martínez - Residente de Obra'),
      (project1_id, '2024-02-05', 'yellow', 'Retraso en entrega de material', 'Retraso leve en entrega de material de cantera por parte del proveedor. Estimado de retraso: 3 días.', 50, 'Ing. Martínez - Residente de Obra'),
      (project1_id, '2024-01-25', 'green', 'Inicio de movimiento de tierras', 'Se inició el movimiento de tierras y nivelación del terreno en zona de juegos infantiles.', 25, 'Ing. Martínez - Residente de Obra'),
      (project1_id, '2024-01-15', 'green', 'Arranque de obra', 'Arranque oficial de obra con presencia del Presidente Municipal y Director de Obras Públicas.', 5, 'Dir. Obras Públicas')
    ON CONFLICT DO NOTHING;
  END IF;
END$$;

-- ----------------------------------------------------------------
-- 10. PERMISOS
-- ----------------------------------------------------------------
GRANT ALL ON public_works_projects TO authenticated;
GRANT ALL ON public_works_photos TO authenticated;
GRANT ALL ON public_works_log TO authenticated;
GRANT ALL ON public_works_contracts TO authenticated;
GRANT ALL ON public_works_alerts TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
