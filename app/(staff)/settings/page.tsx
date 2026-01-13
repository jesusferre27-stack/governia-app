"use client";

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Configuración</h2>
                <p className="text-gov-grey">Administración de identidad y parámetros globales del sistema.</p>
            </div>

            {/* Identity Section */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl p-8 flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gov-primary to-emerald-600"></div>

                {/* Logo / Fallback */}
                <div className="w-24 h-24 rounded-full bg-gov-bg border-4 border-gov-light flex items-center justify-center relative shrink-0">
                    <span className="text-3xl font-black text-white tracking-widest">SOT</span>
                    <button className="absolute bottom-0 right-0 bg-gov-primary text-gov-bg p-1.5 rounded-full border-2 border-gov-bg shadow-sm transition-transform hover:scale-110">
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                </div>

                <div>
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-emerald-500/20">Cliente Activo</span>
                    <h3 className="text-2xl font-bold text-white mb-1">Municipio de Soteapan</h3>
                    <p className="text-gov-grey text-sm">ID: MUN-VER-SOT-001 • Licencia Enterprise</p>
                </div>
            </div>

            {/* Institutional Data */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light pb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gov-primary">domain</span>
                    Datos Institucionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gov-grey uppercase tracking-wide">Nombre Oficial</label>
                        <input type="text" defaultValue="H. Ayuntamiento de Soteapan" className="w-full bg-gov-surface border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-colors font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gov-grey uppercase tracking-wide">Teléfono de Contacto</label>
                        <input type="text" defaultValue="(924) 123-4567" className="w-full bg-gov-surface border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-colors font-medium" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gov-grey uppercase tracking-wide">Dirección Oficial</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-3 text-gov-grey">location_on</span>
                            <input type="text" defaultValue="Palacio Municipal S/N, Centro, Soteapan, Veracruz" className="w-full bg-gov-surface border border-gov-light rounded-xl pl-10 pr-4 py-3 text-white focus:border-gov-primary outline-none transition-colors font-medium" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Modules (SaaS Focus) */}
            <div>
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gov-light pb-2">
                        <span className="material-symbols-outlined text-gov-primary">grid_view</span>
                        Módulos Activos
                    </h3>
                    <p className="text-xs text-gov-grey mt-2">
                        <span className="material-symbols-outlined text-[10px] mr-1">info</span>
                        Los módulos activados determinan las capacidades disponibles para la administración municipal.
                    </p>
                </div>

                <div className="space-y-3">
                    {[
                        { name: "Reportes Ciudadanos", desc: "Permitir a ciudadanos enviar reportes y seguimiento.", icon: "campaign", active: true },
                        { name: "Obras Públicas", desc: "Gestión transparente de proyectos de infraestructura.", icon: "engineering", active: true },
                        { name: "Análisis Social", desc: "Monitorización de sentimiento y tendencias locales.", icon: "query_stats", active: false }
                    ].map((mod, i) => (
                        <div key={i} className={`bg-gov-surface border ${mod.active ? 'border-gov-primary/30' : 'border-gov-light'} p-4 rounded-xl flex items-center justify-between transition-all hover:border-gov-primary/50`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${mod.active ? 'bg-gov-primary/10 text-gov-primary' : 'bg-gov-light text-gov-grey'}`}>
                                    <span className="material-symbols-outlined">{mod.icon}</span>
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${mod.active ? 'text-white' : 'text-gov-grey'}`}>{mod.name}</h4>
                                    <p className="text-xs text-gov-grey">{mod.desc}</p>
                                </div>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${mod.active ? 'bg-gov-primary' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${mod.active ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-end gap-2 pt-6 border-t border-gov-light/30">
                <p className="text-[10px] text-gov-grey italic">
                    Los cambios en esta sección afectan el comportamiento global del sistema y son auditados.
                </p>
                <button className="bg-gov-primary text-gov-bg font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(27,218,91,0.3)] hover:brightness-110 active:scale-95 transition-all">
                    Guardar Configuración
                </button>
            </div>
        </div>
    );
}
