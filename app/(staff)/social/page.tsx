export default function SocialPage() {
    const mentions = [
        { id: 1, handle: "@juan_perez", content: "¡El nuevo parque en el Centro está fantástico! Da gusto ver más áreas verdes.", sentiment: "Positivo", time: "Hace 2h", avatar: "https://i.pravatar.cc/100?img=11" },
        { id: 2, handle: "@maria_gomez", content: "El semáforo de la Av. Principal es un caos en hora pico. ¡Urge arreglarlo!", sentiment: "Negativo", time: "26 Oct", avatar: "https://i.pravatar.cc/100?img=5" },
        { id: 3, handle: "@noticias_locales", content: "Sesión del cabildo programada para este jueves a las 7 PM.", sentiment: "Neutral", time: "25 Oct", avatar: "https://i.pravatar.cc/100?img=3" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Escucha Social</h2>
                    <p className="text-gov-grey">Análisis de sentimiento y menciones en redes.</p>
                </div>

                {/* Time Filter & Platforms */}
                <div className="flex items-center gap-4">
                    <div className="bg-gov-surface p-1 rounded-lg border border-gov-light flex gap-1">
                        <button className="px-3 py-1.5 rounded bg-gov-light text-white font-bold text-xs shadow-sm">Hoy</button>
                        <button className="px-3 py-1.5 rounded text-gov-grey hover:text-white font-medium text-xs transition-colors">7 días</button>
                        <button className="px-3 py-1.5 rounded text-gov-grey hover:text-white font-medium text-xs transition-colors">30 días</button>
                    </div>

                    <div className="flex gap-2 bg-gov-surface p-1 rounded-lg border border-gov-light hidden md:flex">
                        <button className="px-3 py-1.5 rounded bg-gov-light text-white font-medium text-xs">Twitter/X</button>
                        <button className="px-3 py-1.5 rounded text-gov-grey font-medium text-xs hover:text-white">Facebook</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Sentiment Donut */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 flex flex-col items-center justify-center relative">
                    <p className="absolute top-4 w-full text-center text-[10px] text-gov-grey uppercase tracking-widest font-bold">Percepción Ciudadana General</p>
                    <h3 className="absolute top-8 left-0 right-0 text-center text-white font-bold text-lg">Sentimiento Global</h3>

                    <div className="w-48 h-48 rounded-full border-8 border-gov-light flex items-center justify-center relative mt-8">
                        <svg className="absolute inset-0 transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="#1BDA5B" strokeWidth="16" fill="transparent" strokeDasharray="552" strokeDashoffset="100" className="text-gov-primary drop-shadow-[0_0_10px_rgba(27,218,91,0.3)]" />
                        </svg>
                        <div className="text-center">
                            <span className="text-4xl font-bold text-white block">85%</span>
                            <span className="text-gov-primary text-sm font-bold bg-gov-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">Positivo</span>
                        </div>
                    </div>
                </div>

                {/* Topics Cloud (Mock) */}
                <div className="lg:col-span-2 bg-gov-surface border border-gov-light rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Temas de Tendencia</h3>
                    <div className="flex flex-wrap gap-3">
                        {["#ParqueCentral", "#Baches", "#Seguridad", "#Maraton2024", "Alcalde", "Tráfico", "Luminarias", "Predial"].map((tag, i) => (
                            <span key={i} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all cursor-pointer hover:scale-105 ${i % 3 === 0 ? "bg-gov-primary/10 border-gov-primary text-gov-primary" :
                                i % 3 === 1 ? "bg-gov-light border-gov-grey/30 text-white" :
                                    "bg-gov-danger/10 border-gov-danger text-gov-danger"
                                }`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 flex flex-col justify-center space-y-6">
                    <div>
                        <p className="text-gov-grey text-xs uppercase tracking-wider">Total de Menciones</p>
                        <h4 className="text-2xl font-bold text-white">1,482</h4>
                    </div>
                    <div>
                        <p className="text-gov-grey text-xs uppercase tracking-wider">Alcance Estimado</p>
                        <h4 className="text-2xl font-bold text-white">45.2K</h4>
                    </div>
                    <div>
                        <p className="text-gov-grey text-xs uppercase tracking-wider">Tasa de Interacción</p>
                        <h4 className="text-2xl font-bold text-white">4.8%</h4>
                    </div>
                </div>
            </div>

            {/* Mentions Feed */}
            <h3 className="text-xl font-bold text-white pt-4">Menciones Recientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentions.map((mention) => (
                    <div key={mention.id} className="bg-gov-surface border border-gov-light rounded-2xl p-6 hover:border-gov-primary/30 transition-all cursor-pointer group relative overflow-hidden">
                        {/* Attention Badge for Negative Sentiment */}
                        {mention.sentiment === "Negativo" && (
                            <div className="absolute top-0 right-0 bg-gov-danger text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg border-l border-b border-gov-bg z-10 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">warning</span>
                                REQUIERE ATENCIÓN
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img src={mention.avatar} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gov-bg group-hover:border-gov-primary transition-colors" />
                                <div>
                                    <h4 className="text-white font-bold text-sm">{mention.handle}</h4>
                                    <p className="text-gov-grey text-xs">{mention.time}</p>
                                </div>
                            </div>
                            {mention.sentiment !== "Negativo" && (
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${mention.sentiment === "Positivo" ? "bg-gov-primary/10 text-gov-primary" :
                                    "bg-gray-700 text-gray-300"
                                    }`}>
                                    {mention.sentiment}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-white transition-colors">
                            {mention.content}
                        </p>
                        <div className="flex gap-4 text-gov-grey text-xs border-t border-gov-light/30 pt-4">
                            <span className="flex items-center gap-1 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">favorite</span> Me Gusta</span>
                            <span className="flex items-center gap-1 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">reply</span> Responder</span>
                            <span className="flex items-center gap-1 hover:text-gov-primary ml-auto transition-colors font-bold"><span className="material-symbols-outlined text-sm">auto_awesome</span> Sugerir Respuesta</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
