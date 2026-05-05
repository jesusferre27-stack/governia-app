-- ============================================================
-- GOVERNIA — Reportes Ciudadanos + Departamentos (Cuadrillas)
-- Migración: 20260502_create_reports_and_crews.sql
-- ============================================================

-- 1. DEPARTAMENTOS MUNICIPALES (Cuadrillas)
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  icon        TEXT        NOT NULL DEFAULT 'groups',
  color       TEXT        NOT NULL DEFAULT '#64748B',
  description TEXT,
  active      BOOLEAN     DEFAULT true,
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS para departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view departments" ON departments;
CREATE POLICY "Everyone can view departments"
  ON departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can manage departments" ON departments;
CREATE POLICY "Staff can manage departments"
  ON departments FOR ALL USING (true);

-- Seed: 10 departamentos típicos de un municipio mexicano
INSERT INTO departments (name, icon, color, description, sort_order) VALUES
  ('Obras Públicas',              'engineering',          '#F59E0B', 'Baches, construcción, infraestructura vial y remodelaciones', 1),
  ('Protección Civil',            'local_fire_department','#EF4444', 'Emergencias, inundaciones, derrumbes y desastres naturales',  2),
  ('Parques y Jardines',          'park',                 '#22C55E', 'Áreas verdes, poda, reforestación y mantenimiento de parques',3),
  ('Limpia Pública',              'delete',               '#6B7280', 'Recolección de basura, barrido de calles y disposición final', 4),
  ('Alumbrado Público',           'lightbulb',            '#FBBF24', 'Luminarias, postes eléctricos y circuitos de alumbrado',      5),
  ('Agua Potable y Drenaje',      'water_drop',           '#3B82F6', 'Fugas de agua, drenaje, alcantarillado y suministro',         6),
  ('Tránsito y Vialidad',         'traffic',              '#8B5CF6', 'Semáforos, señalización vial y pasos peatonales',             7),
  ('Seguridad Pública',           'security',             '#DC2626', 'Vigilancia, patrullaje, reportes de vandalismo y seguridad',  8),
  ('Desarrollo Social',           'groups',               '#EC4899', 'Programas sociales, apoyos y bienestar comunitario',          9),
  ('Ecología y Medio Ambiente',   'eco',                  '#10B981', 'Contaminación, tala ilegal, ríos y medio ambiente',          10)
ON CONFLICT DO NOTHING;


-- 2. REPORTES CIUDADANOS
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  folio            TEXT        NOT NULL UNIQUE,
  citizen_id       UUID        REFERENCES auth.users(id) NOT NULL,
  category         TEXT        NOT NULL,
  description      TEXT,
  latitude         DOUBLE PRECISION,
  longitude        DOUBLE PRECISION,
  address          TEXT,
  department_id    UUID        REFERENCES departments(id),
  status           TEXT        NOT NULL DEFAULT 'nuevo'
                               CHECK (status IN ('nuevo','asignado','en_progreso','resuelto','rechazado')),
  priority         TEXT        NOT NULL DEFAULT 'media'
                               CHECK (priority IN ('baja','media','alta','critica')),
  assigned_to      UUID        REFERENCES auth.users(id),
  resolution_notes TEXT,
  resolved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

-- RLS para reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Citizens can view own reports" ON reports;
CREATE POLICY "Citizens can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = citizen_id);

DROP POLICY IF EXISTS "Citizens can create reports" ON reports;
CREATE POLICY "Citizens can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = citizen_id);

DROP POLICY IF EXISTS "Staff can view all reports" ON reports;
CREATE POLICY "Staff can view all reports"
  ON reports FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can update reports" ON reports;
CREATE POLICY "Staff can update reports"
  ON reports FOR UPDATE
  USING (true);


-- 3. FOTOS DE REPORTES
-- ============================================================
CREATE TABLE IF NOT EXISTS report_photos (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id   UUID        REFERENCES reports(id) ON DELETE CASCADE NOT NULL,
  file_path   TEXT        NOT NULL,
  file_url    TEXT,
  caption     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS para report_photos
ALTER TABLE report_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view report photos" ON report_photos;
CREATE POLICY "Anyone can view report photos"
  ON report_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Citizens can upload photos to own reports" ON report_photos;
CREATE POLICY "Citizens can upload photos to own reports"
  ON report_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports
      WHERE id = report_photos.report_id
        AND citizen_id = auth.uid()
    )
  );

-- Staff también puede insertar fotos (para evidencia de resolución)
DROP POLICY IF EXISTS "Staff can insert photos" ON report_photos;
CREATE POLICY "Staff can insert photos"
  ON report_photos FOR INSERT
  WITH CHECK (true);


-- 4. FUNCIÓN: Generador de folios secuenciales REP-XXXX
-- ============================================================
CREATE OR REPLACE FUNCTION generate_report_folio()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO next_num FROM reports;
  RETURN 'REP-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;


-- 5. TRIGGER: Actualizar updated_at automáticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reports_updated_at ON reports;
CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
