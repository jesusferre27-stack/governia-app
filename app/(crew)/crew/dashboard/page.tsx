
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";
import IncidentDrawer from "@/components/IncidentDrawer";

interface Department {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface Report {
    id: string;
    folio: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    description: string;
    address: string;
    report_photos: { file_url: string }[];
}

export default function CrewDashboardPage() {
    const [dept, setDept] = useState<Department | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        loadCrewData();
    }, []);

    const loadCrewData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Obtener el departamento asignado a este director
        const { data: deptData } = await supabase
            .from("departments")
            .select("*")
            .eq("manager_id", user.id)
            .single();

        if (deptData) {
            setDept(deptData);

            // 2. Obtener reportes de este departamento
            const { data: reportsData } = await supabase
                .from("reports")
                .select("*, report_photos(file_url)")
                .eq("department_id", deptData.id)
                .order("created_at", { ascending: false });

            if (reportsData) setReports(reportsData as any[]);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gov-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!dept) {
        return (
            <div className="min-h-screen bg-gov-bg flex items-center justify-center p-6">
                <div className="bg-gov-surface border border-gov-light p-10 rounded-3xl text-center max-w-md">
                    <span className="material-symbols-outlined text-gov-grey text-6xl mb-4">error_outline</span>
                    <h1 className="text-white text-2xl font-bold mb-2">Sin Acceso</h1>
                    <p className="text-gov-grey">No tienes un departamento asignado. Contacta al administrador.</p>
                </div>
            </div>
        );
    }

    const stats = {
        pending: reports.filter(r => r.status === "asignado" || r.status === "en_progreso").length,
        solved: reports.filter(r => r.status === "resuelto").length,
        critical: reports.filter(r => r.priority === "alta" || r.priority === "critica").length
    };

    return (
        <div className="min-h-screen bg-gov-bg p-6 lg:p-10 space-y-8">
            
            {/* Header Director */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-gov-light bg-gov-surface shadow-xl">
                        <span className="material-symbols-outlined text-4xl" style={{ color: dept.color }}>
                            {dept.icon}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">{dept.name}</h1>
                        <p className="text-gov-grey font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Panel del Director de Cuadrilla
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
                    className="bg-gov-surface border border-gov-light text-white px-6 py-3 rounded-xl font-bold hover:bg-gov-light transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Cerrar Sesión
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gov-surface border border-gov-light p-8 rounded-3xl">
                    <p className="text-gov-grey text-xs font-bold uppercase tracking-widest mb-2">Por Atender</p>
                    <h2 className="text-4xl font-black text-white">{stats.pending}</h2>
                </div>
                <div className="bg-gov-surface border border-gov-light p-8 rounded-3xl">
                    <p className="text-gov-grey text-xs font-bold uppercase tracking-widest mb-2">Resueltos</p>
                    <h2 className="text-4xl font-black text-emerald-400">{stats.solved}</h2>
                </div>
                <div className="bg-gov-surface border border-gov-light p-8 rounded-3xl border-gov-danger/20">
                    <p className="text-gov-grey text-xs font-bold uppercase tracking-widest mb-2">Críticos</p>
                    <h2 className="text-4xl font-black text-gov-danger">{stats.critical}</h2>
                </div>
            </div>

            {/* Listado de Tareas */}
            <div className="bg-gov-surface border border-gov-light rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-gov-primary">task_alt</span>
                        Órdenes de Trabajo Actuales
                    </h3>
                    <span className="text-gov-grey text-xs font-bold">{reports.length} reportes en total</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports.map((rep) => (
                        <div 
                            key={rep.id}
                            onClick={() => setSelectedReport(rep)}
                            className="bg-gov-bg border border-gov-light p-5 rounded-2xl hover:border-gov-primary transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-gov-primary font-mono text-xs font-bold px-3 py-1 bg-gov-primary/10 rounded-full">
                                    {rep.folio}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    rep.priority === 'critica' ? 'bg-red-500/20 text-red-400' : 'bg-gov-light text-gov-grey'
                                }`}>
                                    {rep.priority.toUpperCase()}
                                </span>
                            </div>
                            <h4 className="text-white font-bold mb-1 group-hover:text-gov-primary transition-colors">{rep.category}</h4>
                            <p className="text-gov-grey text-xs line-clamp-2 mb-4">{rep.description}</p>
                            <div className="flex items-center justify-between text-[10px] text-gov-grey border-t border-gov-light pt-4 mt-auto">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                    {rep.address || "Ver mapa"}
                                </span>
                                <span>{timeAgo(rep.created_at)}</span>
                            </div>
                        </div>
                    ))}
                    {reports.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-gov-light rounded-3xl">
                            <span className="material-symbols-outlined text-4xl text-gov-grey mb-4 block">assignment_late</span>
                            <p className="text-gov-grey">No tienes órdenes de trabajo asignadas por el momento.</p>
                        </div>
                    )}
                </div>
            </div>

            <IncidentDrawer 
                report={selectedReport as any}
                onClose={() => setSelectedReport(null)}
                onRefresh={loadCrewData}
                isDirectorView={true} // Nueva prop para ocultar asignación a otros
            />
        </div>
    );
}
