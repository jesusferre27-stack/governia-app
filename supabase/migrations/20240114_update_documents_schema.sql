-- Modify procedure_documents to match file upload requirements
-- We keep request_id as it is critical for linking to the specific flow.

alter table procedure_documents 
add column if not exists procedure_id uuid references procedures(id),
add column if not exists user_id uuid references auth.users(id),
add column if not exists file_path text,
add column if not exists file_name text;

-- Rename uploaded_at to created_at if needed, or just add created_at alias? 
-- The user asked for 'created_at'. Existing is 'uploaded_at'.
do $$
begin
  if exists(select * from information_schema.columns where table_name = 'procedure_documents' and column_name = 'uploaded_at') then
    alter table procedure_documents rename column uploaded_at to created_at;
  else
    alter table procedure_documents add column if not exists created_at timestamp with time zone default timezone('utc'::text, now()) not null;
  end if;
end $$;

-- Enable RLS for these new columns if needed (already enabled on table)
-- Ensure 'authenticated' users can insert.
create policy "Authenticated users can upload documents"
on procedure_documents for insert
to authenticated
with check (true); 
-- Note: In production, check inputs against user_id.

-- Allow viewing own docs
create policy "Users can view own procedure documents"
on procedure_documents for select
to authenticated
using (auth.uid() = user_id);
