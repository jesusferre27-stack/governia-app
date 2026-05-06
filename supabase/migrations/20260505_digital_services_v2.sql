-- ================================================================
-- SERVICIOS DIGITALES V2 — Governia
-- Ejecutar en: Supabase SQL Editor (Dashboard > SQL Editor)
-- ================================================================

-- ----------------------------------------------------------------
-- 1. AMPLIAR CATÁLOGO DE TRÁMITES (Seed adicionales)
-- ----------------------------------------------------------------

-- Eliminar seeds duplicados si existen y re-insertar limpio
-- (ON CONFLICT DO NOTHING para ser idempotente)
INSERT INTO procedures (title, description, category, is_online, estimated_time, cost, requirements)
VALUES
-- IDENTIDAD Y ESTADO CIVIL
(
  'Acta de Nacimiento (Copia Certificada)',
  'Obtén una copia certificada de tu acta de nacimiento directamente en el municipio. Válida para trámites legales, escolares y laborales.',
  'Identidad',
  true,
  'Inmediato',
  '$125.00',
  '["CURP", "Nombre completo del registrado", "Fecha de nacimiento", "Nombre de los padres"]'::jsonb
),
(
  'Acta de Matrimonio (Copia Certificada)',
  'Copia certificada del acta de matrimonio para trámites legales, notariales o administrativos.',
  'Identidad',
  true,
  'Inmediato',
  '$125.00',
  '["Identificación Oficial de ambos cónyuges", "Fecha y lugar del matrimonio", "CURP de ambos"]'::jsonb
),
(
  'Acta de Defunción (Copia Certificada)',
  'Copia certificada del acta de defunción para trámites sucesorios, de seguro o administrativos.',
  'Identidad',
  true,
  'Inmediato',
  '$125.00',
  '["Nombre completo del fallecido", "Fecha y lugar de defunción", "Identificación del solicitante"]'::jsonb
),
-- RESIDENCIA Y DOMICILIO
(
  'Constancia de Residencia',
  'Documento oficial que acredita el domicilio de una persona en el municipio. Válida para escuelas, trámites laborales y bancarios.',
  'Secretaría',
  true,
  '1-2 días',
  '$150.00',
  '["Identificación Oficial vigente", "Comprobante de Domicilio (Luz o Agua, no mayor a 3 meses)", "2 Fotografías tamaño infantil"]'::jsonb
),
(
  'Carta de Buena Conducta',
  'Documento emitido por el Ayuntamiento que acredita el buen comportamiento ciudadano. Solicitada por empleadores, instituciones educativas y para visas.',
  'Secretaría',
  true,
  '1-2 días',
  '$100.00',
  '["Identificación Oficial vigente", "Comprobante de Domicilio", "2 Fotografías tamaño infantil", "No tener antecedentes penales en el municipio"]'::jsonb
),
(
  'Constancia de No Adeudo (Predial)',
  'Certifica que el inmueble no tiene adeudos pendientes de pago por concepto de impuesto predial. Indispensable para compraventas y trámites notariales.',
  'Tesorería',
  true,
  '1 día',
  '$80.00',
  '["Clave Catastral del inmueble", "Identificación Oficial del propietario o representante legal", "Último comprobante de pago predial"]'::jsonb
),
-- NEGOCIOS Y COMERCIO
(
  'Licencia de Funcionamiento Comercial',
  'Permiso anual para la apertura y operación legal de establecimientos comerciales de bajo impacto en el municipio.',
  'Negocios',
  true,
  '5-7 días',
  'Variable según giro',
  '["Alta en el SAT (RFC)", "Comprobante de Domicilio del establecimiento", "Identificación Oficial del titular", "Uso de Suelo compatible", "Dictamen de Protección Civil", "Plano o croquis del local"]'::jsonb
),
(
  'Licencia de Funcionamiento para Venta de Bebidas Alcohólicas',
  'Permiso especial para establecimientos que comercializan bebidas alcohólicas. Requiere aprobación del H. Ayuntamiento.',
  'Negocios',
  false,
  '15-20 días',
  'Variable (según categoría)',
  '["Licencia de Funcionamiento Comercial vigente", "Alta en el SAT", "Dictamen de Protección Civil", "Dictamen de Ecología", "Acta de No Objeción de vecinos", "Identificación Oficial"]'::jsonb
),
(
  'Permiso de Venta en Vía Pública',
  'Autorización temporal o permanente para realizar actividades de comercio informal en espacios públicos del municipio (tianguis, puestos fijos, etc.).',
  'Negocios',
  true,
  '3-5 días',
  '$200.00',
  '["Identificación Oficial", "CURP", "Comprobante de Domicilio", "Fotografía del lugar propuesto", "Descripción de los productos o servicios a vender"]'::jsonb
),
(
  'Renovación de Licencia de Funcionamiento',
  'Actualización anual obligatoria de la licencia de funcionamiento para continuar operando legalmente.',
  'Negocios',
  true,
  '3 días',
  'Variable según giro',
  '["Licencia anterior", "Comprobante de pago de derechos del año anterior", "Identificación Oficial", "Comprobante de domicilio del negocio vigente"]'::jsonb
),
-- CONSTRUCCIÓN Y OBRAS
(
  'Permiso de Construcción (Obra Nueva)',
  'Autorización para construir una nueva edificación en el municipio. Obligatorio para toda obra mayor.',
  'Obras',
  true,
  '10-15 días',
  'Según metros cuadrados',
  '["Escrituras del inmueble o contrato de arrendamiento", "Planos arquitectónicos firmados por DRO", "Memoria de cálculo estructural", "Uso de Suelo compatible", "Identificación Oficial", "Pago de Predial al corriente"]'::jsonb
),
(
  'Licencia de Obra Menor (Remodelación)',
  'Permiso para realizar remodelaciones o ampliaciones que no afecten la estructura principal de la vivienda.',
  'Obras',
  true,
  '2-3 días',
  'Variable',
  '["Identificación Oficial", "Comprobante de Domicilio", "Croquis de la obra o remodelación", "Pago de derechos municipales"]'::jsonb
),
(
  'Alineamiento y Número Oficial',
  'Documento que establece la línea de construcción respecto a la vía pública y asigna el número oficial al inmueble.',
  'Obras',
  true,
  '3-5 días',
  '$350.00',
  '["Identificación Oficial", "Escrituras del inmueble", "Croquis de ubicación del predio"]'::jsonb
),
(
  'Uso de Suelo (Constancia de Compatibilidad)',
  'Certifica que el uso propuesto del inmueble es compatible con el Plan de Desarrollo Urbano del municipio.',
  'Obras',
  true,
  '5-7 días',
  '$500.00',
  '["Identificación Oficial", "Escrituras o contrato de arrendamiento", "Descripción detallada del uso propuesto", "Croquis de localización"]'::jsonb
),
(
  'Permiso de Poda y Derribo de Árbol',
  'Autorización municipal para la poda formativa o derribo de árboles en propiedad privada que representen riesgo.',
  'Servicios',
  true,
  '3-5 días',
  '$350.00',
  '["Identificación Oficial", "Comprobante de domicilio del predio", "Fotografías del árbol", "Dictamen de riesgo (si aplica)", "Tipo y dimensión aproximada del árbol"]'::jsonb
),
-- PAGOS Y TESORERÍA
(
  'Pago de Predial',
  'Pago anual del impuesto predial. Aprovecha los descuentos por pronto pago disponibles en los primeros meses del año.',
  'Tesorería',
  true,
  'Inmediato',
  'Variable (según valor catastral)',
  '["Clave Catastral del inmueble", "Último recibo de pago", "Identificación del propietario"]'::jsonb
),
(
  'Pago de Agua (Servicio Municipal)',
  'Pago de servicio de agua potable y saneamiento municipal.',
  'Tesorería',
  true,
  'Inmediato',
  'Según consumo',
  '["Número de cuenta o contrato de agua", "Último recibo de agua"]'::jsonb
),
(
  'Alta de Nuevo Servicio de Agua',
  'Solicitud para conectar un nuevo predio al sistema de agua potable municipal.',
  'Tesorería',
  false,
  '5-10 días',
  'Variable (según distancia a la red)',
  '["Identificación Oficial", "Escrituras del inmueble", "Plano de localización del predio", "No adeudo de predial"]'::jsonb
),
-- SALUD Y SALUBRIDAD
(
  'Licencia Sanitaria de Establecimiento',
  'Permiso de Protección Civil y Salud para establecimientos que manejan alimentos, medicamentos o productos de salud.',
  'Salud',
  false,
  '7-10 días',
  'Variable según categoría',
  '["Licencia de Funcionamiento", "Croquis del establecimiento con medidas", "Dictamen de Protección Civil", "Carnet de Salud del personal", "Identificación del responsable sanitario"]'::jsonb
),
-- EVENTOS Y ESPECTÁCULOS
(
  'Permiso para Evento Público',
  'Autorización para realizar eventos, espectáculos, ferias o reuniones masivas en espacios públicos o privados.',
  'Servicios',
  true,
  '5-7 días',
  'Variable según magnitud',
  '["Identificación del organizador", "Descripción detallada del evento (fecha, hora, lugar, aforo estimado)", "Plan de seguridad", "Póliza de seguro de responsabilidad civil", "Autorización del dueño del predio (si es privado)"]'::jsonb
),
(
  'Permiso para Manifestación o Marcha',
  'Notificación formal al Ayuntamiento para ejercer el derecho de manifestación en vía pública.',
  'Servicios',
  true,
  '2-3 días',
  'Sin costo',
  '["Identificación del representante del grupo", "Descripción del motivo", "Ruta propuesta", "Número estimado de participantes", "Medidas de seguridad"]'::jsonb
),
-- PANTEÓN Y SERVICIOS FUNERARIOS
(
  'Permiso de Inhumación (Panteón Municipal)',
  'Autorización para sepultura en el panteón municipal.',
  'Secretaría',
  false,
  '1 día (urgente)',
  '$300.00',
  '["Acta de Defunción original", "Identificación del familiar solicitante", "Certificado médico de defunción"]'::jsonb
),
(
  'Permiso de Exhumación',
  'Autorización para exhumar restos del panteón municipal para traslado o reinhumación.',
  'Secretaría',
  false,
  '3-5 días',
  '$400.00',
  '["Identificación del familiar responsable", "Acta de Defunción", "Justificación de la exhumación", "Permiso del panteón destino (si aplica)"]'::jsonb
),
-- ANIMALES Y MASCOTAS
(
  'Registro de Mascota (Perro o Gato)',
  'Registro municipal de tu mascota para control zoosanitario y recuperación en caso de extravío.',
  'Servicios',
  true,
  'Inmediato',
  '$50.00',
  '["Identificación del propietario", "Fotografía de la mascota", "Constancia de vacunación antirrábica vigente", "Chip de identificación (si tiene)"]'::jsonb
),
-- TRANSPORTE
(
  'Permiso de Ruta de Transporte Urbano',
  'Autorización para operar rutas de transporte de pasajeros dentro del municipio.',
  'Transporte',
  false,
  '20-30 días',
  'Variable',
  '["Documentos del vehículo (factura, tarjeta de circulación)", "Licencia de chofer vigente (tipo D)", "Póliza de seguro vigente", "Estudio de factibilidad de ruta", "Identificación del concesionario"]'::jsonb
)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------
-- 2. AMPLIAR TABLA procedure_requests
-- ----------------------------------------------------------------

