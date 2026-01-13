export default function IncidentDetailPage({ params }: { params: { id: string } }) {
    // Mock data would usually be fetched via params.id
    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">

            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-4">
                <a href="/incidents" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </a>
                <h2 className="text-2xl font-bold text-white">Detalle del Incidente</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Summary Card */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light pb-2">Resumen</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <p className="text-gov-grey mb-1">ID Incidente</p>
                                <p className="text-white font-mono font-bold">#INC-00123</p>
                            </div>
                            <div>
                                <p className="text-gov-grey mb-1">Tipo</p>
                                <p className="text-white font-bold">Vandalismo</p>
                            </div>
                            <div>
                                <p className="text-gov-grey mb-1">Reportado</p>
                                <p className="text-white">Oct 26, 2023, 10:15 AM</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-gov-grey mb-2">Descripción</p>
                            <p className="text-white leading-relaxed">Graffiti reportado en la pared oeste del Palacio Municipal. Contiene símbolos desconocidos y parece haber sido realizado durante la noche. Se requiere limpieza urgente debido a evento programado.</p>
                        </div>
                    </div>

                    {/* Photos */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Evidencia Fotográfica</h3>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            <div className="w-64 h-48 rounded-lg border border-gov-light overflow-hidden shrink-0 group relative">
                                <img src="/assets/evidence_1.png" alt="Evidence 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="w-64 h-48 bg-gov-bg rounded-lg border border-gov-light flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-gov-grey text-4xl">add_a_photo</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Línea de Tiempo</h3>
                        <div className="space-y-6 relative ml-2 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gov-light">
                            {/* Step 1 */}
                            <div className="flex gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-gov-primary flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(27,218,91,0.4)]">
                                    <span className="material-symbols-outlined text-gov-bg font-bold text-sm">report</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Reporte Recibido</h4>
                                    <p className="text-xs text-gov-grey">Oct 26, 10:15 AM</p>
                                </div>
                            </div>
                            {/* Step 2 */}
                            <div className="flex gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-gov-light border border-gov-grey/30 flex items-center justify-center shrink-0 z-10">
                                    <span className="material-symbols-outlined text-gov-grey text-sm">local_police</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Oficial Asignado</h4>
                                    <p className="text-xs text-gov-grey">Oct 26, 10:18 AM</p>
                                </div>
                            </div>
                            {/* Step 3 */}
                            <div className="flex gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-gov-light border border-gov-grey/30 flex items-center justify-center shrink-0 z-10">
                                    <span className="material-symbols-outlined text-gov-grey text-sm">cleaning_services</span>
                                </div>
                                <div>
                                    <h4 className="text-gov-grey font-medium text-sm">Limpieza Programada</h4>
                                    <p className="text-xs text-gov-grey/50">Pendiente</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">

                    {/* Map Placeholder */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden h-64 relative group shadow-lg">
                        <img src="/assets/map_placeholder.png" alt="Map Location" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                            <span className="text-white font-bold text-sm">Palacio Municipal</span>
                            <span className="text-gov-primary text-xs">Zona Centro</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 space-y-3">
                        <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-2">Acciones</h3>
                        <button className="w-full bg-gov-primary text-gov-bg font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(27,218,91,0.2)]">
                            <span className="material-symbols-outlined">check_circle</span>
                            Resolver Incidente
                        </button>
                        <button className="w-full bg-gov-light text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gov-light/80 transition-colors border border-gov-grey/20">
                            <span className="material-symbols-outlined">person_add</span>
                            Reasignar
                        </button>
                        <button className="w-full bg-gov-light text-gov-danger font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gov-danger/10 transition-colors border border-gov-grey/20">
                            <span className="material-symbols-outlined">delete</span>
                            Descartar
                        </button>
                    </div>

                    {/* Notes Input */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-4">
                        <h3 className="text-sm font-bold text-white mb-2">Notas Internas</h3>
                        <textarea className="w-full bg-gov-bg border border-gov-light rounded-lg p-3 text-sm text-white placeholder-gov-grey focus:border-gov-primary outline-none resize-none h-24" placeholder="Agregar una nota..."></textarea>
                        <div className="mt-2 flex justify-end">
                            <button className="text-xs font-bold text-gov-primary hover:underline">Guardar Nota</button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
