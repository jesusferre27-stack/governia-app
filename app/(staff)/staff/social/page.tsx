"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function SocialPage() {
    const [mentions, setMentions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrapesToday, setScrapesToday] = useState(0);
    const [isScraping, setIsScraping] = useState(false);
    
    // AI Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [activeMention, setActiveMention] = useState<any | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
        checkScrapeLimits();
    }, []);

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

    const handleScrape = async () => {
        if (scrapesToday >= 5) {
            alert("Has alcanzado el límite diario de 5 extracciones.");
            return;
        }

        setIsScraping(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const res = await fetch('/api/social/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id })
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

    const positiveCount = mentions.filter(m => m.sentiment === 'Positivo').length;
    const globalSentiment = mentions.length > 0 ? Math.round((positiveCount / mentions.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Escucha Social & Centro AI</h2>
                    <p className="text-gov-grey">Análisis de sentimiento ciudadano y respuesta estratégica.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleScrape}
                        disabled={isScraping || scrapesToday >= 5}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                            scrapesToday >= 5 
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
                        }`}
                    >
                        {isScraping ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Extrayendo...</>
                        ) : (
                            <><span className="material-symbols-outlined">radar</span> Extraer Percepción</>
                        )}
                    </button>
                    <div className="bg-gov-surface border border-gov-light px-3 py-2 rounded-lg text-center">
                        <p className="text-[10px] text-gov-grey uppercase tracking-widest font-bold">Límite Diario</p>
                        <p className="text-white font-black text-lg">{scrapesToday}/5</p>
                    </div>
                </div>
            </div>

            {/* AI Action Drawer Modal (Simple Overlay) */}
            {activeMention && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gov-bg border border-gov-light rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
                        <button onClick={() => { setActiveMention(null); setGeneratedContent(null); setAudioUrl(null); }} className="absolute top-4 right-4 text-gov-grey hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary">smart_toy</span> War Room AI
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">Genera respuestas automáticas para la mención de <b>{activeMention.author_handle}</b>.</p>

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

                        {generatedContent && (
                            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4">
                                <h4 className="text-sm font-bold text-gov-primary mb-2 uppercase tracking-widest">Resultado Generado:</h4>
                                <div className="bg-gov-surface border border-gov-light p-4 rounded-xl max-h-60 overflow-y-auto">
                                    <p className="text-white text-sm whitespace-pre-wrap">{generatedContent}</p>
                                </div>
                                
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
                            
                            <div className="pt-4 border-t border-gov-light/30">
                                <button 
                                    onClick={() => setActiveMention(mention)}
                                    className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                                    Resolver con Inteligencia Artificial
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

