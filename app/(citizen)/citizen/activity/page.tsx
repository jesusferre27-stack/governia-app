import Link from "next/link";

export default function CitizenActivityPage() {
    return (
        <div className="p-4 space-y-6 pb-20 bg-gov-bg min-h-screen animate-in fade-in duration-500">

            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors"><span className="material-symbols-outlined">arrow_back</span></Link>
                <h2 className="text-xl font-bold text-white">Mis Reportes</h2>
                <Link href="/citizen/report" className="ml-auto bg-gov-primary p-2 rounded-full shadow-[0_0_10px_rgba(27,218,91,0.3)] text-gov-bg transform hover:scale-105 transition-all"><span className="material-symbols-outlined font-bold">add</span></Link>
            </div>

            {/* Search */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <span className="material-symbols-outlined text-gov-grey">search</span>
                <input type="text" placeholder="Buscar por título..." className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gov-grey" />
            </div>

            {/* List of Reports */}
            <div className="space-y-4">
                {[
                    { title: "Poste de luz fallando", date: "Reportado hace 2 días", loc: "Av. Principal", status: "En Proceso", icon: "lightbulb", statusColor: "text-amber-400 bg-amber-400/10 border border-amber-400/20", borderColor: "border-l-amber-400" },
                    { title: "Bache peligroso", date: "Resuelto hace 1 día", loc: "Calle Roble", status: "Resuelto", icon: "star", statusColor: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20", borderColor: "border-l-emerald-400" },
                    { title: "Basura acumulada", date: "Resuelto hace 3 días", loc: "Parque Ciudad", status: "Resuelto", icon: "delete", statusColor: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20", borderColor: "border-l-emerald-400" },
                    { title: "Fuga de agua", date: "Reportado hace 2 horas", loc: "Calle Sol #123", status: "Nuevo", icon: "water_drop", statusColor: "text-blue-400 bg-blue-400/10 border border-blue-400/20", borderColor: "border-l-blue-400" }
                ].map((item, i) => (
                    <div key={i} className={`bg-gov-surface border-y border-r border-gov-light/50 border-l-4 ${item.borderColor} p-4 rounded-xl flex items-center justify-between active:scale-[0.99] transition-all hover:bg-gov-surface/80 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gov-light/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-gov-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-gov-grey group-hover:text-white transition-colors">{item.icon}</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-base mb-1">{item.title}</h4>
                                <p className="text-xs text-gov-grey font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                                    {item.date} • {item.loc}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${item.statusColor}`}>
                                {item.status}
                            </div>
                            <span className="text-[10px] text-gov-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300 flex items-center gap-0.5">
                                Ver detalle <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
