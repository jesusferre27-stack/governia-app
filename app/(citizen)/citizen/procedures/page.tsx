"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";

// Define the Procedure interface
interface Procedure {
    id: string;
    title: string;
    description: string;
    category: string;
    is_online: boolean;
    estimated_time: string;
    cost: string;
    requirements: string[] | any; // Handle JSONB
}

export default function CitizenProceduresPage() {
    const [activeFilter, setActiveFilter] = useState("Todos");
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const proceduresListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProcedures = async () => {
            const { data, error } = await supabase
                .from('procedures')
                .select('*');


            if (data && data.length > 0) {
                // Force all procedures to be digital as per municipal vision
                const digitalProcedures = data.map(p => ({ ...p, is_online: true }));
                setProcedures(digitalProcedures);
            } else {
                console.warn("Procedures table is empty or could not be reached. Using fallback data.");
                setProcedures([
                    {
                        id: 'demo-1',
                        title: 'Permiso de Construcción',
                        description: 'Solicitud para obras nuevas o ampliaciones estructurales.',
                        category: 'Obras',
                        is_online: true,
                        estimated_time: '5-10 días',
                        cost: 'Variable',
                        requirements: []
                    },
                    {
                        id: 'demo-2',
                        title: 'Pago de Predial',
                        description: 'Pago anual con descuentos por pronto pago.',
                        category: 'Pagos',
                        is_online: true,
                        estimated_time: 'Inmediato',
                        cost: 'Variable',
                        requirements: []
                    },
                    {
                        id: 'demo-3',
                        title: 'Licencia de Funcionamiento',
                        description: 'Apertura de negocios de bajo riesgo.',
                        category: 'Negocios',
                        is_online: true,
                        estimated_time: '5 días',
                        cost: 'Variable',
                        requirements: []
                    }
                ]);
            }

            if (error) {
                console.error("Error fetching procedures:", error);
            }
            setLoading(false);
        };
        fetchProcedures();
    }, []);

    // Helper for icons/colors
    const getMetadata = (category: string) => {
        switch (category) {
            case 'Obras': return { icon: 'construction', color: 'text-amber-400' };
            case 'Pagos': return { icon: 'payments', color: 'text-purple-400' };
            case 'Negocios': return { icon: 'store', color: 'text-emerald-400' };
            case 'Servicios': return { icon: 'cleaning_services', color: 'text-blue-400' };
            default: return { icon: 'description', color: 'text-gov-grey' };
        }
    };

    // Filter Logic
    const filteredProcedures = activeFilter === "Todos"
        ? procedures
        : activeFilter === "En línea"
            ? procedures.filter(p => p.is_online)
            : procedures.filter(p => p.category === activeFilter);

    return (
        <div className="p-4 space-y-6 pb-20 bg-gov-bg min-h-screen animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h2 className="text-xl font-bold text-white">Servicios Digitales</h2>
            </div>

            {/* Illustration Hero */}
            <div className="relative h-32 md:h-40 rounded-3xl overflow-hidden bg-gov-surface border border-gov-light shadow-2xl group">
                <img 
                    src="/procedures_hero.png" 
                    alt="Trámites" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gov-bg via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">Ventanilla Única Digital</h3>
                    <p className="text-gov-grey text-[10px] uppercase font-bold tracking-widest">Servicios Municipales 24/7</p>
                </div>
                <div className="absolute top-4 right-6 bg-gov-primary/20 backdrop-blur-md p-2 rounded-full border border-gov-primary/30">
                    <span className="material-symbols-outlined text-gov-primary text-xl">digital_out_of_home</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gov-surface border border-gov-light p-5 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <span className="material-symbols-outlined text-emerald-400 mb-2 text-3xl">folder</span>
                    <h3 className="text-3xl font-bold text-white">{procedures.length}</h3>
                    <p className="text-xs text-gov-grey font-bold uppercase tracking-wider">Disponibles</p>
                </div>
                <div className="bg-gov-surface border border-gov-light p-5 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <span className="material-symbols-outlined text-amber-400 mb-2 text-3xl">pending</span>
                    <h3 className="text-3xl font-bold text-white">0</h3>
                    <p className="text-xs text-gov-grey font-bold uppercase tracking-wider">Pendientes</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar pl-1">
                {["Todos", "En línea", "Obras", "Pagos", "Negocios", "Servicios"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${activeFilter === filter ? 'bg-gov-primary text-gov-bg border-gov-primary' : 'bg-gov-surface text-gov-grey border-gov-light'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3 pb-safe" ref={proceduresListRef}>
                {loading && <div className="text-center text-gov-grey py-10">Cargando catálogo...</div>}

                {!loading && filteredProcedures.map((proc) => {
                    const { icon, color } = getMetadata(proc.category);
                    return (
                        <Link
                            key={proc.id}
                            href={`/citizen/procedures/${proc.id}`}
                            className="block bg-gov-surface border border-gov-light/60 p-5 rounded-2xl md:items-center justify-between active:scale-[0.98] transition-all group hover:bg-gov-light/5 hover:border-gov-primary/30 relative overflow-hidden"
                        >
                            <div className="flex items-start md:items-center gap-4">
                                <div className={`w-12 h-12 rounded-full bg-gov-bg flex items-center justify-center shrink-0 border border-gov-light group-hover:border-gov-primary/30 transition-colors shadow-inner`}>
                                    <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h4 className="text-white font-bold text-base group-hover:text-gov-primary transition-colors truncate pr-4">{proc.title}</h4>
                                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${proc.is_online ? 'text-gov-primary border-gov-primary/30 bg-gov-primary/10 shadow-[0_0_10px_rgba(27,218,91,0.1)]' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                                            {proc.is_online && <span className="material-symbols-outlined text-[10px]">bolt</span>}
                                            {proc.is_online ? 'Digital • 100% En línea' : 'Presencial'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gov-grey mb-2 line-clamp-2">{proc.description}</p>
                                    <div className="flex gap-2 text-[10px] text-gov-grey/80">
                                        <span className="bg-gov-bg/50 px-2 py-1 rounded border border-gov-light/20">⏱ {proc.estimated_time}</span>
                                        <span className="bg-gov-bg/50 px-2 py-1 rounded border border-gov-light/20">💰 {proc.cost}</span>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <span className="material-symbols-outlined text-gov-primary">arrow_forward</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
