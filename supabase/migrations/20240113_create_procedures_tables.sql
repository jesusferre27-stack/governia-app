-- Create procedures table
create table if not exists procedures (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null, -- 'Obras', 'Pagos', 'Negocios', etc.
  is_online boolean default false,
  estimated_time text,
  cost text,
  requirements jsonb default '[]'::jsonb, -- Array of strings or objects
  municipality_id uuid, -- For multi-tenancy
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create procedure_requests table
create table if not exists procedure_requests (
  id uuid default gen_random_uuid() primary key,
  procedure_id uuid references procedures(id) not null,
  citizen_id uuid references auth.users(id) not null,
  status text default 'draft', -- 'draft', 'pending', 'in_progress', 'completed', 'rejected'
  current_step integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create procedure_documents table
create table if not exists procedure_documents (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references procedure_requests(id) not null,
  document_type text not null,
  file_url text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add simple RLS policies (Example - adjust based on actual auth setup)
alter table procedures enable row level security;
create policy "Public procedures are viewable by everyone" on procedures for select using (true);

alter table procedure_requests enable row level security;
create policy "Users can view their own requests" on procedure_requests for select using (auth.uid() = citizen_id);
create policy "Users can insert their own requests" on procedure_requests for insert with check (auth.uid() = citizen_id);
create policy "Users can update their own requests" on procedure_requests for update using (auth.uid() = citizen_id);

alter table procedure_documents enable row level security;
create policy "Users can view their own documents" on procedure_documents for select using (
    exists ( select 1 from procedure_requests where id = procedure_documents.request_id and citizen_id = auth.uid() )
);
create policy "Users can insert their own documents" on procedure_documents for insert with check (
    exists ( select 1 from procedure_requests where id = procedure_documents.request_id and citizen_id = auth.uid() )
);

-- Seed some data for Soteapan
insert into procedures (title, description, category, is_online, estimated_time, cost, requirements)
values
(
 'Licencia de Obra Menor',
 'Permiso para realizar construcciones menores o remodelaciones que no afecten la estructura principal.',
 'Obras',
 false,
 '2-3 días',
 'Variable',
 '["Identificación Oficial", "Comprobante de Domicilio", "Croquis de la obra", "Pago de derechos"]'::jsonb
),
(
 'Pago de Predial',
 'Pago anual del impuesto predial con descuentos por pronto pago.',
 'Pagos',
 true,
 'Inmediato',
 'Variable',
 '["Clave Catastral", "Último recibo de pago"]'::jsonb
),
(
 'Licencia de Funcionamiento',
 'Permiso para la apertura de negocios de bajo riesgo en el municipio.',
 'Negocios',
 false,
 '5 días',
 'Variable',
 '["Alta en Hacienda", "Comprobante de Domicilio", "Identificación Oficial", "Uso de Suelo"]'::jsonb
),
(
 'Acta de Nacimiento',
 'Obtención de copia certificada del acta de nacimiento.',
 'Pagos',
 true,
 'Inmediato',
 '$125.00',
 '["CURP", "Nombre completo", "Fecha de nacimiento"]'::jsonb
);
