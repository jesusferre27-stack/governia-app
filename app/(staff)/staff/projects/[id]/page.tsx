import Link from "next/link";
import { notFound } from "next/navigation";

// Mock database of projects
const projectsData: Record<string, any> = {
    "1": {
        id: "1",
        name: "Renovación Parque Central",
        description: "Rehabilitación integral de áreas verdes, juegos infantiles y alumbrado público. El proyecto incluye la instalación de un nuevo sistema de riego automatizado.",
        status: "En Progreso",
        type: "infrastructure",
        progress: 65,
        budget: "$2,500,000 MXN",
        startDate: "15 Ene 2024",
        endDate: "30 Jun 2024",
        contractor: "Constructora del Valle S.A.",
        lastUpdated: "Hace 2 días",
        approval: 78,
        disapproval: 22,
        image: "/assets/park_construction.png",
        map: "/assets/project_map.png",
        location: "Av. Central y Calle 5",
        updates: [
            { date: "10 Feb 2024", status: "Instalación de luminarias completada en zona norte.", type: "green" },
            { date: "05 Feb 2024", status: "Retraso leve en entrega de material de cantera.", type: "yellow" },
            { date: "25 Ene 2024", status: "Inicio de movimiento de tierras y nivelación.", type: "green" },
            { date: "15 Ene 2024", status: "Arranque de obra con presencia del Alcalde.", type: "green" },
        ]
    },
    "2": {
        id: "2",
        name: "Pavimentación Calle 5 de Mayo",
        description: "Recapeteo asfáltico y señalización vial en la arteria principal del centro histórico. Incluye nivelación de alcantarillas y pintura de cruces peatonales.",
        status: "Planeación",
        type: "road",
        progress: 10,
        budget: "$1,200,000 MXN",
        startDate: "01 Mar 2024",
        endDate: "15 Abr 2024",
        contractor: "Obras Civiles S.A.",
        lastUpdated: "Hace 1 semana",
        approval: 85,
        disapproval: 15,
        image: "/assets/road_work.png",
        map: "/assets/project_map.png", // Reusing map for demo
        location: "Calle 5 de Mayo, Centro",
        updates: [
            { date: "20 Feb 2024", status: "Estudios topográficos finalizados.", type: "green" },
            { date: "10 Feb 2024", status: "Aprobación de presupuesto por el cabildo.", type: "green" },
        ]
    },
    "3": {
        id: "3",
        name: "Alumbrado Zona Norte",
        description: "Sustitución de 500 luminarias de vapor de sodio por tecnología LED de alta eficiencia. Reducción estimada del 40% en consumo eléctrico.",
        status: "Completado",
        type: "services",
        progress: 100,
        budget: "$850,000 MXN",
        startDate: "10 Ene 2024",
        endDate: "20 Feb 2024",
        contractor: "EcoLight Solutions",
        lastUpdated: "Hace 3 semanas",
        approval: 92,
        disapproval: 8,
        image: "/assets/lighting_repair.png",
        map: "/assets/project_map.png", // Reusing map for demo
        location: "Colonias del Norte",
        updates: [
            { date: "20 Feb 2024", status: "Entrega oficial de obra y encendido inaugural.", type: "green" },
            { date: "01 Feb 2024", status: "Avance del 80% en instalación de postes.", type: "green" },
            { date: "15 Ene 2024", status: "Llegada de suministro de lámparas LED.", type: "green" },
        ]
    }
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projectsData[id];

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white">
                <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
                <Link href="/projects" className="text-gov-primary mt-4 hover:underline">Volver al listado</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Link href="/projects" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-white">{project.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gov-grey text-sm">ID: #{project.id}</p>
                            <span className="w-1 h-1 rounded-full bg-gov-grey"></span>
                            <p className="text-gov-primary text-sm font-bold flex items-center gap-1">
                                <span className="max-w-[8px] max-h-[8px] min-w-[8px] min-h-[8px] rounded-full bg-gov-primary animate-pulse"></span>
                                Actualizado {project.lastUpdated}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="bg-gov-surface border border-gov-light text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-gov-light/50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">warning</span>
                        Ver Riesgos
                    </button>
                    <button className="bg-gov-primary text-gov-bg font-bold px-4 py-2 rounded-xl text-sm shadow-[0_0_15px_rgba(27,218,91,0.3)] hover:brightness-110 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">update</span>
                        Solicitar Actualización
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Image */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl h-80 relative overflow-hidden group shadow-2xl">
                        <img src={project.image} alt="Avance de Obra" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gov-bg/90 via-transparent to-transparent"></div>

                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gov-light/30 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${project.status === 'Completado' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                            <span className="text-sm font-bold text-white">{project.status === 'En Progreso' ? 'En Ejecución' : project.status}</span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Avance Visual</h3>
                            <p className="text-gray-300 text-sm max-w-xl">
                                {project.id === "1" && "Vista actual de la zona de juegos infantiles y andadores principales."}
                                {project.id === "2" && "Trabajos de nivelación y aplicación de carpeta asfáltica en tramo principal."}
                                {project.id === "3" && "Nuevas luminarias instaladas y funcionales en avenida principal."}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gov-primary">info</span>
                                Descripción
                            </h3>
                            <p className="text-gov-grey text-sm leading-relaxed">{project.description}</p>
                        </div>

                        {/* Citizen Perception */}
                        <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-400">campaign</span>
                                    Percepción Ciudadana
                                </h3>
                                <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded-lg border border-blue-500/20">EN VIVO</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1 text-center border-r border-gov-light/30">
                                    <span className="text-4xl font-bold text-emerald-400 block mb-1">👍 {project.approval}%</span>
                                    <span className="text-xs text-gov-grey uppercase tracking-wider font-bold">Aprobación</span>
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-2xl font-bold text-gov-danger block mb-1">👎 {project.disapproval}%</span>
                                    <span className="text-xs text-gov-grey uppercase tracking-wider font-bold">Rechazo</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="w-full h-2 bg-gov-danger rounded-full overflow-hidden flex">
                                    <div style={{ width: `${project.approval}%` }} className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline/Updates (Semaphore) */}
                    <div className="bg-gov-surface border border-gov-light p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary">traffic</span>
                            Bitácora de Avances
                        </h3>
                        <div className="space-y-8 border-l-2 border-gov-light ml-3 pl-8 relative">
                            {project.updates.map((update: any, i: number) => (
                                <div key={i} className="relative group">
                                    <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-gov-bg border-4 box-content group-hover:scale-125 transition-transform ${update.type === 'green' ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' :
                                        update.type === 'yellow' ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                                            'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                        }`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`text-sm font-bold mb-1 uppercase tracking-wide ${update.type === 'green' ? 'text-emerald-400' :
                                                update.type === 'yellow' ? 'text-amber-400' :
                                                    'text-red-400'
                                                }`}>{update.date}</p>
                                            <p className="text-white text-lg">{update.status}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${update.type === 'green' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            update.type === 'yellow' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {update.type === 'green' ? 'Normal' : update.type === 'yellow' ? 'Alerta' : 'Crítico'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Map Location */}
                    <div className="bg-gov-surface border border-gov-light p-1 rounded-2xl overflow-hidden shadow-lg group relative h-64">
                        <img src={project.map} alt="Ubicación" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-xl pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 right-4 bg-gov-surface/90 backdrop-blur-md p-3 rounded-xl border border-gov-light/30">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gov-danger text-3xl">location_on</span>
                                <div>
                                    <p className="text-xs text-gov-grey font-bold uppercase">Ubicación</p>
                                    <p className="text-white font-bold text-sm">{project.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary">analytics</span>
                            Progreso General
                        </h3>
                        <div className="relative pt-4 pb-2">
                            <div className="flex items-center justify-between text-sm font-bold text-white mb-2">
                                <span>Avance Físico</span>
                                <span className="text-gov-accent">{project.progress}%</span>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gov-bg border border-gov-light">
                                <div style={{ width: `${project.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-gov-primary to-gov-accent stripe-pattern relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gov-grey">Fecha est. finalización: {project.endDate}</p>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl space-y-6">
                        <h3 className="text-white font-bold mb-2">Ficha Técnica</h3>

                        <div className="flex items-start gap-4">
                            <div className="bg-gov-light p-2 rounded-lg text-emerald-400"><span className="material-symbols-outlined">payments</span></div>
                            <div>
                                <p className="text-xs text-gov-grey uppercase tracking-wider mb-1">Presupuesto</p>
                                <p className="text-white font-mono text-lg font-bold">{project.budget}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-gov-light p-2 rounded-lg text-amber-400"><span className="material-symbols-outlined">engineering</span></div>
                            <div>
                                <p className="text-xs text-gov-grey uppercase tracking-wider mb-1">Contratista</p>
                                <p className="text-white text-lg font-medium leading-tight">{project.contractor}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-gov-light p-2 rounded-lg text-blue-400"><span className="material-symbols-outlined">calendar_month</span></div>
                            <div>
                                <p className="text-xs text-gov-grey uppercase tracking-wider mb-1">Inicio de Obra</p>
                                <p className="text-white text-lg font-medium">{project.startDate}</p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-gov-surface border border-gov-light hover:bg-gov-light/30 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <span className="material-symbols-outlined">download</span>
                        Descargar Expediente Técnico
                    </button>
                </div>
            </div>
        </div>
    );
}
