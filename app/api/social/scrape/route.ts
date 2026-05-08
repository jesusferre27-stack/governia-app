import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

        const today = new Date().toISOString().split('T')[0];

        // 1. Verificar límites (5 al día)
        const { data: logData, error: logError } = await supabase
            .from('social_scrape_logs')
            .select('*')
            .eq('date_str', today)
            .eq('user_id', userId)
            .single();

        const currentScrapes = logData ? logData.scrapes_count : 0;
        
        if (currentScrapes >= 5) {
            return NextResponse.json({ error: 'Límite de extracciones diarias alcanzado (5/5).' }, { status: 429 });
        }

        const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
        const GEMINI_KEY = process.env.GEMINI_API_KEY;
        let finalMentions = [];

        // 2. EXTRACCIÓN REAL CON APIFY (Facebook Pages Scraper)
        if (APIFY_TOKEN && GEMINI_KEY) {
            console.log("Iniciando extracción REAL con Apify...");
            
            // Reemplaza esta URL con la página oficial de tu municipio o la página a monitorear
            const targetUrl = "https://www.facebook.com/GobiernoDeMexico"; 

            const apifyRes = await fetch(`https://api.apify.com/v2/acts/apify~facebook-pages-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startUrls: [{ url: targetUrl }],
                    resultsLimit: 5 // Extraer los últimos 5 posts/comentarios
                })
            });

            if (!apifyRes.ok) {
                console.error("Apify Error:", await apifyRes.text());
                throw new Error("Falló la conexión con Apify");
            }

            const scrapedData = await apifyRes.json();

            // 3. ANÁLISIS DE SENTIMIENTO CON GEMINI
            for (const post of scrapedData) {
                if (!post.text) continue;

                // Prompteamos a Gemini para que analice el post
                const prompt = `Analiza este comentario ciudadano de Facebook: "${post.text}". 
                Responde EXACTAMENTE con un JSON con este formato: {"sentiment": "Positivo|Neutral|Negativo", "topics": ["#Tema1", "Tema2"]}`;

                const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });

                let sentiment = 'Neutral';
                let topics = [];

                if (geminiRes.ok) {
                    const geminiData = await geminiRes.json();
                    try {
                        const aiResult = JSON.parse(geminiData.candidates[0].content.parts[0].text);
                        sentiment = aiResult.sentiment || 'Neutral';
                        topics = aiResult.topics || [];
                    } catch (e) { console.error("Error parseando JSON de Gemini", e); }
                }

                finalMentions.push({
                    platform: 'facebook',
                    author_handle: post.pageName || 'Usuario de Facebook',
                    author_avatar: post.profilePic || 'https://i.pravatar.cc/150?img=33',
                    content: post.text.substring(0, 500),
                    sentiment: sentiment,
                    topics: topics,
                    url: post.url,
                    posted_at: post.time || new Date().toISOString()
                });
            }

        } else {
            // Si no hay TOKEN de APIFY, inyectamos los datos de simulación para que la app no truene
            console.log("No hay APIFY_API_TOKEN. Usando datos de simulación...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            finalMentions = [
                { platform: 'facebook', author_handle: 'Vecinos del Centro', author_avatar: 'https://i.pravatar.cc/100?img=15', content: 'Acaban de inaugurar la luminaria en la calle 20. Se ve mucho más seguro ahora.', sentiment: 'Positivo', topics: ['#Alumbrado', 'Seguridad'], posted_at: new Date().toISOString() },
                { platform: 'twitter', author_handle: '@juanito_mx', author_avatar: 'https://i.pravatar.cc/100?img=16', content: 'Otra fuga de agua en la colonia Reforma. Llevamos 3 días reportando y no vienen!!!', sentiment: 'Negativo', topics: ['#Fuga', 'AguaPotable'], posted_at: new Date().toISOString() }
            ];
        }

        // 4. Guardar en Base de Datos
        if (finalMentions.length > 0) {
            const { error: insertError } = await supabase.from('social_mentions').insert(finalMentions);
            if (insertError) throw insertError;
        }

        // 5. Actualizar log
        if (logData) {
            await supabase.from('social_scrape_logs').update({ scrapes_count: currentScrapes + 1 }).eq('id', logData.id);
        } else {
            await supabase.from('social_scrape_logs').insert({ user_id: userId, date_str: today, scrapes_count: 1 });
        }

        return NextResponse.json({ success: true, new_count: currentScrapes + 1 });

    } catch (error) {
        console.error("Scrape Error:", error);
        return NextResponse.json({ error: 'Error en la extracción' }, { status: 500 });
    }
}
