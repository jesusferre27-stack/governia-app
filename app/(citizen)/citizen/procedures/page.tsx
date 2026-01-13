import Link from "next/link";

export default function CitizenProceduresPage() {
    return (
        <div className="p-4 space-y-6 pb-20 bg-gov-bg min-h-screen animate-in fade-in duration-500">

            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors"><span className="material-symbols-outlined">arrow_back</span></Link>
                <h2 className="text-xl font-bold text-white">Servicios Digitales</h2>
                <span className="material-symbols-outlined text-gov-grey ml-auto hover:text-white transition-colors cursor-pointer">notifications</span>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gov-surface border border-gov-light p-5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <span className="material-symbols-outlined text-emerald-400 mb-2 text-3xl">folder</span>
                    <h3 className="text-3xl font-bold text-white">12</h3>
                    <p className="text-xs text-gov-grey font-bold uppercase tracking-wider">Solicitudes Totales</p>
                </div>
                <div className="bg-gov-surface border border-gov-light p-5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
                    <span className="material-symbols-outlined text-amber-400 mb-2 text-3xl">pending</span>
                    <h3 className="text-3xl font-bold text-white">2</h3>
                    <p className="text-xs text-gov-grey font-bold uppercase tracking-wider">Pendientes</p>
                </div>
            </div>

            <h3 className="text-white font-bold text-lg pt-2 pl-1">Trámites Disponibles</h3>

            <div className="space-y-3">
                {[
                    { name: "Licencia de Obra Menor", desc: "Para construcciones o remodelaciones", icon: "construction", color: "text-amber-400" },
                    { name: "Licencia de Funcionamiento", desc: "Para apertura de negocios", icon: "store", color: "text-emerald-400" },
                    { name: "Acta de Nacimiento", desc: "Copia certificada", icon: "description", color: "text-blue-400" },
                    { name: "Pago de Predial", desc: "Impuestos municipales", icon: "payments", color: "text-purple-400" }
                ].map((proc, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all group hover:bg-gov-light/30 cursor-pointer shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gov-bg flex items-center justify-center shrink-0 border border-gov-light group-hover:border-gov-primary/30 transition-colors shadow-inner">
                                <span className={`material-symbols-outlined ${proc.color}`}>{proc.icon}</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">{proc.name}</h4>
                                <p className="text-xs text-gov-grey">{proc.desc}</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-gov-grey/50 text-sm group-hover:text-gov-primary transition-colors">arrow_forward_ios</span>
                    </div>
                ))}
            </div>

        </div>
    );
}