ALTER TABLE procedure_requests
  ADD COLUMN IF NOT EXISTS folio TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS staff_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS municipality_name TEXT DEFAULT 'Soteapan';

-- ----------------------------------------------------------------
-- 3. TRIGGER PARA FOLIO AUTOMÁTICO
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION generate_service_folio()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  seq_num  INT;
  new_folio TEXT;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  -- Count existing folios for this year to get the next sequential number
  SELECT COUNT(*) + 1 INTO seq_num
  FROM procedure_requests
  WHERE folio LIKE 'SRV-' || year_str || '-%';
  
  new_folio := 'SRV-' || year_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  NEW.folio := new_folio;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_service_folio ON procedure_requests;
CREATE TRIGGER trg_generate_service_folio
  BEFORE INSERT ON procedure_requests
  FOR EACH ROW
  WHEN (NEW.folio IS NULL)
  EXECUTE FUNCTION generate_service_folio();

-- ----------------------------------------------------------------
-- 4. RLS POLICIES — Staff puede leer y actualizar todas las requests
-- ----------------------------------------------------------------

-- Aseguramos que RLS esté activo
ALTER TABLE procedure_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedure_documents ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores para recrearlas limpias
DROP POLICY IF EXISTS "Users can view their own requests" ON procedure_requests;
DROP POLICY IF EXISTS "Users can insert their own requests" ON procedure_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON procedure_requests;
DROP POLICY IF EXISTS "Staff can view all requests" ON procedure_requests;
DROP POLICY IF EXISTS "Staff can update all requests" ON procedure_requests;

