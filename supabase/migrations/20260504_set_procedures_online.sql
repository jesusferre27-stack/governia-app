-- Update all procedures to be online by default for the digital transformation
UPDATE procedures SET is_online = true;

-- Ensure "Permiso de Construcción" exists if not already there
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM procedures WHERE title = 'Permiso de Construcción') THEN
        INSERT INTO procedures (title, description, category, is_online, estimated_time, cost, requirements)
        VALUES (
            'Permiso de Construcción',
            'Solicitud para obtener permiso de construcción municipal para obras nuevas o ampliaciones estructurales.',
            'Obras',
            true,
            '5-10 días',
            'Según metros cuadrados',
            '["Plano Arquitectónico", "Escrituras", "Identificación Oficial", "Pago de Predial vigente"]'::jsonb
        );
    END IF;
END $$;
