-- Migración para el Módulo de Sentimiento Ciudadano

-- 1. Tabla de Menciones Sociales
CREATE TABLE IF NOT EXISTS public.social_mentions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'tiktok')),
    author_handle TEXT NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    sentiment TEXT NOT NULL CHECK (sentiment IN ('Positivo', 'Neutral', 'Negativo')),
    topics TEXT[] DEFAULT '{}',
    url TEXT,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para social_mentions
ALTER TABLE public.social_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" 
    ON public.social_mentions FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" 
    ON public.social_mentions FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" 
    ON public.social_mentions FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" 
    ON public.social_mentions FOR DELETE 
    USING (auth.role() = 'authenticated');

-- 2. Tabla de Logs de Scrapeo (Para limitar a 5 por día)
CREATE TABLE IF NOT EXISTS public.social_scrape_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date_str TEXT NOT NULL, -- Format: YYYY-MM-DD
    user_id UUID REFERENCES auth.users(id),
    scrapes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para social_scrape_logs
ALTER TABLE public.social_scrape_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users on logs" 
    ON public.social_scrape_logs FOR ALL 
    USING (auth.role() = 'authenticated');

-- Insertar datos de prueba (Mock Data) para visualización inicial
INSERT INTO public.social_mentions (platform, author_handle, author_avatar, content, sentiment, topics, posted_at)
VALUES 
    ('facebook', 'Juan Pérez', 'https://i.pravatar.cc/100?img=11', '¡El nuevo parque en el Centro está fantástico! Da gusto ver más áreas verdes.', 'Positivo', ARRAY['#ParqueCentral', 'Áreas Verdes'], NOW() - INTERVAL '2 hours'),
    ('twitter', '@maria_gomez', 'https://i.pravatar.cc/100?img=5', 'El semáforo de la Av. Principal es un caos en hora pico. ¡Urge arreglarlo!', 'Negativo', ARRAY['#Tráfico', 'Semáforos'], NOW() - INTERVAL '1 day'),
    ('facebook', 'Noticias Locales', 'https://i.pravatar.cc/100?img=3', 'Sesión del cabildo programada para este jueves a las 7 PM.', 'Neutral', ARRAY['Cabildo', 'Avisos'], NOW() - INTERVAL '2 days'),
    ('tiktok', '@vecinokevin', 'https://i.pravatar.cc/100?img=12', 'Los baches de la calle 5 de mayo me poncharon la llanta 😡', 'Negativo', ARRAY['#Baches', 'Servicios Públicos'], NOW() - INTERVAL '3 hours'),
    ('instagram', '@fotografo_local', 'https://i.pravatar.cc/100?img=8', 'Hermoso atardecer desde el malecón renovado ✨', 'Positivo', ARRAY['#Turismo', 'Obras Públicas'], NOW() - INTERVAL '5 hours');