-- Ciudadanos ven solo sus propias solicitudes
CREATE POLICY "Citizens view own requests"
ON procedure_requests FOR SELECT
TO authenticated
USING (auth.uid() = citizen_id);

-- Ciudadanos crean sus propias solicitudes
CREATE POLICY "Citizens insert own requests"
ON procedure_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = citizen_id);

-- Staff ve TODAS las solicitudes
CREATE POLICY "Staff view all requests"
ON procedure_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('staff', 'director')
  )
);

-- Staff puede actualizar status, notas y datos de revisión
CREATE POLICY "Staff update requests"
ON procedure_requests FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('staff', 'director')
  )
);

-- ----------------------------------------------------------------
-- 5. RLS POLICIES — Documents
-- ----------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view their own documents" ON procedure_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON procedure_documents;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON procedure_documents;
DROP POLICY IF EXISTS "Users can view own procedure documents" ON procedure_documents;

-- Ciudadanos ven sus propios documentos
CREATE POLICY "Citizens view own documents"
ON procedure_documents FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Ciudadanos suben sus documentos
CREATE POLICY "Citizens upload documents"
ON procedure_documents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Staff ve todos los documentos
CREATE POLICY "Staff view all documents"
ON procedure_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('staff', 'director')
  )
);

-- ----------------------------------------------------------------
-- 6. STORAGE BUCKET — procedure-documents
-- ----------------------------------------------------------------

-- Crear el bucket si no existe (idempotente)
INSERT INTO storage.buckets (id, name, public)
VALUES ('procedure-documents', 'procedure-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Ciudadanos pueden subir sus documentos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Citizens upload procedure docs'
  ) THEN
    CREATE POLICY "Citizens upload procedure docs"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'procedure-documents');
  END IF;
END$$;

-- Ciudadanos ven sus propios documentos subidos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Citizens view own procedure docs'
  ) THEN
    CREATE POLICY "Citizens view own procedure docs"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'procedure-documents'
      AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );
  END IF;
END$$;

-- Staff ve todos los documentos del bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Staff view all procedure docs'
  ) THEN
    CREATE POLICY "Staff view all procedure docs"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'procedure-documents'
      AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('staff', 'director')
      )
    );
  END IF;
END$$;

-- ----------------------------------------------------------------
-- 7. PERMISOS DE TABLA
-- ----------------------------------------------------------------
GRANT ALL ON procedure_requests TO authenticated;
GRANT ALL ON procedure_documents TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
