-- ============================================================
-- Sistema de Invitaciones para Directores de Cuadrillas
-- ============================================================

-- 1. Tabla de Invitaciones
CREATE TABLE IF NOT EXISTS crew_invitations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id   UUID REFERENCES departments(id) ON DELETE CASCADE NOT NULL,
    token           TEXT UNIQUE NOT NULL,
    email           TEXT, -- Opcional: para quien va dirigida
    role            TEXT DEFAULT 'director',
    status          TEXT DEFAULT 'pendiente', -- pendiente, aceptada, expirada
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at     TIMESTAMPTZ,
    accepted_by     UUID REFERENCES profiles(id)
);

-- 2. RLS para Invitaciones
ALTER TABLE crew_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff puede gestionar invitaciones"
ON crew_invitations FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'staff'
    )
);

CREATE POLICY "Cualquiera con el token puede ver su invitación"
ON crew_invitations FOR SELECT
TO public
USING (status = 'pendiente' AND expires_at > NOW());

-- 3. Función para aceptar invitación (RPC)
CREATE OR REPLACE FUNCTION accept_crew_invitation(invite_token TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_dept_id UUID;
BEGIN
    -- Validar invitación
    SELECT department_id INTO v_dept_id
    FROM crew_invitations
    WHERE token = invite_token AND status = 'pendiente' AND expires_at > NOW();

    IF v_dept_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Actualizar departamento con el nuevo director
    UPDATE departments SET manager_id = user_id WHERE id = v_dept_id;
    
    -- Marcar invitación como aceptada
    UPDATE crew_invitations 
    SET status = 'aceptada', accepted_at = NOW(), accepted_by = user_id
    WHERE token = invite_token;

    -- Actualizar rol del usuario en su perfil (si es necesario)
    UPDATE profiles SET role = 'director' WHERE id = user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
