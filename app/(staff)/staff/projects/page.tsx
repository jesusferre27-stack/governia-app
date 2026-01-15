import Link from "next/link";

const projects = [
    { id: 1, name: "Renovación Parque Central", status: "En Progreso", progress: 65, contractor: "Constructora del Valle", end: "30 Jun 2024", img: "/assets/park_construction.png" },
    { id: 2, name: "Pavimentación Calle 5 de Mayo", status: "Planeación", progress: 10, contractor: "Obras Civiles S.A.", end: "15 Feb 2025", img: "/assets/road_work.png" },
    { id: 3, name: "Alumbrado Zona Norte", status: "Completado", progress: 100, contractor: "EduBuild", end: "01 Oct 2023", img: "/assets/lighting_repair.png" },
];

export default function ProjectsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Obras Públicas</h2>
                    <p className="text-gov-grey">Monitoreo y avance de infraestructura.</p>
                </div>
                <button className="bg-gov-primary text-gov-bg font-bold px-4 py-2 rounded-lg text-sm shadow-lg shadow-gov-primary/20 flex items-center gap-2 hover:brightness-110 transition-all">
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Proyecto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                    <Link href={`/staff/projects/${proj.id}`} key={proj.id}>
                        <div className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden group cursor-pointer hover:border-gov-primary/50 transition-all hover:shadow-[0_0_20px_rgba(27,218,91,0.1)]">
                            <div className="h-48 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${proj.img})` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-gov-surface to-transparent"></div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${proj.status === "En Progreso" ? "bg-gov-primary text-gov-bg" :
                                        proj.status === "Completado" ? "bg-emerald-600 text-white" : "bg-amber-400 text-gov-bg"
                                        }`}>
                                        {proj.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gov-primary transition-colors">{proj.name}</h3>
                                    <p className="text-sm text-gray-300 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">business</span>
                                        {proj.contractor}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 relative z-10 bg-gov-surface">
                                <div className="flex justify-between text-sm text-gov-grey mb-2">
                                    <span>Progreso</span>
                                    <span className="font-bold text-white">{proj.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gov-bg rounded-full overflow-hidden">
                                    <div className="h-full bg-gov-primary rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${proj.progress}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gov-light/30">
                                    <div>
                                        <p className="text-xs text-gov-grey">Finalización Est.</p>
                                        <p className="text-sm font-bold text-white">{proj.end}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gov-grey">Presupuesto</p>
                                        <p className="text-sm font-bold text-white">$2.5M</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
