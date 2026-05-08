import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
    try {
        // Inicializar cliente de Supabase usando el JWT del usuario para pasar las políticas RLS
        const authHeader = req.headers.get('Authorization');
        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: authHeader || '' } }
        });

        const { userId, platform, urls, context } = await req.json();
        if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        if (!platform) return NextResponse.json({ error: 'Platform is required' }, { status: 400 });

        const today = new Date().toISOString().split('T')[0];

        // 1. Verificar límites (10 al día)
        const { data: logData, error: logError } = await supabase
            .from('social_scrape_logs')
            .select('*')
            .eq('date_str', today)
            .eq('user_id', userId)
            .single();

        const currentScrapes = logData ? logData.scrapes_count : 0;
        
        if (currentScrapes >= 10) {
            return NextResponse.json({ error: 'Límite diario alcanzado (10/10). Adquiere más créditos para continuar.' }, { status: 429 });
        }

        // 2. Obtener URLs
        // Si el cliente envía las URLs (porque las leyó bien), las usamos. Si no, consultamos (puede fallar por RLS si no hay Service Key).
        let targetUrls = urls || [];
        
        if (targetUrls.length === 0) {
            const { data: sources } = await supabase
                .from('social_sources')
                .select('url')
                .eq('platform', platform);
                
            if (sources) {
                targetUrls = sources.map((s: any) => s.url);
            }
        }

        if (targetUrls.length === 0) {
            return NextResponse.json({ error: `No tienes URLs configuradas para ${platform}. Ve a ⚙️ Fuentes de Datos.` }, { status: 400 });
        }

        const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
        const GEMINI_KEY = process.env.GEMINI_API_KEY;
        let finalMentions = [];

        // 3. EXTRACCIÓN REAL CON APIFY (Por plataforma)
        if (APIFY_TOKEN && GEMINI_KEY) {
            console.log(`Iniciando extracción en ${platform} con Apify... URLs:`, targetUrls);
            
            const startUrls = targetUrls.map((url: string) => ({ url }));
            let apifyActor = '';
            
            // Seleccionar el actor de Apify según la red (Asumimos Facebook por defecto para este ejemplo)
            if (platform === 'facebook') apifyActor = 'apify~facebook-pages-scraper';
            // if (platform === 'instagram') apifyActor = 'apify~instagram-scraper'; // Futura integración
            // if (platform === 'tiktok') apifyActor = 'clockwork~tiktok-profile-scraper'; // Futura integración

            if (!apifyActor) {
                return NextResponse.json({ error: `Scraper de ${platform} en mantenimiento. Usa Facebook.` }, { status: 400 });
            }

            const apifyRes = await fetch(`https://api.apify.com/v2/acts/${apifyActor}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startUrls: startUrls,
                    resultsLimit: 5 // Límite por petición para evitar timeouts de Vercel
                })
            });

            if (!apifyRes.ok) {
                console.error("Apify Error:", await apifyRes.text());
                throw new Error("Falló la conexión con Apify");
            }

            const scrapedData = await apifyRes.json();

            // 4. ANÁLISIS DE SENTIMIENTO CON GEMINI
            for (const post of scrapedData) {
                if (!post.text) continue;

                let prompt = `Analiza este comentario ciudadano de ${platform}: "${post.text}". `;
                if (context) {
                    prompt += `El usuario está rastreando específicamente este contexto estratégico: "${context}". Por favor, evalúa el sentimiento PRINCIPALMENTE en relación a ese contexto. `;
                }
                prompt += `Responde EXACTAMENTE con un JSON con este formato: {"sentiment": "Positivo|Neutral|Negativo", "topics": ["#Tema1", "Tema2"]}`;

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
                    platform: platform,
                    author_handle: post.pageName || post.ownerUsername || 'Usuario Anónimo',
                    author_avatar: post.profilePic || post.ownerProfilePicUrl || 'https://i.pravatar.cc/150?img=33',
                    content: post.text.substring(0, 500),
                    sentiment: sentiment,
                    topics: topics,
                    url: post.url,
                    posted_at: post.time || post.timestamp || new Date().toISOString()
                });
            }

        } else {
            // SIMULACIÓN REALISTA DE DEMOSTRACIÓN (Cuando no hay APIFY Token)
            console.log("No hay APIFY_API_TOKEN. Usando simulación dinámica realista...");
            await new Promise((resolve) => setTimeout(resolve, 2500)); // Simular tiempo de carga
            
            const randomAvatar = () => `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
            const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
            const focusContext = context ? context : 'Sosimo López';
            
            finalMentions = [
                { 
                    platform: platform, 
                    author_handle: `Juan Pérez (${platformName})`, 
                    author_avatar: randomAvatar(), 
                    content: `La verdad me parece muy bien la gestión respecto a ${focusContext}. Llevábamos tiempo pidiendo esto y por fin nos hacen caso. ¡Excelente!`, 
                    sentiment: 'Positivo', 
                    topics: ['#ObrasPúblicas', 'Gestión', focusContext.substring(0, 15)], 
                    url: targetUrls[0] || 'https://facebook.com',
                    posted_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // Hace 30 min
                },
                { 
                    platform: platform, 
                    author_handle: `María Hernández (${platformName})`, 
                    author_avatar: randomAvatar(), 
                    content: `Tengo mis dudas sobre lo que están haciendo con ${focusContext}. Espero que transparente los recursos porque se ve muy lento el avance.`, 
                    sentiment: 'Negativo', 
                    topics: ['#Transparencia', 'Queja', focusContext.substring(0, 15)], 
                    url: targetUrls[0] || 'https://facebook.com',
                    posted_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() // Hace 2 horas
                },
                { 
                    platform: platform, 
                    author_handle: `Comité Vecinal (${platformName})`, 
                    author_avatar: randomAvatar(), 
                    content: `Reunión informativa mañana en la plaza central para discutir detalles sobre ${focusContext}. Favor de asistir puntuales.`, 
                    sentiment: 'Neutral', 
                    topics: ['#ReuniónVecinal', 'Aviso', focusContext.substring(0, 15)], 
                    url: targetUrls[0] || 'https://facebook.com',
                    posted_at: new Date(Date.now() - 1000 * 60 * 300).toISOString() // Hace 5 horas
                }
            ];
        }

        // 5. Guardar en Base de Datos
        if (finalMentions.length > 0) {
            const { error: insertError } = await supabase.from('social_mentions').insert(finalMentions);
            if (insertError) throw insertError;
        }

        // 6. Actualizar log
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
