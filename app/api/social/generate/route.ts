import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, mentionContent, extraDetails } = body;

        if (!action || !mentionContent) {
            return NextResponse.json({ error: 'Action and mentionContent are required' }, { status: 400 });
        }

        const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY; // Para el audio
        
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is missing' }, { status: 500 });
        }

        // 1. GENERACIÓN DE TEXTO CON GEMINI 2.0 FLASH
        let systemPrompt = `Eres el Estratega Principal de Comunicación de Crisis de un Gobierno Municipal en México. 
Tu objetivo es analizar el Reporte de Inteligencia Social proporcionado (que resume la opinión de decenas de ciudadanos) y diseñar una estrategia de contención y respuesta masiva.
REGLAS ESTRICTAS:
1. NO inventes nombres de calles, colonias o proyectos. Basate únicamente en los problemas detectados en el reporte.
2. Si el texto menciona un nombre propio (ej. "Sosimo"), asume que es el alcalde o directivo, NO una calle.
3. Tu estrategia debe resolver el problema REAL a nivel macro, demostrando que el Gobierno Municipal tiene el control de la situación.`;
        
        if (action === 'press_release') {
            systemPrompt += "\nTAREA: Redacta un COMUNICADO DE PRENSA OFICIAL (máximo 3 párrafos). Tono institucional, de liderazgo y resolutivo. Anuncia acciones masivas e inmediatas del gobierno para resolver la problemática general detectada en el reporte.";
        } else if (action === 'video_script') {
            systemPrompt += "\nTAREA: Escribe un GUION para un video corto (TikTok/Reel) del Alcalde dirigiéndose a toda la ciudadanía. Estructura: 1. Reconocimiento del problema general (3 seg), 2. Las cuadrillas ya están trabajando/Acción masiva (10 seg), 3. Llamado a la calma y confianza (5 seg).";
        } else if (action === 'quick_reply') {
            systemPrompt += "\nTAREA: Escribe una RESPUESTA TIPO (max 280 caracteres) que los community managers puedan usar para contestar masivamente a los ciudadanos en redes sociales. Sé directo y ofréceles una liga de seguimiento o canal oficial.";
        } else if (action === 'audio_script') {
            systemPrompt += "\nTAREA: Escribe un SPOT DE RADIO institucional (máx 40 palabras) para difusión masiva, informando a la ciudad que el problema detectado está siendo resuelto por el municipio.";
        } else if (action === 'polish_post') {
            systemPrompt += "\nTAREA: Toma el texto base proporcionado y dale 'una mano de gato' para convertirlo en un POST DE REDES SOCIALES (Facebook/Instagram) de ALTO NIVEL GUBERNAMENTAL. Debe sonar muy profesional, moderno, con emojis estratégicos, e indicar sutilmente que se adjuntan fotos de evidencia del trabajo realizado. Usa hashtags institucionales. Hazlo lucir como el trabajo de una agencia de relaciones públicas top.";
        }

        const prompt = `Mención ciudadana:\n"${mentionContent}"\n\n${extraDetails ? 'Contexto adicional: ' + extraDetails + '\n' : ''}\nGenera el contenido solicitado.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.4 }
            })
        });

        if (!geminiRes.ok) throw new Error('Error llamando a Gemini AI');
        
        const geminiData = await geminiRes.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar contenido.';

        // 2. GENERACIÓN DE AUDIO CON ELEVENLABS (Opcional, solo si se solicita y hay API Key)
        let audioUrl = null;
        let audioBase64 = null;

        if ((action === 'video_script' || action === 'audio_script') && ELEVENLABS_API_KEY) {
            console.log("Generando audio con ElevenLabs...");
            // ID de voz genérica (ej. "Rachel" o alguna voz institucional)
            const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; 
            
            const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: generatedText,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
            });

            if (elevenRes.ok) {
                // Convertir stream de audio a Base64 para mandarlo al frontend
                const audioBuffer = await elevenRes.arrayBuffer();
                audioBase64 = Buffer.from(audioBuffer).toString('base64');
            } else {
                console.error("ElevenLabs Error:", await elevenRes.text());
            }
        }

        return NextResponse.json({ 
            success: true, 
            text: generatedText,
            audio: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : null
        });

    } catch (error: any) {
        console.error("Generate AI Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
