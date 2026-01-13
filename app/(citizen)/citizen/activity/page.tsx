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
                    { title: "Poste de luz fallando", date: "23 Oct, 2023", loc: "Av. Principal", status: "En Proceso", icon: "lightbulb", color: "text-amber-400", statusColor: "text-amber-400 bg-amber-400/10 border border-amber-400/20" },
                    { title: "Bache peligroso", date: "21 Oct, 2023", loc: "Calle Roble", status: "Resuelto", icon: "star", color: "text-emerald-400", statusColor: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" },
                    { title: "Basura acumulada", date: "19 Oct, 2023", loc: "Parque Ciudad", status: "Resuelto", icon: "delete", color: "text-emerald-400", statusColor: "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" },
                    { title: "Fuga de agua", date: "15 Oct, 2023", loc: "Calle Sol #123", status: "Nuevo", icon: "water_drop", color: "text-blue-400", statusColor: "text-blue-400 bg-blue-400/10 border border-blue-400/20" }
                ].map((item, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light/50 p-4 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all hover:bg-gov-light/30 shadow-sm cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gov-bg flex items-center justify-center shrink-0 border border-gov-light group-hover:border-gov-primary/30 transition-colors">
                                <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-0.5">{item.title}</h4>
                                <p className="text-xs text-gov-grey font-medium">{item.date} • {item.loc}</p>
                            </div>
                        </div>
                        <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${item.statusColor}`}>
                            {item.status}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
