"use client";

import Link from "next/link";

export default function CitizenHome() {
    return (
        <div className="animate-in fade-in duration-500">

            {/* Header / Welcome Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="text-gov-primary text-xs font-bold uppercase tracking-widest mb-1 block">Portal de Servicios Digitales</span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Hola, Alejandra</h1>
                    <p className="text-gov-grey mt-1">¿Qué deseas gestionar hoy en tu municipio?</p>
                </div>
                <div className="hidden md:block">
                    <span className="text-xs text-gov-grey bg-gov-surface border border-gov-light px-3 py-1 rounded-full">
                        Último acceso: Hoy, 10:42 AM
                    </span>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* Left Column (Primary Actions) - Spans 8 cols on desktop */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Hero Action - Full Width High Contrast - FIXED COLOR */}
                    <Link href="/citizen/report" className="block group">
                        <button className="w-full bg-[#1BDA5B] hover:bg-[#16b54a] text-[#0B1116] font-bold p-8 rounded-3xl shadow-[0_10px_40px_rgba(27,218,91,0.2)] flex items-center justify-between transition-all transform hover:scale-[1.01] border border-white/10 relative overflow-hidden group">
                            {/* Clean Background - Force Hex Color #1BDA5B for Safety */}

                            <div className="flex items-center gap-6 relative z-10 w-full">
                                <div className="bg-[#0f4633]/15 p-5 rounded-2xl border border-[#0B1116]/10 shadow-sm">
                                    <span className="material-symbols-outlined text-4xl text-[#0B1116]">add_a_photo</span>
                                </div>
                                <div className="text-left flex-1">
                                    <span className="block text-2xl md:text-3xl leading-tight mb-2 font-heading tracking-tight font-extrabold text-[#0B1116]">Reportar un Problema</span>
                                    <span className="text-base font-semibold text-[#0B1116]/70 tracking-wide block max-w-lg">Baches, alumbrado, fugas de agua o recolección de basura.</span>
                                </div>
                                <div className="bg-black/10 p-3 rounded-full group-hover:bg-black/20 transition-colors shrink-0">
                                    <span className="material-symbols-outlined text-3xl text-[#0B1116]">arrow_forward</span>
                                </div>
                            </div>
                        </button>
                    </Link>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/citizen/activity" className="group">
                            <div className="h-full bg-gov-surface border border-gov-light p-6 rounded-3xl flex flex-col justify-between hover:border-gov-primary hover:shadow-[0_0_20px_rgba(27,218,91,0.1)] transition-all cursor-pointer min-h-[180px] relative overflow-hidden">
                                {/* Context Image */}
                                <div className="absolute inset-0 opacity-20 grayscale mix-blend-overlay group-hover:scale-105 transition-transform duration-700">
                                    <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Reportes" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-gov-surface via-gov-surface/80 to-transparent"></div>

                                <span className="material-symbols-outlined text-gov-grey text-4xl group-hover:text-gov-primary transition-colors mb-4 block relative z-10">history</span>
                                <div className="relative z-10">
                                    <h3 className="text-white font-bold text-xl mb-1 group-hover:text-gov-primary transition-colors">Mis Reportes</h3>
                                    <p className="text-sm text-gov-grey group-hover:text-white transition-colors">3 activos • 12 resueltos</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/citizen/procedures" className="group">
                            <div className="h-full bg-gov-surface border border-gov-light p-6 rounded-3xl flex flex-col justify-between hover:border-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.1)] transition-all cursor-pointer min-h-[180px] relative overflow-hidden">
                                {/* Context Image */}
                                <div className="absolute inset-0 opacity-10 grayscale mix-blend-overlay group-hover:scale-105 transition-transform duration-700">
                                    <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Trámites" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-gov-surface via-gov-surface/90 to-transparent"></div>

                                <span className="material-symbols-outlined text-gov-grey text-4xl group-hover:text-blue-400 transition-colors mb-4 block relative z-10">description</span>
                                <div className="relative z-10">
                                    <h3 className="text-white font-bold text-xl mb-1 group-hover:text-blue-400 transition-colors">Trámites y Servicios</h3>
                                    <p className="text-sm text-gov-grey group-hover:text-white transition-colors">Pago de predial, agua y licencias</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Official News (Wide format) */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-gov-primary rounded-full"></span>
                            Noticias Oficiales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg bg-gov-surface">
                                <img src="https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" alt="Parque Central" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-6 z-20">
                                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block shadow-sm">OBRAS</span>
                                    <h4 className="text-white font-bold text-xl mb-1 drop-shadow-md">Inauguración del Parque Central</h4>
                                    <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-sm font-medium">Nuevas áreas verdes para la convivencia familiar.</p>
                                </div>
                            </div>

                            <div className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg bg-gov-surface border border-gov-light flex flex-col">
                                <div className="h-32 overflow-hidden relative">
                                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Evento" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gov-surface to-transparent"></div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
                                    <span className="text-amber-500 text-[10px] font-bold uppercase mb-1">CULTURA</span>
                                    <h4 className="text-white font-bold text-lg mb-1">Maratón Municipal 2024</h4>
                                    <p className="text-xs text-gov-grey">Inscripciones abiertas hasta el 15 de Nov.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Sidebar/Info) - Spans 4 cols on desktop */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Profile Card Mini */}
                    <Link href="/citizen/profile">
                        <div className="bg-gov-surface border border-gov-light rounded-3xl p-6 relative overflow-hidden group hover:border-gov-primary transition-all cursor-pointer">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gov-light p-1 border border-gov-light group-hover:border-gov-primary transition-colors">
                                    <img src="https://i.pravatar.cc/100?img=12" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold group-hover:text-gov-primary transition-colors">Alejandra M.</h3>
                                    <p className="text-xs text-gov-grey">Ciudadano Verificado</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="bg-gov-bg/50 p-3 rounded-xl">
                                    <span className="block text-2xl font-bold text-white">12</span>
                                    <span className="text-[10px] text-gov-grey uppercase">Reportes</span>
                                </div>
                                <div className="bg-gov-bg/50 p-3 rounded-xl">
                                    <span className="block text-2xl font-bold text-gov-primary">5</span>
                                    <span className="text-[10px] text-gov-grey uppercase">Puntos</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Directory Quick Link */}
                    <Link href="/citizen/directory">
                        <div className="bg-blue-600 hover:bg-blue-500 rounded-3xl p-6 flex items-center justify-between cursor-pointer transition-colors shadow-lg shadow-blue-900/20 group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <span className="material-symbols-outlined text-white text-2xl">import_contacts</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Directorio</h3>
                                    <p className="text-blue-100 text-xs">Números de emergencia y oficinas</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-white group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                        </div>
                    </Link>

                    {/* Nearby Services List */}
                    <div className="bg-gov-surface/50 border border-gov-light/30 rounded-3xl p-6">
                        <h3 className="text-white font-bold text-base mb-4 flex justify-between items-center">
                            Servicios Cercanos
                            <span className="text-xs text-gov-primary cursor-pointer hover:underline">Ver mapa</span>
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: "Biblioteca Municipal", status: "Abierto", dist: "0.5 km", icon: "local_library" },
                                { name: "Centro de Salud", status: "Abierto 24h", dist: "1.2 km", icon: "local_hospital" },
                                { name: "Tesorería", status: "Cierra 3 PM", dist: "2.0 km", icon: "payments" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-gov-light flex items-center justify-center text-gov-grey group-hover:text-gov-primary group-hover:bg-gov-primary/10 transition-colors">
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white text-sm font-bold group-hover:text-gov-primary transition-colors">{item.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gov-grey">
                                            <span>{item.status}</span>
                                            <span>•</span>
                                            <span>{item.dist}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Banner - Muted & Institutional */}
                    <div className="bg-red-900/10 border border-red-900/40 rounded-3xl p-6 text-center">
                        <span className="material-symbols-outlined text-red-500/80 text-3xl mb-2">emergency</span>
                        <h4 className="text-red-100 font-bold mb-1">¿Emergencia?</h4>
                        <p className="text-xs text-red-300/80 mb-4">Contacta directamente a servicios de emergencia.</p>
                        <button className="bg-red-900/80 hover:bg-red-800 text-red-100 font-bold py-2 px-6 rounded-xl w-full text-sm transition-colors border border-red-700/50">
                            Llamar 911
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
