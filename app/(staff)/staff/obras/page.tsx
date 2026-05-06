"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";

interface Project {
    id: string;
    name: string;
    status: string;
    progress: number;
    budget: number;
    contractor: string;
    location_text: string;
    cover_image: string;
    latitude?: number;
    longitude?: number;
}

export default function ObrasDeptPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("public_works_projects")
            .select("*")
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

    const stats = {
        total: projects.length,
        in_progress: projects.filter(p => p.status === 'in_progress').length,
        pending_reports: projects.filter(p => p.progress < 100).length, // Placeholder logic
        budget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Panel Operativo de Obras</h2>
                    <p className="text-gov-grey">Gestión técnica y supervisión de infraestructura municipal.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchProjects} className="p-2 text-gov-grey hover:text-white border border-gov-light rounded-xl transition-all">
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gov-primary text-gov-bg font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(27,218,91,0.3)] hover:brightness-110 transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Nueva Obra
                    </button>
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

                        {/* IA FAST FILL */}
                        <div className="bg-gov-light/20 border border-dashed border-gov-primary/30 p-4 rounded-xl flex items-center justify-between group hover:border-gov-primary transition-all">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gov-primary/10 text-gov-primary ${isExtracting ? 'animate-spin' : ''}`}>
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">¿Tienes el contrato?</p>
                                    <p className="text-[10px] text-gov-grey uppercase tracking-widest">Deja que la IA rellene los campos por ti</p>
                                </div>
                            </div>
                            <input 
                                type="file" 
                                id="contract-ia-modal" 
                                className="hidden" 
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setIsExtracting(true);
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    try {
                                        const res = await fetch("/api/obras/extract-contract", { method: "POST", body: formData });
                                        const result = await res.json();
                                        if (result.success) {
                                            const data = result.data;
                                            const form = document.querySelector('form');
                                            if (form) {
                                                (form.elements.namedItem('name') as HTMLInputElement).value = data.object_description || "";
                                                (form.elements.namedItem('description') as HTMLTextAreaElement).value = `Contrato: ${data.contract_number}\nContratista: ${data.contractor_name}\nObjeto: ${data.object_description}`;
                                                (form.elements.namedItem('budget') as HTMLInputElement).value = data.contract_amount || "";
                                            }
                                        }
                                    } catch (err) { console.error(err); }
                                    finally { setIsExtracting(false); }
                                }}
                            />
                            <label htmlFor="contract-ia-modal" className="bg-gov-primary text-gov-bg font-bold px-4 py-2 rounded-lg text-xs cursor-pointer hover:brightness-110 transition-all">
                                {isExtracting ? "PROCESANDO..." : "CARGAR CON IA"}
                            </label>
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

            {/* KPIs Operativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Obras Asignadas", val: stats.total, icon: "assignment", color: "text-blue-400" },
                    { label: "En Ejecución", val: stats.in_progress, icon: "construction", color: "text-amber-400" },
                    { label: "Reportes Pendientes", val: stats.pending_reports, icon: "pending_actions", color: "text-orange-400" },
                    { label: "Monto Gestionado", val: `$${(stats.budget/1000000).toFixed(1)}M`, icon: "account_balance", color: "text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute -right-2 -top-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className={`material-symbols-outlined text-6xl ${stat.color}`}>{stat.icon}</span>
                        </div>
                        <p className="text-gov-grey text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white">{loading ? "..." : stat.val}</h3>
                    </div>
                ))}
            </div>

            {/* Mapa de Monitoreo Estratégico (Premium) */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden shadow-2xl group relative h-[350px]">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <div className="bg-gov-bg/80 backdrop-blur-md border border-gov-light px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                        <span className="w-3 h-3 bg-gov-primary rounded-full animate-pulse"></span>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Monitoreo Satelital en Vivo</p>
                    </div>
                </div>
                
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gov-bg/80 backdrop-blur-md border border-gov-light p-3 rounded-xl flex flex-col items-center gap-1 shadow-lg">
                        <p className="text-[8px] text-gov-grey uppercase font-black">Escala</p>
                        <p className="text-xs text-white font-bold">1:5000</p>
                    </div>
                </div>

                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps?q=${projects[0]?.latitude || 18.2290},${projects[0]?.longitude || -94.8730}&z=16&t=k&output=embed`}
                    allowFullScreen
                    className="opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                ></iframe>
                
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gov-surface to-transparent pointer-events-none"></div>
            </div>

            {/* Lista de Gestión */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gov-light flex justify-between items-center bg-gov-light/10">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-gov-primary">list</span>
                        Inventario de Obras
                    </h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gov-grey text-sm">search</span>
                            <input 
                                type="text" 
                                placeholder="Buscar obra..." 
                                className="bg-gov-bg border border-gov-light rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:border-gov-primary outline-none w-64"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gov-grey text-[10px] uppercase tracking-widest border-b border-gov-light/30">
                                <th className="px-6 py-4 font-bold">Obra / Ubicación</th>
                                <th className="px-6 py-4 font-bold">Estatus</th>
                                <th className="px-6 py-4 font-bold">Avance</th>
                                <th className="px-6 py-4 font-bold">Presupuesto</th>
                                <th className="px-6 py-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gov-light/20">
                            {projects.map((proj) => (
                                <tr key={proj.id} className="hover:bg-gov-light/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gov-bg border border-gov-light overflow-hidden flex-shrink-0">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    style={{ border: 0, filter: 'grayscale(1) invert(1) contrast(1.2)' }}
                                                    src={`https://www.google.com/maps?q=${proj.latitude || 18.2290},${proj.longitude || -94.8730}&z=15&output=embed`}
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm group-hover:text-gov-primary transition-colors">{proj.name}</p>
                                                <p className="text-gov-grey text-[10px] flex items-center gap-1 uppercase tracking-tighter">
                                                    <span className="material-symbols-outlined text-[10px]">location_on</span>
                                                    {proj.location_text}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                                            proj.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            proj.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-gov-grey/10 text-gov-grey border-gov-grey/20'
                                        }`}>
                                            {proj.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gov-bg rounded-full overflow-hidden min-w-[60px]">
                                                <div className="h-full bg-gov-primary rounded-full" style={{ width: `${proj.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-white">{proj.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-mono text-white">${(proj.budget || 0).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/staff/obras/${proj.id}`}>
                                                <button title="Gestionar Avances" className="p-2 bg-gov-bg border border-gov-light rounded-lg text-gov-grey hover:text-gov-primary hover:border-gov-primary transition-all">
                                                    <span className="material-symbols-outlined text-sm">edit_note</span>
                                                </button>
                                            </Link>
                                            <button title="Ver Detalles" className="p-2 bg-gov-bg border border-gov-light rounded-lg text-gov-grey hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {projects.length === 0 && !loading && (
                        <div className="py-20 text-center text-gov-grey">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-20">construction</span>
                            <p>No tienes obras asignadas para gestión técnica.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
