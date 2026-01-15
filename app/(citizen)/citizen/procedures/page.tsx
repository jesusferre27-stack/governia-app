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
            // In a real multi-tenant app, filter by municipality_id
            const { data, error } = await supabase
                .from('procedures')
                .select('*')
                .eq('is_active', true); // User request says 'is_active', but let's double check if we can just remove the filter to debug or trust them.
            // Assuming user is right about the DB column name despite my file.
            // Wait, looking at the screenshot error: `failed to load... &active=eq.true`. Server responded 400.
            // This message "failed to load resource... active=eq.true ... status of 400" CONFIRMS that 'active' is the WRONG column name if the server rejects it.
            // So the column MUST be something else, likely 'is_active' as user says.
            // Or maybe I just remove the filter entirely to be safe?
            // User instruction: "Corrige... para usar is_active = true".

            // Correction: The SQL file I wrote had `active`. But maybe it didn't run, or user ran a different one?
            // I will follow instruction: use `is_active`.

            // wait, if I put `is_active` and the column is `active`, it will also fail.
            // But the current 400 proves `active` is invalid.
            // So I will change to `is_active` as requested.
            // Actually, I'll allow both or checking schema? No, just switch.

            // Wait, simply removing the filter for a moment might be safer to verify data loads?
            // But user asked to "Corrige... para usar is_active". I will do exactly that.


            if (data) {
                setProcedures(data);
            }

            if (error) {
                console.error("Error fetching procedures:", error);
                // Optional: set an error state to show on UI
            }
            setLoading(false);
        };
        fetchProcedures();
    }, []);

    // Helper for icons/colors
    const getMetadata = (category: string, isOnline: boolean) => {
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

    // Pending items logic would go here (fetch from procedure_requests)

    return (
        <div className="p-4 space-y-6 pb-20 bg-gov-bg min-h-screen animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h2 className="text-xl font-bold text-white">Servicios Digitales</h2>
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
                    const { icon, color } = getMetadata(proc.category, proc.is_online);
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
                                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md border ${proc.is_online ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-amber-400 border-amber-400/30 bg-amber-400/10'}`}>
                                            {proc.is_online ? '100% En línea' : 'Presencial'}
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
