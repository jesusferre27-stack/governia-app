import Link from "next/link";

export default function CitizenHome() {
    return (
        <div className="bg-gov-bg min-h-full pb-20 animate-in fade-in duration-500">

            {/* App Bar */}
            <div className="bg-gov-surface/60 backdrop-blur-xl sticky top-0 z-40 p-4 flex justify-between items-center border-b border-gov-light/50 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gov-light overflow-hidden border-2 border-gov-primary p-0.5">
                        <img src="https://i.pravatar.cc/100?img=12" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                        <span className="text-xs text-gov-grey font-medium uppercase tracking-wider block">Bienvenido</span>
                        <span className="font-bold text-white text-sm">Alejandra M.</span>
                    </div>
                </div>
                <button className="text-gov-text relative p-2 hover:bg-gov-light/30 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-white">notifications</span>
                    <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-gov-danger rounded-full border-2 border-gov-bg"></span>
                </button>
            </div>

            <div className="p-5 space-y-8">

                {/* Quick Actions (Hero) */}
                <div className="space-y-4">
                    <Link href="/citizen/report">
                        <button className="w-full bg-gradient-to-r from-emerald-500 to-gov-primary text-gov-bg font-bold p-5 rounded-3xl shadow-[0_8px_30px_rgba(27,218,91,0.3)] flex items-center justify-between group active:scale-95 transition-all relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-3xl"></div>
                            <span className="flex items-center gap-4 relative z-10">
                                <span className="bg-gov-bg/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                                    <span className="material-symbols-outlined text-gov-bg text-2xl">flag</span>
                                </span>
                                <div className="text-left">
                                    <span className="block text-lg leading-none">Reportar</span>
                                    <span className="text-xs opacity-80 font-medium">un problema ahora</span>
                                </div>
                            </span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform bg-gov-bg/20 p-1 rounded-full">arrow_forward</span>
                        </button>
                    </Link>

                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/citizen/activity">
                            <button className="w-full bg-gov-surface/40 border border-gov-light/50 backdrop-blur-md text-white font-medium p-4 rounded-3xl flex flex-col gap-3 group active:scale-95 transition-all hover:bg-gov-surface/60 hover:border-gov-primary/30">
                                <span className="bg-gov-light/50 p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-gov-primary">history</span>
                                </span>
                                <div className="text-left">
                                    <span className="block font-bold">Mis Reportes</span>
                                    <span className="text-xs text-gov-grey">Ver historial</span>
                                </div>
                            </button>
                        </Link>

                        <Link href="/citizen/procedures">
                            <button className="w-full bg-gov-surface/40 border border-gov-light/50 backdrop-blur-md text-white font-medium p-4 rounded-3xl flex flex-col gap-3 group active:scale-95 transition-all hover:bg-gov-surface/60 hover:border-gov-primary/30">
                                <span className="bg-gov-light/50 p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-blue-400">description</span>
                                </span>
                                <div className="text-left">
                                    <span className="block font-bold">Trámites</span>
                                    <span className="text-xs text-gov-grey">Digitales</span>
                                </div>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Announcements Carousel */}
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-white font-bold text-lg">Novedades</h3>
                        <span className="text-xs text-gov-primary font-bold">Ver todo</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-5 px-5">
                        {/* Card 1 */}
                        <div className="min-w-[280px] h-48 rounded-3xl bg-gov-surface border border-gov-light overflow-hidden relative group shadow-lg shrink-0">
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity transform group-hover:scale-105 duration-700" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519331379826-f959196e5b36?q=80&w=1000&auto=format&fit=crop)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block shadow-lg border border-white/20 backdrop-blur-md">INAUGURACIÓN</span>
                                <h4 className="text-white font-bold text-lg leading-tight mb-1">Nuevo Parque Central</h4>
                                <p className="text-gray-300 text-xs line-clamp-2">Visita las nuevas áreas verdes y juegos infantiles recién renovados.</p>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="min-w-[280px] h-48 rounded-3xl bg-gov-surface border border-gov-light overflow-hidden relative group shadow-lg shrink-0">
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity transform group-hover:scale-105 duration-700" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop)' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                <span className="bg-amber-500 text-gov-bg text-[10px] font-bold px-3 py-1 rounded-full mb-2 inline-block shadow-lg border border-white/20 backdrop-blur-md">DEPORTES</span>
                                <h4 className="text-white font-bold text-lg leading-tight mb-1">Maratón Anual 2024</h4>
                                <p className="text-gray-300 text-xs line-clamp-2">Inscríbete este fin de semana y recibe tu kit de corredor.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Nearby */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Cerca de ti</h3>
                    <div className="flex flex-col gap-3">
                        <div className="bg-gov-surface/50 backdrop-blur-sm p-4 rounded-3xl border border-gov-light/50 flex items-center gap-4 hover:bg-gov-surface/80 transition-colors cursor-pointer group">
                            <div className="w-14 h-14 rounded-2xl bg-gov-light/50 flex items-center justify-center text-gov-primary shrink-0 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">local_library</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Biblioteca Central</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold border border-emerald-400/20">ABIERTO</span>
                                    <span className="text-xs text-gov-grey">Cierra 8 PM</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gov-grey ml-auto group-hover:text-white transition-colors">arrow_forward_ios</span>
                        </div>
                        <div className="bg-gov-surface/50 backdrop-blur-sm p-4 rounded-3xl border border-gov-light/50 flex items-center gap-4 hover:bg-gov-surface/80 transition-colors cursor-pointer group">
                            <div className="w-14 h-14 rounded-2xl bg-gov-light/50 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">park</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Parque La Concordia</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gov-grey flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">location_on</span> 1.2 km</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gov-grey ml-auto group-hover:text-white transition-colors">arrow_forward_ios</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
