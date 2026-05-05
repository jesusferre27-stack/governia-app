-- ============================================================
-- Crear Tabla de Perfiles y Sincronización con Auth
-- ============================================================

-- 1. Crear la tabla de perfiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    email       TEXT,
    role        TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'staff', 'director')),
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los perfiles son públicos para lectura"
ON public.profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 3. Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para la función anterior
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Seed para el staff actual (basado en el email del usuario)
-- Nota: Esto asocia el email jesusferre27@gmail.com como STAFF
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, email, 'staff', 'Lic. Sosimo Lopez'
FROM auth.users
WHERE email = 'jesusferre27@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'staff';
