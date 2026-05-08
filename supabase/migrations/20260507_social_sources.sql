-- Migración para Fuentes Dinámicas de Scraping

CREATE TABLE IF NOT EXISTS public.social_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'instagram', 'tiktok')),
    url TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE public.social_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users on sources" 
    ON public.social_sources FOR ALL 
    USING (auth.role() = 'authenticated');

-- Insertar algunas fuentes por defecto
INSERT INTO public.social_sources (platform, url, name) VALUES 
('facebook', 'https://www.facebook.com/GobiernoDeMexico', 'Página Oficial'),
('twitter', 'https://twitter.com/GobiernoMX', 'X Oficial');
