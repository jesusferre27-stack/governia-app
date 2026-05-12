"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function SocialPage() {
    const [mentions, setMentions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrapesToday, setScrapesToday] = useState(0);
    const [isScraping, setIsScraping] = useState(false);
    
    // UI & Sources State
    const [showSourcesModal, setShowSourcesModal] = useState(false);
    const [scrapeDropdownOpen, setScrapeDropdownOpen] = useState(false);
    const [sources, setSources] = useState<any[]>([]);
    const [newSourceUrl, setNewSourceUrl] = useState('');
    const [newSourcePlatform, setNewSourcePlatform] = useState('facebook');
    const [keywordContext, setKeywordContext] = useState(''); // Nuevo estado para contexto estratégico
    
    // AI Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [activeMention, setActiveMention] = useState<any | null>(null);
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const [polishedPost, setPolishedPost] = useState<string | null>(null);
    const [isPolishing, setIsPolishing] = useState(false);

    // PDF Report State
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [executiveReportText, setExecutiveReportText] = useState('');

    const supabase = createClient();

    useEffect(() => {
        fetchData();
        checkScrapeLimits();
        fetchSources();
    }, []);

    const fetchSources = async () => {
        const { data } = await supabase.from('social_sources').select('*').order('created_at', { ascending: true });
        if (data) setSources(data);
    };

    const addSource = async () => {
        if (!newSourceUrl) return;
        const { error } = await supabase.from('social_sources').insert({
            platform: newSourcePlatform,
            url: newSourceUrl,
            name: newSourceUrl.replace('https://www.facebook.com/', '').substring(0, 20)
        });
        if (!error) {
            setNewSourceUrl('');
            fetchSources();
        }
    };

    const deleteSource = async (id: string) => {
        await supabase.from('social_sources').delete().eq('id', id);
        fetchSources();
    };

    const checkScrapeLimits = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('social_scrape_logs')
                .select('scrapes_count')
                .eq('date_str', today)
                .eq('user_id', user.id)
                .single();

            if (data) {
                setScrapesToday(data.scrapes_count);
            }
        } catch (err) {
            console.error("Error comprobando límites:", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('social_mentions')
            .select('*')
            .order('posted_at', { ascending: false });

        if (data) setMentions(data);
        setLoading(false);
    };

    const handleScrape = async (platform: string) => {
        if (scrapesToday >= 10) {
            alert("Has alcanzado el límite diario de 10 extracciones. Adquiere el plan Ilimitado.");
            return;
        }

        setScrapeDropdownOpen(false);

        setIsScraping(true);
        try {
            // Extraer las URLs específicas de la plataforma seleccionada desde el estado frontend
            const targetUrls = sources.filter(s => s.platform === platform).map(s => s.url);

            const { data: { session } } = await supabase.auth.getSession();
            const { data: { user } } = await supabase.auth.getUser();
            const res = await fetch('/api/social/scrape', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ 
                    userId: user?.id, 
                    platform,
                    urls: targetUrls,
                    context: keywordContext // Enviamos las palabras clave al servidor
                })
            });

            const result = await res.json();
            if (res.ok) {
                setScrapesToday(result.new_count);
                await fetchData();
            } else {
                alert(result.error || "Error al extraer datos.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión.");
        }
        setIsScraping(false);
    };

    const generateAIContent = async (action: string) => {
        if (!activeMention) return;
        setIsGenerating(true);
        setGeneratedContent(null);
        setAudioUrl(null);

        try {
            const res = await fetch('/api/social/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    mentionContent: activeMention.content,
                    extraDetails: `Plataforma: ${activeMention.platform}`
                })
            });

            const data = await res.json();
            if (res.ok) {
                setGeneratedContent(data.text);
                if (data.audio) {
                    setAudioUrl(data.audio);
                }
            } else {
                alert(data.error || "Error generando contenido.");
            }
        } catch (err) {
            console.error(err);
        }
        setIsGenerating(false);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUploadedPhotos(prev => [...prev, event.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const polishPost = async () => {
        if (!generatedContent) return;
        setIsPolishing(true);
        try {
            const res = await fetch('/api/social/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'polish_post',
                    mentionContent: generatedContent,
                    extraDetails: uploadedPhotos.length > 0 ? 'Se adjuntan fotos de evidencia del trabajo.' : ''
                })
            });

            const data = await res.json();
            if (res.ok) {
                setPolishedPost(data.text);
            } else {
                alert(data.error || "Error puliendo contenido.");
            }
        } catch (err) {
            console.error(err);
        }
        setIsPolishing(false);
    };

    const generatePDFReport = async () => {
        if (mentions.length === 0) {
            alert("No hay datos para generar el reporte.");
            return;
        }
        
        setIsGeneratingReport(true);
        try {
            console.log("Iniciando generación de reporte PDF...");
            // 1. Obtener Resumen de Gemini
            const res = await fetch('/api/social/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mentions, context: keywordContext })
            });
            const data = await res.json();
            
            if (!res.ok) {
                console.error("Error en API de reporte:", data.error);
                throw new Error(data.error || "Error al redactar el análisis ejecutivo.");
            }
            
            setExecutiveReportText(data.report);
            console.log("Resumen ejecutivo obtenido de Gemini.");

            // 2. Generar PDF en un iFrame aislado para evitar crash de html2canvas con Tailwind
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const htmlContent = `
                <html>
                <head><meta charset="utf-8" /></head>
                <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <div style="border-bottom: 4px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between;">
                        <div>
                            <h1 style="font-size: 28px; font-weight: bold; margin: 0; color: #111;">H. AYUNTAMIENTO</h1>
                            <p style="margin: 5px 0 0 0; color: #666;">Centro de Inteligencia y Escucha Social</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="font-size: 18px; font-weight: bold; margin: 0;">Reporte Ejecutivo de Percepción Pública</p>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>

                    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                        <div style="flex: 1; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; text-align: center; background: #f9fafb;">
                            <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Sentimiento Positivo</p>
                            <p style="font-size: 40px; font-weight: bold; color: #16a34a; margin: 0;">${globalSentiment}%</p>
                        </div>
                        <div style="flex: 1; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; text-align: center; background: #f9fafb;">
                            <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Volumen Analizado</p>
                            <p style="font-size: 40px; font-weight: bold; color: #2563eb; margin: 0;">${mentions.length}</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 20px; color: #166534; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">Análisis Estratégico AI</h2>
                        <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                            ${data.report.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}
                        </div>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h2 style="font-size: 18px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">Muestreo de Comentarios Relevantes</h2>
                        ${mentions.slice(0, 5).map((m: any) => `
                            <div style="border-left: 4px solid #9ca3af; padding: 10px 15px; margin-bottom: 15px; background: #f9fafb;">
                                <p style="font-size: 12px; color: #6b7280; margin: 0 0 5px 0;">
                                    <b>${m.author_handle}</b> en ${m.platform} 
                                    <span style="background: ${m.sentiment === 'Positivo' ? '#22c55e' : m.sentiment === 'Negativo' ? '#ef4444' : '#6b7280'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 10px;">${m.sentiment}</span>
                                </p>
                                <p style="font-size: 14px; color: #1f2937; margin: 0; font-style: italic;">"${m.content}"</p>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                        Documento generado confidencialmente por el Sistema Governia Inteligencia Social.
                    </div>
                </body>
                </html>
            `;

            if (iframe.contentDocument) {
                iframe.contentDocument.open();
                iframe.contentDocument.write(htmlContent);
                iframe.contentDocument.close();

                console.log("Iframe de reporte listo. Preparando conversión a PDF...");

                setTimeout(async () => {
                    try {
                        const html2pdfModule = await import('html2pdf.js');
                        const html2pdf = html2pdfModule.default || html2pdfModule;
                        
                        console.log("Librería html2pdf cargada correctamente.");

                        const opt = {
                            margin:       10,
                            filename:     'Analisis_Opinion_Publica.pdf',
                            image:        { type: 'jpeg', quality: 0.98 },
                            html2canvas:  { scale: 2, useCORS: true, logging: false },
                            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        };
                        
                        await html2pdf().set(opt).from(iframe.contentDocument?.body).save();
                        console.log("PDF generado y descarga iniciada.");
                    } catch (pdfError) {
                        console.error("Error detallado de PDF:", pdfError);
                        alert("Error al guardar el PDF. Revisa la consola para más detalles.");
                    } finally {
                        document.body.removeChild(iframe);
                        setIsGeneratingReport(false);
                    }
                }, 800); // Aumentado ligeramente el tiempo de renderizado
            }

        } catch (err: any) {
            console.error("Error general en generación de reporte:", err);
            alert(err.message || "Error al redactar el análisis ejecutivo.");
            setIsGeneratingReport(false);
        }
    };

    const positiveCount = mentions.filter(m => m.sentiment === 'Positivo').length;
    const globalSentiment = mentions.length > 0 ? Math.round((positiveCount / mentions.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Escucha Social & Centro AI</h2>
                        <p className="text-gov-grey">Análisis de sentimiento ciudadano y respuesta estratégica.</p>
                    </div>
                    
                    <div className="bg-gov-surface border border-gov-light px-4 py-2 rounded-xl text-center shadow-lg flex items-center gap-3">
                        <div className="text-left">
                            <p className="text-[10px] text-gov-grey uppercase tracking-widest font-bold">Créditos</p>
                            <p className={`font-black text-xl leading-none ${scrapesToday >= 10 ? 'text-red-400' : 'text-white'}`}>{10 - scrapesToday}<span className="text-gray-500 text-sm">/10</span></p>
                        </div>
                        <span className="material-symbols-outlined text-yellow-500 text-3xl">diamond</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-gov-surface border border-gov-light p-3 rounded-2xl shadow-sm">
                    <div className="relative flex-grow md:max-w-xs">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-gov-grey text-sm">search</span>
                        <input 
                            type="text" 
                            placeholder="Ej. Baches, Seguridad..." 
                            value={keywordContext}
                            onChange={(e) => setKeywordContext(e.target.value)}
                            className="w-full bg-gov-bg border border-gov-light rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-gov-primary outline-none transition-colors"
                        />
                    </div>

                    <button onClick={() => setShowSourcesModal(true)} className="bg-gov-bg border border-gov-light text-gov-grey hover:text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">settings</span> <span className="hidden xl:inline text-sm font-bold">Fuentes</span>
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setScrapeDropdownOpen(!scrapeDropdownOpen)}
                            disabled={isScraping || scrapesToday >= 10}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm shadow-lg transition-all ${
                                scrapesToday >= 10 
                                ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
                            }`}
                        >
                            {isScraping ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Extrayendo...</>
                            ) : scrapesToday >= 10 ? (
                                <><span className="material-symbols-outlined text-sm">diamond</span> Sin Créditos</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm">radar</span> Extraer Percepción <span className="material-symbols-outlined text-sm">expand_more</span></>
                            )}
                        </button>
                        
                        {scrapeDropdownOpen && scrapesToday < 10 && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-gov-bg border border-gov-light rounded-xl shadow-2xl z-50 overflow-hidden">
                                {['facebook', 'twitter', 'instagram', 'tiktok'].map(plat => (
                                    <button key={plat} onClick={() => handleScrape(plat)} className="w-full text-left px-4 py-3 hover:bg-gov-surface text-white text-sm font-bold flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-gov-primary text-sm">wifi_tethering</span>
                                        {plat.charAt(0).toUpperCase() + plat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-[1px] h-8 bg-gov-light mx-2 hidden md:block"></div>

                    <button 
                        onClick={generatePDFReport}
                        disabled={isGeneratingReport || mentions.length === 0}
                        className={`bg-gov-bg border border-gov-light text-white hover:text-green-400 hover:border-green-500/50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${isGeneratingReport ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isGeneratingReport ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <span className="material-symbols-outlined text-red-400 text-sm">picture_as_pdf</span>
                        )}
                        <span className="text-sm font-bold">Generar Reporte (1)</span>
                    </button>

                    <button 
                        onClick={() => {
                            if (!executiveReportText) {
                                alert('Por favor, genera primero el Reporte PDF (Paso 1) para que la Inteligencia Artificial analice la situación global.');
                                return;
                            }
                            setActiveMention({ author_handle: 'Análisis Ciudadano Global', content: executiveReportText, platform: 'Múltiples Redes' });
                        }}
                        disabled={mentions.length === 0 || isGeneratingReport}
                        className={`bg-gov-bg border border-gov-light text-white hover:text-purple-400 hover:border-purple-500/50 px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${(mentions.length === 0 || isGeneratingReport) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className="material-symbols-outlined text-purple-400 text-sm">smart_toy</span>
                        <span className="text-sm font-bold">Estrategia AI (2)</span>
                    </button>
                </div>
            </div>

            {showSourcesModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gov-bg border border-gov-light rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
                        <button onClick={() => setShowSourcesModal(false)} className="absolute top-4 right-4 text-gov-grey hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary">settings</span> Gestión de Fuentes de IA
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">Añade los perfiles y páginas oficiales que la IA debe auditar.</p>

                        <div className="flex flex-col md:flex-row gap-2 mb-6">
                            <select 
                                value={newSourcePlatform} 
                                onChange={(e) => setNewSourcePlatform(e.target.value)}
                                className="bg-gov-surface border border-gov-light rounded-xl px-4 py-3 text-white outline-none focus:border-gov-primary"
                            >
                                <option value="facebook">Facebook</option>
                                <option value="twitter">X (Twitter)</option>
                                <option value="instagram">Instagram</option>
                                <option value="tiktok">TikTok</option>
                            </select>
                            <input 
                                type="url" 
                                placeholder="https://..." 
                                value={newSourceUrl}
                                onChange={(e) => setNewSourceUrl(e.target.value)}
                                className="flex-1 bg-gov-surface border border-gov-light rounded-xl px-4 py-3 text-white outline-none focus:border-gov-primary text-sm"
                            />
                            <button onClick={addSource} className="bg-gov-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-gov-primary/80 transition-colors">
                                Añadir
                            </button>
                        </div>

                        <div className="bg-gov-surface border border-gov-light rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                            {sources.length === 0 ? (
                                <p className="text-gray-500 text-center py-6 text-sm">No hay fuentes configuradas.</p>
                            ) : (
                                <table className="w-full text-left">
                                    <tbody>
                                        {sources.map(s => (
                                            <tr key={s.id} className="border-b border-gov-light/50 last:border-0 hover:bg-white/5">
                                                <td className="px-4 py-3 text-xs font-bold text-gov-primary uppercase w-24">{s.platform}</td>
                                                <td className="px-4 py-3 text-sm text-gray-300 truncate max-w-[200px]">{s.url}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => deleteSource(s.id)} className="text-red-400 hover:text-red-300 text-xs font-bold bg-red-400/10 px-3 py-1 rounded-lg">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Action Drawer Modal (Simple Overlay) */}
            {activeMention && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gov-bg border border-gov-light rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setActiveMention(null); setGeneratedContent(null); setAudioUrl(null); setPolishedPost(null); setUploadedPhotos([]); }} className="absolute top-4 right-4 text-gov-grey hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary">smart_toy</span> War Room AI
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">Genera una estrategia de comunicación basada en el: <b>{activeMention.author_handle}</b>.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            <button onClick={() => generateAIContent('press_release')} className="bg-gov-surface hover:bg-gray-800 border border-gov-light p-3 rounded-xl text-center transition-colors">
                                <span className="material-symbols-outlined text-blue-400 mb-1">article</span>
                                <p className="text-xs text-white font-bold">Comunicado Oficial</p>
                            </button>
                            <button onClick={() => generateAIContent('video_script')} className="bg-gov-surface hover:bg-gray-800 border border-gov-light p-3 rounded-xl text-center transition-colors">
                                <span className="material-symbols-outlined text-pink-400 mb-1">movie</span>
                                <p className="text-xs text-white font-bold">Guion TikTok</p>
                            </button>
                            <button onClick={() => generateAIContent('audio_script')} className="bg-gov-surface hover:bg-gray-800 border border-gov-light p-3 rounded-xl text-center transition-colors">
                                <span className="material-symbols-outlined text-purple-400 mb-1">campaign</span>
                                <p className="text-xs text-white font-bold">Spot + Audio Voz</p>
                            </button>
                            <button onClick={() => generateAIContent('quick_reply')} className="bg-gov-surface hover:bg-gray-800 border border-gov-light p-3 rounded-xl text-center transition-colors">
                                <span className="material-symbols-outlined text-green-400 mb-1">reply</span>
                                <p className="text-xs text-white font-bold">Respuesta Rápida</p>
                            </button>
                        </div>

                        {isGenerating && (
                            <div className="p-10 text-center flex flex-col items-center">
                                <div className="w-8 h-8 border-4 border-gov-primary/30 border-t-gov-primary rounded-full animate-spin mb-4"></div>
                                <p className="text-gov-primary font-bold animate-pulse">Gemini 2.0 procesando inteligencia estratégica...</p>
                            </div>
                        )}

                        {generatedContent && !polishedPost && (
                            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4">
                                <h4 className="text-sm font-bold text-gov-primary mb-2 uppercase tracking-widest">Borrador Estratégico:</h4>
                                <div className="bg-gov-surface border border-gov-light p-4 rounded-xl max-h-40 overflow-y-auto mb-4">
                                    <p className="text-white text-sm whitespace-pre-wrap">{generatedContent}</p>
                                </div>
                                
                                {/* Evidencia Fotográfica */}
                                <div className="mb-4">
                                    <p className="text-xs text-gray-400 mb-2 font-bold uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">photo_camera</span> 
                                        Adjuntar Evidencia Fotográfica
                                    </p>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {uploadedPhotos.map((photo, idx) => (
                                            <div key={idx} className="relative min-w-[80px] h-[80px] rounded-lg overflow-hidden border border-gov-light">
                                                <img src={photo} alt="Evidencia" className="w-full h-full object-cover" />
                                                <button onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-red-500/80 text-white flex items-center justify-center w-5 h-5">
                                                    <span className="material-symbols-outlined text-[12px]">close</span>
                                                </button>
                                            </div>
                                        ))}
                                        <label className="min-w-[80px] h-[80px] border-2 border-dashed border-gov-light hover:border-gov-primary rounded-lg flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gov-primary transition-colors bg-gov-bg/50">
                                            <span className="material-symbols-outlined mb-1 text-lg">add_a_photo</span>
                                            <span className="text-[10px] font-bold">Subir Foto</span>
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                        </label>
                                    </div>
                                </div>

                                {/* Botón de Pulido */}
                                <button 
                                    onClick={polishPost}
                                    disabled={isPolishing}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                                >
                                    {isPolishing ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Diseñando post institucional...</>
                                    ) : (
                                        <><span className="material-symbols-outlined">auto_awesome</span> Optimizar para Redes Sociales con IA</>
                                    )}
                                </button>

                                {audioUrl && (
                                    <div className="mt-4 bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white">record_voice_over</span>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">Audio Sintético Generado</p>
                                                <p className="text-xs text-purple-300">Powered by ElevenLabs</p>
                                            </div>
                                        </div>
                                        <audio controls src={audioUrl} className="h-10"></audio>
                                    </div>
                                )}
                            </div>
                        )}

                        {polishedPost && (
                            <div className="mt-6 animate-in fade-in slide-in-from-right-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">verified</span> Post Listo para Publicar
                                    </h4>
                                    <button onClick={() => setPolishedPost(null)} className="text-xs text-gray-400 hover:text-white underline">Volver al Borrador</button>
                                </div>
                                
                                {/* Vista Previa Tipo Facebook */}
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                                    <div className="p-4 pb-2">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gov-primary flex items-center justify-center text-white font-bold text-lg">H</div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                                    Gobierno Municipal 
                                                    <span className="material-symbols-outlined text-blue-500 text-[14px]">verified</span>
                                                </p>
                                                <p className="text-[11px] text-gray-500">Justo ahora • 🌎</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 text-sm whitespace-pre-wrap">{polishedPost}</p>
                                    </div>
                                    
                                    {uploadedPhotos.length > 0 && (
                                        <div className={`mt-3 grid gap-[1px] bg-gray-200 ${uploadedPhotos.length === 1 ? 'grid-cols-1' : uploadedPhotos.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                                            {uploadedPhotos.map((photo, idx) => (
                                                <img key={idx} src={photo} alt="Evidencia" className="w-full h-48 object-cover bg-white" />
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="px-4 py-2 border-t border-gray-100 flex gap-4 text-gray-500 text-xs font-bold">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">thumb_up</span> Me gusta</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span> Comentar</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">share</span> Compartir</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        alert("¡Post publicado exitosamente en las redes sociales del Gobierno Municipal!");
                                        setActiveMention(null); setGeneratedContent(null); setPolishedPost(null); setUploadedPhotos([]);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(22,163,74,0.4)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                                >
                                    <span className="material-symbols-outlined">send</span> PUBLICAR EN CANALES OFICIALES
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sentiment Donut */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-gov-primary/10 blur-3xl rounded-full"></div>
                    <p className="absolute top-4 w-full text-center text-[10px] text-gov-grey uppercase tracking-widest font-bold">Percepción Ciudadana General</p>
                    <h3 className="absolute top-8 left-0 right-0 text-center text-white font-bold text-lg">Sentimiento Global</h3>

                    <div className="w-48 h-48 rounded-full border-8 border-gov-light flex items-center justify-center relative mt-8">
                        <svg className="absolute inset-0 transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="#1BDA5B" strokeWidth="16" fill="transparent" strokeDasharray="552" strokeDashoffset={`${100 - globalSentiment}`} className="text-gov-primary drop-shadow-[0_0_10px_rgba(27,218,91,0.3)] transition-all duration-1000" />
                        </svg>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-white block">{globalSentiment}%</span>
                            <span className="text-gov-primary text-sm font-bold bg-gov-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">Positivo</span>
                        </div>
                    </div>
                </div>

                {/* Topics Cloud */}
                <div className="lg:col-span-2 bg-gov-surface border border-gov-light rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Temas de Tendencia (Extraídos por IA)</h3>
                    <div className="flex flex-wrap gap-3">
                        {Array.from(new Set(mentions.flatMap(m => m.topics || []))).slice(0, 10).map((tag: any, i) => (
                            <span key={i} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-default ${i % 3 === 0 ? "bg-gov-primary/10 border-gov-primary text-gov-primary" :
                                i % 3 === 1 ? "bg-blue-500/10 border-blue-500 text-blue-400" :
                                    "bg-gov-light border-gov-grey/30 text-white"
                                }`}>
                                {tag}
                            </span>
                        ))}
                        {mentions.length === 0 && <p className="text-gray-500 text-sm">No hay temas extraídos aún.</p>}
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-gov-grey text-xs uppercase tracking-wider">Total Menciones Analizadas</p>
                        <h4 className="text-3xl font-bold text-white">{mentions.length}</h4>
                    </div>
                    <div>
                        <p className="text-gov-grey text-xs uppercase tracking-wider">Última Extracción</p>
                        <h4 className="text-lg font-bold text-white">{scrapesToday > 0 ? 'Hoy' : 'Sin datos hoy'}</h4>
                    </div>
                </div>
            </div>

            {/* Mentions Feed */}
            <h3 className="text-xl font-bold text-white pt-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-gov-primary">rss_feed</span> 
                Monitoreo en Tiempo Real
            </h3>
            
            {loading ? (
                <div className="text-center py-10 text-gray-500 animate-pulse">Cargando inteligencia de redes...</div>
            ) : mentions.length === 0 ? (
                <div className="text-center py-10 bg-gov-surface border border-gov-light rounded-2xl text-gray-400">
                    No hay menciones en la base de datos. Presiona "Extraer Percepción" para iniciar.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentions.map((mention) => (
                        <div key={mention.id} className="bg-gov-surface border border-gov-light rounded-2xl p-6 hover:border-gov-primary/30 transition-all group relative overflow-hidden flex flex-col">
                            {/* Attention Badge for Negative Sentiment */}
                            {mention.sentiment === "Negativo" && (
                                <div className="absolute top-0 right-0 bg-red-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10 flex items-center gap-1 animate-pulse">
                                    <span className="material-symbols-outlined text-[12px]">warning</span>
                                    ALERTA DE CRISIS
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={mention.author_avatar || '/assets/placeholder_user.png'} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gov-bg object-cover" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-black border border-gov-light">
                                            {/* Icono pequeño de la red social */}
                                            <span className="text-[8px] font-bold text-white uppercase">{mention.platform.substring(0, 1)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm truncate max-w-[120px]">{mention.author_handle}</h4>
                                        <p className="text-gov-grey text-[10px] uppercase tracking-widest">{new Date(mention.posted_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {mention.sentiment !== "Negativo" && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${mention.sentiment === "Positivo" ? "bg-gov-primary/10 text-gov-primary border border-gov-primary/20" :
                                        "bg-gray-800 text-gray-300 border border-gray-600"
                                        }`}>
                                        {mention.sentiment}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                                "{mention.content}"
                            </p>
                            
                            <div className="pt-4 mt-2">
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

