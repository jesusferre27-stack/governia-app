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

    const positiveCount = mentions.filter(m => m.sentiment === 'Positivo').length;
    const globalSentiment = mentions.length > 0 ? Math.round((positiveCount / mentions.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Escucha Social & Centro AI</h2>
                    <p className="text-gov-grey">Análisis de sentimiento ciudadano y respuesta estratégica.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    
                    <div className="relative w-full md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-3 text-gov-grey text-sm">search</span>
                        <input 
                            type="text" 
                            placeholder="Ej. Sosimo Lopez, Baches..." 
                            value={keywordContext}
                            onChange={(e) => setKeywordContext(e.target.value)}
                            className="w-full bg-gov-surface border border-gov-light rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-gov-primary outline-none transition-colors"
                        />
                    </div>

                    <button onClick={() => setShowSourcesModal(true)} className="bg-gov-surface border border-gov-light text-gov-grey hover:text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">settings</span> <span className="hidden md:inline">Fuentes</span>
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setScrapeDropdownOpen(!scrapeDropdownOpen)}
                            disabled={isScraping || scrapesToday >= 10}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                                scrapesToday >= 10 
                                ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105'
                            }`}
                        >
                            {isScraping ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Extrayendo...</>
                            ) : scrapesToday >= 10 ? (
                                <><span className="material-symbols-outlined">diamond</span> Comprar Créditos</>
                            ) : (
                                <><span className="material-symbols-outlined">radar</span> Extraer Percepción <span className="material-symbols-outlined text-[16px]">expand_more</span></>
                            )}
                        </button>
                        
                        {scrapeDropdownOpen && scrapesToday < 10 && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-gov-bg border border-gov-light rounded-xl shadow-2xl z-50 overflow-hidden">
                                {['facebook', 'twitter', 'instagram', 'tiktok'].map(plat => (
                                    <button key={plat} onClick={() => handleScrape(plat)} className="w-full text-left px-4 py-3 hover:bg-gov-surface text-white text-sm font-bold flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-gov-primary text-sm">wifi_tethering</span>
                                        {plat.charAt(0).toUpperCase() + plat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gov-surface border border-gov-light px-3 py-2 rounded-lg text-center min-w-[80px]">
                        <p className="text-[10px] text-gov-grey uppercase tracking-widest font-bold">Créditos</p>
                        <p className={`font-black text-lg ${scrapesToday >= 10 ? 'text-red-400' : 'text-white'}`}>{10 - scrapesToday}/10</p>
                    </div>
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

