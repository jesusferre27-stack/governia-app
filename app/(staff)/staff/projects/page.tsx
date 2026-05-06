"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    planning:    { label: "Planeación",  color: "text-amber-400",   bg: "bg-amber-400 text-gov-bg" },
    in_progress: { label: "En Ejecución",color: "text-gov-primary", bg: "bg-gov-primary text-gov-bg" },
    paused:      { label: "Pausada",     color: "text-orange-400",  bg: "bg-orange-400 text-gov-bg" },
    completed:   { label: "Completada",  color: "text-blue-400",    bg: "bg-blue-500 text-white" },
    cancelled:   { label: "Cancelada",   color: "text-red-400",     bg: "bg-red-500 text-white" },
};

interface Project {
    id: string;
    name: string;
    status: string;
    progress: number;
    contractor: string | null;
    budget: number | null;
    end_date: string | null;
    location_text: string | null;
    cover_image: string | null;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("public_works_projects")
            .select("id, name, status, progress, contractor, budget, end_date, location_text, cover_image")
            .order("created_at", { ascending: false });
        if (data) setProjects(data);
        setLoading(false);
    };

    const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        
        const { error } = await supabase.from("public_works_projects").insert({
            name: formData.get("name"),
            description: formData.get("description"),
            budget: Number(formData.get("budget")),
            location_text: formData.get("location_text"),
            latitude: Number(formData.get("latitude")),
            longitude: Number(formData.get("longitude")),
            status: 'planning',
            progress: 0
        });

        if (!error) {
            setIsModalOpen(false);
            fetchProjects();
        } else {
            alert("Error al crear proyecto: " + error.message);
        }
        setIsSaving(false);
    };

    const counts = {
        total: projects.length,
        active: projects.filter(p => p.status === "in_progress").length,
        completed: projects.filter(p => p.status === "completed").length,
        budget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Obras Públicas</h2>
                    <p className="text-gov-grey">Monitoreo y avance de infraestructura municipal.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchProjects} className="flex items-center gap-2 text-xs text-gov-grey hover:text-white border border-gov-light px-3 py-2 rounded-xl hover:border-gov-primary transition-all">
                        <span className="material-symbols-outlined text-base">refresh</span>
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-gov-primary text-gov-bg font-bold px-4 py-2 rounded-xl text-sm shadow-[0_0_15px_rgba(27,218,91,0.3)] hover:brightness-110 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">add</span>
                        Nueva Obra
                    </button>
                    <Link href="/staff/obras">
                        <button className="bg-gov-surface border border-gov-light text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-gov-light/50 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">construction</span>
                            Panel Operativo
                        </button>
                    </Link>
                </div>
            </div>

            {/* Modal Nueva Obra */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gov-surface border border-gov-light p-8 rounded-2xl max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="material-symbols-outlined text-gov-primary">engineering</span>
                                Registrar Nueva Obra
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gov-grey hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Nombre del Proyecto</label>
                                <input name="name" required className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-all" placeholder="Ej. Reencarpetado Av. Juárez" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Descripción</label>
                                <textarea name="description" rows={3} className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-all" placeholder="Describe el alcance de la obra..."></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Presupuesto (MXN)</label>
                                <input name="budget" type="number" required className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-all" placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Ubicación (Texto)</label>
                                <input name="location_text" required className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-all" placeholder="Ej. Centro Histórico" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Latitud</label>
                                <input name="latitude" type="number" step="any" className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-all" placeholder="18.2290" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Longitud</label>
                                <input name="longitude" type="number" step="any" className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white focus:border-gov-primary outline-none transition-all" placeholder="-94.8730" />
                            </div>
                            
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" disabled={isSaving} className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(27,218,91,0.2)] disabled:opacity-50">
                                    {isSaving ? "Guardando..." : "Crear Proyecto de Obra"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Proyectos", val: counts.total,     icon: "engineering",  color: "text-gov-primary" },
                    { label: "En Ejecución",    val: counts.active,    icon: "construction", color: "text-amber-400" },
                    { label: "Completadas",     val: counts.completed, icon: "check_circle", color: "text-blue-400" },
                    { label: "Presupuesto Total", val: `$${(counts.budget/1000000).toFixed(1)}M`, icon: "payments", color: "text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-5 rounded-2xl">
                        <span className={`material-symbols-outlined text-2xl mb-2 block ${stat.color}`}>{stat.icon}</span>
                        <p className="text-gov-grey text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white">{loading ? "..." : stat.val}</h3>
                    </div>
                ))}
            </div>

            {/* Grid de proyectos */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-48 bg-gov-light/20" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-gov-light/20 rounded w-3/4" />
                                <div className="h-3 bg-gov-light/20 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-gov-surface border border-gov-light rounded-2xl">
                    <span className="material-symbols-outlined text-6xl text-gov-grey/30 mb-4 block">engineering</span>
                    <h3 className="text-white font-bold text-xl mb-2">No hay proyectos registrados</h3>
                    <p className="text-gov-grey text-sm">Ejecuta la migración SQL para inicializar el módulo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => {
                        const status = STATUS_CONFIG[proj.status] || STATUS_CONFIG.planning;
                        const progressColor = proj.progress >= 75 ? "bg-emerald-500" : proj.progress >= 40 ? "bg-amber-400" : "bg-blue-400";
                        return (
                            <Link href={`/staff/projects/${proj.id}`} key={proj.id}>
                                <div className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden group cursor-pointer hover:border-gov-primary/50 transition-all hover:shadow-[0_0_20px_rgba(27,218,91,0.1)]">
                                    <div
                                        className="h-48 bg-cover bg-center relative overflow-hidden"
                                        style={{ backgroundImage: proj.cover_image ? `url(${proj.cover_image})` : "linear-gradient(135deg, #1e293b, #0f172a)" }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-gov-surface to-transparent" />
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gov-primary transition-colors line-clamp-1">
                                                {proj.name}
                                            </h3>
                                            {proj.contractor && (
                                                <p className="text-sm text-gray-300 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">business</span>
                                                    {proj.contractor}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between text-sm text-gov-grey mb-2">
                                            <span>Progreso</span>
                                            <span className="font-bold text-white">{proj.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gov-bg rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${progressColor}`} style={{ width: `${proj.progress}%` }} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-gov-light/30">
                                            <div>
                                                <p className="text-xs text-gov-grey">Finalización Est.</p>
                                                <p className="text-sm font-bold text-white">
                                                    {proj.end_date ? new Date(proj.end_date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gov-grey">Presupuesto</p>
                                                <p className="text-sm font-bold text-white">
                                                    {proj.budget ? `$${(proj.budget/1000000).toFixed(1)}M` : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
