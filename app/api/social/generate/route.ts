import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, mentionContent, extraDetails } = body;

        if (!action || !mentionContent) {
            return NextResponse.json({ error: 'Action and mentionContent are required' }, { status: 400 });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY; // Para el audio
        
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key is missing' }, { status: 500 });
        }

        // 1. GENERACIÓN DE TEXTO CON GEMINI 2.0 FLASH
        let systemPrompt = "Eres el Director de Comunicación Social de un municipio. Tu trabajo es responder a menciones en redes sociales.";
        
        if (action === 'press_release') {
            systemPrompt += " Redacta un COMUNICADO DE PRENSA OFICIAL, formal y empático, para calmar a la ciudadanía respecto a esta mención/queja. Usa un tono institucional, claro y resolutivo. Máximo 3 párrafos.";
        } else if (action === 'video_script') {
            systemPrompt += " Escribe un GUION para un video corto (Reel/TikTok) donde el Alcalde responde a este problema. Debe tener: 1. Gancho (3 seg), 2. Acción que se está tomando (10 seg), 3. Llamado a la confianza (5 seg).";
        } else if (action === 'quick_reply') {
            systemPrompt += " Escribe una RESPUESTA CORTA (max 280 caracteres) para contestar directamente a este ciudadano en Twitter/Facebook. Sé empático y directo.";
        } else if (action === 'audio_script') {
            systemPrompt += " Escribe un SPOT DE RADIO O PERIFONEO corto, directo al grano, locución institucional. Máximo 40 palabras.";
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
