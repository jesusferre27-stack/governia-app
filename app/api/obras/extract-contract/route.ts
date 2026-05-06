import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = file.type || "image/jpeg";

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const prompt = `Analiza esta imagen de una carátula de contrato de obra pública mexicana y extrae los siguientes datos en formato JSON. Si un campo no es visible o no aplica, usa null.

Campos a extraer:
{
  "contract_number": "número o clave del contrato",
  "contractor_name": "nombre de la empresa contratista",
  "contract_amount": número en MXN (solo el número, sin símbolos ni comas),
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "object_description": "descripción del objeto del contrato (qué obra o servicio es)",
  "municipality": "nombre del municipio",
  "dependency": "nombre de la dependencia o dirección contratante"
}

Responde ÚNICAMENTE con el JSON, sin explicaciones ni markdown.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64,
                                }
                            },
                            { text: prompt }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 1024,
                    }
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: 500 });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Parse the JSON from the response
        let extracted: Record<string, any> = {};
        try {
            // Remove potential markdown code fences
            const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            extracted = JSON.parse(cleanText);
        } catch {
            // If parsing fails, return raw text for manual review
            extracted = { raw_text: text, parse_error: true };
        }

        return NextResponse.json({ success: true, data: extracted, raw: text });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
