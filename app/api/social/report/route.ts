import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { mentions, context } = await req.json();
        
        if (!mentions || mentions.length === 0) {
            return NextResponse.json({ error: 'No hay menciones para analizar' }, { status: 400 });
        }

        const GEMINI_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!GEMINI_KEY) {
            return NextResponse.json({ error: 'Falta llave de IA' }, { status: 500 });
        }

        // Preparar resumen de menciones para la IA (para no saturar el límite de tokens, tomamos las 50 más recientes)
        const sampleMentions = mentions.slice(0, 50).map((m: any) => `[${m.sentiment}] ${m.author_handle}: "${m.content}"`).join('\n');

        let prompt = `Eres el Analista Político y Director de Comunicación del Gobierno Municipal. 
Basándote en los siguientes comentarios extraídos de redes sociales ciudadanas, redacta un "Resumen Ejecutivo de Percepción Pública" muy profesional, detallado pero conciso, dirigido al Presidente Municipal.

Datos de los ciudadanos:
${sampleMentions}

Instrucciones:
1. Analiza el sentimiento general y los temas principales.
2. Identifica puntos fuertes (aciertos de la administración).
3. Identifica focos rojos (quejas recurrentes o alertas).
4. Termina con 2 recomendaciones estratégicas de comunicación o acción.
`;

        if (context) {
            prompt += `\nIMPORTANTE: El enfoque principal de este análisis debe centrarse en este tema/contexto: "${context}".`;
        }

        console.log("Enviando prompt a Gemini (2.0 Flash)...");
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            })
        });

        if (!geminiRes.ok) {
            const errorText = await geminiRes.text();
            console.error("Gemini API Error Detail:", errorText);
            throw new Error(`Falló la conexión con Gemini AI: ${geminiRes.status}`);
        }

        const geminiData = await geminiRes.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el reporte.";

        console.log("Reporte generado exitosamente por Gemini.");
        return NextResponse.json({ success: true, report: generatedText });

    } catch (error: any) {
        console.error("Report Generation Critical Error:", error);
        return NextResponse.json({ error: error.message || 'Error generando el reporte' }, { status: 500 });
    }
}
