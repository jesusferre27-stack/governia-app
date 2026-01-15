-- Ensure requirements are raw JSON arrays, not strings containing JSON.
-- Run this in Supabase SQL Editor.

update procedures 
set requirements = '["Identificación Oficial", "Comprobante de Domicilio", "Croquis de la obra", "Pago de derechos"]'::jsonb
where title = 'Licencia de Obra Menor';

update procedures 
set requirements = '["Clave Catastral", "Último recibo de pago"]'::jsonb
where title like 'Pago de Predial%';

update procedures 
set requirements = '["Alta en Hacienda", "Comprobante de Domicilio", "Identificación Oficial", "Uso de Suelo"]'::jsonb
where title like 'Licencia de Funcionamiento%';

update procedures 
set requirements = '["CURP", "Nombre completo", "Fecha de nacimiento"]'::jsonb
where title like '%Nacimiento%';

update procedures 
set requirements = '["Identificación Oficial", "Fotos del árbol", "Dictamen de riesgo"]'::jsonb
where title like '%Poda%';

update procedures 
set requirements = '["Identificación Oficial", "Comprobante de Domicilio", "2 Fotografías"]'::jsonb
where title like 'Constancia%';
