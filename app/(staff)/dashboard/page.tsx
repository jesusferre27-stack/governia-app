import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Panel de Control</h2>
                    <p className="text-gov-grey font-medium">Resumen operativo y alertas críticas del municipio</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-gov-surface hover:bg-gov-light text-white px-4 py-2 rounded-lg text-sm font-medium border border-gov-light transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                        Oct 26, 2023
                    </button>
                    <button className="bg-gov-primary hover:bg-emerald-400 text-gov-bg px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(27,218,91,0.4)] transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Nueva Tarea
                    </button>
                </div>
            </div>

            {/* KPI Grid - Top Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* KPI 1 */}
                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden group hover:border-gov-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">Nuevos Reportes</p>
                            <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gov-primary transition-colors">124</h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-gov-primary">inbox</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gov-primary font-bold">+5.1%</span>
                        <span className="text-gov-grey">vs semana pasada</span>
                    </div>
                </div>

                {/* KPI 2 - SLA Breaches */}
                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden group hover:border-gov-danger/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">SLA Breaches</p>
                            <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gov-danger transition-colors">12</h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-gov-danger">timer_off</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="bg-gov-danger/10 text-gov-danger px-2 py-0.5 rounded font-bold">2 CRÍTICOS</span>
                        <span className="text-gov-grey">hoy</span>
                    </div>
                </div>

                {/* KPI 3 - Obras Atrasadas */}
                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden group hover:border-gov-accent/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">Obras Atrasadas</p>
                            <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gov-accent transition-colors">8</h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-gov-accent">construction</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gov-grey">Requieren atención</span>
                    </div>
                </div>

                {/* KPI 4 - Response Time (NEW) */}
                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden group hover:border-blue-400/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">T. Respuesta Promedio</p>
                            <h3 className="text-3xl font-bold text-white mt-2 text-blue-400">6.4h</h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-blue-400">speed</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400 font-bold">-1.2h</span>
                        <span className="text-gov-grey">vs mes pasado</span>
                    </div>
                </div>
            </div>

            {/* AI Action Card */}
            <div className="bg-gradient-to-r from-gov-surface to-gov-light border border-gov-light p-1 rounded-2xl shadow-lg">
                <div className="bg-gov-bg/50 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-amber-500/20 rounded-full shrink-0 animate-pulse">
                        <span className="material-symbols-outlined text-amber-500 text-3xl">lightbulb</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-amber-500 text-gov-bg text-[10px] font-bold px-2 py-0.5 rounded uppercase">Acción Recomendada</span>
                            <span className="text-gov-grey text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">schedule</span> Hace 10 min</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Anomalía detectada en Alumbrado Público</h3>
                        <p className="text-gray-300 text-sm">Se ha detectado un aumento anómalo del 40% en reportes en la <span className="text-white font-bold">Colonia Centro</span>. Posible falla de circuito.</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] text-gov-grey uppercase font-bold">Prioridad</p>
                            <p className="text-amber-500 font-bold">ALTA</p>
                        </div>
                        <button className="bg-amber-500 hover:bg-amber-400 text-gov-bg font-bold px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined">assignment_ind</span>
                            Asignar Cuadrilla
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section - Takes 2 cols */}
                <div className="lg:col-span-2 bg-gov-surface border border-gov-light rounded-2xl flex flex-col overflow-hidden h-[500px] relative group">
                    <div className="absolute top-6 left-6 z-10 bg-gov-surface/90 backdrop-blur px-4 py-2 rounded-xl border border-gov-light/50 shadow-lg">
                        <h3 className="text-white font-bold">Mapa de Calor</h3>
                        <div className="flex items-center gap-3 text-xs mt-1">
                            <span className="flex items-center gap-1 text-gov-danger font-bold"><span className="w-2 h-2 rounded-full bg-gov-danger"></span> 3 Críticos</span>
                            <span className="flex items-center gap-1 text-gov-accent font-bold"><span className="w-2 h-2 rounded-full bg-gov-accent"></span> 12 Activos</span>
                            <span className="flex items-center gap-1 text-emerald-500 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> 45 Resueltos</span>
                        </div>
                    </div>

                    <img src="/assets/dashboard_map.png" alt="Mapa de Incidentes" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Interactive Overlay Mock */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gov-bg via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Recent Evidence & Sentiment - Takes 1 col */}
                <div className="space-y-6">

                    {/* Visual Evidence Block */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-gov-primary">photo_camera</span>
                                Evidencia Reciente
                            </h3>
                            <button className="text-gov-primary text-xs font-bold hover:underline">Ver todo</button>
                        </div>
                        <div className="space-y-3">
                            {/* Item 1 */}
                            <div className="relative h-32 rounded-xl overflow-hidden group cursor-pointer border border-gov-light/30">
                                <img src="/assets/incident_pothole.png" alt="Bache" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 w-full pr-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="bg-gov-danger text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block">CRÍTICO</span>
                                            <p className="text-white font-bold text-sm leading-tight">Bache Profundo</p>
                                            <p className="text-gray-300 text-xs">Av. Reforma • Hace 1h</p>
                                        </div>
                                        <span className="text-[10px] text-gov-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            Ver incidente <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Item 2 */}
                            <div className="relative h-32 rounded-xl overflow-hidden group cursor-pointer border border-gov-light/30">
                                <img src="/assets/incident_trash.png" alt="Basura" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 w-full pr-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="bg-gov-accent text-gov-bg text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block">MEDIO</span>
                                            <p className="text-white font-bold text-sm leading-tight">Acumulación de Basura</p>
                                            <p className="text-gray-300 text-xs">Calle 12 • Hace 3h</p>
                                        </div>
                                        <span className="text-[10px] text-gov-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            Ver incidente <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Mini */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-bold text-sm">Clima Social</h3>
                            <span className="text-gov-primary text-xs font-bold">Positivo 70%</span>
                        </div>
                        <div className="w-full bg-gov-bg rounded-full h-2 mb-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-gov-primary h-full rounded-full" style={{ width: "70%" }}></div>
                        </div>
                        <p className="text-gov-grey text-xs">La percepción ciudadana ha mejorado un 5% tras el anuncio de obras.</p>
                    </div>

                </div>
            </div>

        </div>
    );
}
