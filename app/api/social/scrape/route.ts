import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de Supabase (Server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const today = new Date().toISOString().split('T')[0];

        // 1. Verificar límites de scrapeo
        const { data: logData, error: logError } = await supabase
            .from('social_scrape_logs')
            .select('*')
            .eq('date_str', today)
            .eq('user_id', userId)
            .single();

        if (logError && logError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error("Error fetching logs:", logError);
            return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
        }

        const currentScrapes = logData ? logData.scrapes_count : 0;
        
        if (currentScrapes >= 5) {
            return NextResponse.json({ 
                error: 'Límite de extracciones diarias alcanzado (5/5). Vuelve a intentar mañana.' 
            }, { status: 429 });
        }

        // 2. SIMULACIÓN DE LLAMADA A APIFY (Facebook, X, IG, TikTok)
        // Aquí iría el fetch a la API de Apify usando process.env.APIFY_API_TOKEN
        // const response = await fetch(`https://api.apify.com/v2/acts/apify~facebook-pages-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`, {...});
        
        console.log("Iniciando extracción mediante Apify (Simulado)...");
        // Simulamos el tiempo que tarda un scraper
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Insertamos datos nuevos simulados extraídos del municipio
        const newMentions = [
            { platform: 'facebook', author_handle: 'Vecinos del Centro', author_avatar: 'https://i.pravatar.cc/100?img=15', content: 'Acaban de inaugurar la nueva luminaria en la calle 20 de Noviembre. Se ve mucho más seguro ahora.', sentiment: 'Positivo', topics: ['#Alumbrado', 'Seguridad'], posted_at: new Date().toISOString() },
            { platform: 'twitter', author_handle: '@juanito_mx', author_avatar: 'https://i.pravatar.cc/100?img=16', content: 'Otra fuga de agua en la colonia Reforma. Llevamos 3 días reportando y no vienen!!!', sentiment: 'Negativo', topics: ['#Fuga', 'AguaPotable'], posted_at: new Date().toISOString() },
            { platform: 'tiktok', author_handle: '@influencer_local', author_avatar: 'https://i.pravatar.cc/100?img=17', content: 'Fui al festival cultural en el centro histórico, estuvo padrísimo 🎉✨', sentiment: 'Positivo', topics: ['#Festival', 'Cultura'], posted_at: new Date().toISOString() }
        ];

        const { error: insertError } = await supabase.from('social_mentions').insert(newMentions);
        
        if (insertError) {
             console.error("Error inserting mentions:", insertError);
             return NextResponse.json({ error: 'No se pudieron guardar las menciones' }, { status: 500 });
        }

        // 3. Actualizar el log de scrapeo
        if (logData) {
            await supabase.from('social_scrape_logs')
                .update({ scrapes_count: currentScrapes + 1 })
                .eq('id', logData.id);
        } else {
            await supabase.from('social_scrape_logs')
                .insert({ user_id: userId, date_str: today, scrapes_count: 1 });
        }

        return NextResponse.json({ success: true, new_count: currentScrapes + 1 });

    } catch (error) {
        console.error("Scrape Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
