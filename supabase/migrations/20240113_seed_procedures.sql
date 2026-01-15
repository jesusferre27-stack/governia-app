-- Seed 6 Procedures for Soteapan
-- Assumes the tables exist (run 20240113_create_procedures_tables.sql first)

insert into procedures (title, description, category, is_online, estimated_time, cost, requirements)
values
(
 'Licencia de Obra Menor',
 'Permiso para realizar construcciones menores o remodelaciones que no afecten la estructura principal de la vivienda.',
 'Obras',
 false,
 '2-3 días',
 'Variable',
 '["Identificación Oficial", "Comprobante de Domicilio", "Croquis de la obra", "Pago de derechos"]'::jsonb
),
(
 'Pago de Predial 2024',
 'Realiza el pago de tu impuesto predial de manera rápida y segura. Aprovecha los descuentos por pronto pago.',
 'Pagos',
 true,
 'Inmediato',
 'Variable',
 '["Clave Catastral", "Último recibo de pago"]'::jsonb
),
(
 'Licencia de Funcionamiento Comerial',
 'Trámite para la apertura legal de establecimientos comerciales de bajo impacto y riesgo.',
 'Negocios',
 false,
 '5 días',
 'Variable',
 '["Alta en Hacienda", "Comprobante de Domicilio", "Identificación Oficial", "Uso de Suelo", "Dictamen de Protección Civil"]'::jsonb
),
(
 'Copia Certificada de Acta de Nacimiento',
 'Solicita una copia certificada de tu acta de nacimiento digitalizada.',
 'Pagos',
 true,
 'Inmediato',
 '$125.00',
 '["CURP", "Nombre completo", "Fecha de nacimiento"]'::jsonb
),
(
 'Permiso de Poda y Derribo',
 'Autorización para la poda formativa o derribo de árboles en propiedad privada que representen riesgo.',
 'Servicios',
 false,
 '3-5 días',
 '$350.00',
 '["Identificación Oficial", "Fotos del árbol", "Dictamen de riesgo (si aplica)"]'::jsonb
),
(
 'Constancia de Residencia',
 'Documento oficial que acredita el domicilio de una persona en el municipio.',
 'Secretaría',
 false,
 '1 día',
 '$150.00',
 '["Identificación Oficial", "Comprobante de Domicilio (Luz/Agua)", "2 Fotografías tamaño infantil"]'::jsonb
);
