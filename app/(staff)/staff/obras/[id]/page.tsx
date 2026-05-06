"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/supabase";

interface Project {
    id: string;
    name: string;
    status: string;
    progress: number;
    budget: number;
    contractor: string;
}

interface Alert {
    id: string;
    message: string;
    priority: string;
    created_at: string;
    read_at: string | null;
}

export default function ProjectManagementPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form states (PRE-CARGADOS PARA DEMO)
    const [logTitle, setLogTitle] = useState("Finalización de pavimentación y detallado de guarniciones");
    const [logDesc, setLogDesc] = useState("Se ha completado el vertido de concreto hidráulico en la sección sur. Se procedió con el curado y el detallado de guarniciones. La obra presenta un avance significativo conforme al calendario técnico. No se reportan incidentes.");
    const [logStatus, setLogStatus] = useState<"green" | "yellow" | "red">("green");
    const [logFile, setLogFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // IA state
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        if (params.id) fetchData();
    }, [params.id]);

    const fetchData = async () => {
        setLoading(true);
        const { data: proj } = await supabase.from("public_works_projects").select("*").eq("id", params.id).single();
        const { data: alts } = await supabase.from("public_works_alerts").select("*").eq("project_id", params.id).order("created_at", { ascending: false });
        
        if (proj) setProject(proj);
        if (alts) setAlerts(alts);
        setLoading(false);
    };

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logTitle || !logDesc) return;

        setIsSaving(true);
        let photoPath = null;

        if (logFile) {
            const fileExt = logFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('obras-publicas')
                .upload(`logs/${fileName}`, logFile);
            
            if (uploadData) {
                const { data: { publicUrl } } = supabase.storage.from('obras-publicas').getPublicUrl(uploadData.path);
                photoPath = publicUrl;
            }
        } else {
            // USAR FOTO DE DEMO POR DEFECTO SI NO HAY ARCHIVO
            photoPath = "/demo/parque.png";
        }

        const { error } = await supabase.from("public_works_log").insert({
            project_id: params.id,
            title: logTitle,
            description: logDesc,
            status_type: logStatus,
            progress_at: project?.progress,
            author_name: "Supervisor de Obra",
            photos: photoPath ? [photoPath] : []
        });

        if (!error) {
            setLogTitle("");
            setLogDesc("");
            setLogFile(null);
            alert("Reporte con evidencia publicado");
            fetchData();
        }
        setIsSaving(false);
    };

    const handleExtractContract = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/obras/extract-contract", {
                method: "POST",
                body: formData
            });
            const result = await res.json();
            
            if (result.success) {
                const data = result.data;
                // Pre-llenar o actualizar proyecto con datos de IA
                const { error } = await supabase.from("public_works_projects").update({
                    contractor: data.contractor_name,
                    budget: data.contract_amount,
                    contract_number: data.contract_number,
                    description: data.object_description
                }).eq("id", params.id);
                
                if (!error) {
                    alert("Datos extraídos y actualizados con éxito vía IA");
                    fetchData();
                }
            }
        } catch (error) {
            console.error("Error extracting contract:", error);
        } finally {
            setIsExtracting(false);
        }
    };

    const markAsRead = async (alertId: string) => {
        await supabase.from("public_works_alerts").update({ read_at: new Date().toISOString() }).eq("id", alertId);
        fetchData();
    };

    if (loading) return <div className="p-10 text-white">Cargando gestión...</div>;
    if (!project) return <div className="p-10 text-white">No se encontró el proyecto.</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-gov-grey text-sm">
                <Link href="/staff/obras" className="hover:text-white transition-colors">Gestión Obras</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-white font-bold">{project.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Herramientas de Supervisión */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Reporte Form */}
                    <div className="bg-gov-surface border border-gov-light p-8 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-gov-primary text-3xl">add_task</span>
                            <h3 className="text-xl font-bold text-white">Registrar Reporte de Avance</h3>
                        </div>
                        
                        <form onSubmit={handleAddLog} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Título del Evento</label>
                                    <input 
                                        type="text" 
                                        value={logTitle}
                                        onChange={(e) => setLogTitle(e.target.value)}
                                        placeholder="Ej. Colado de losa completado"
                                        className="w-full bg-gov-bg border border-gov-light rounded-xl py-3 px-4 text-white focus:border-gov-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Estatus Semáforo</label>
                                    <div className="flex gap-2 p-1 bg-gov-bg border border-gov-light rounded-xl">
                                        {[
                                            { id: 'green', color: 'bg-emerald-500', label: 'Normal' },
                                            { id: 'yellow', color: 'bg-amber-500', label: 'Alerta' },
                                            { id: 'red', color: 'bg-red-500', label: 'Crítico' }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setLogStatus(opt.id as any)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                                                    logStatus === opt.id ? `${opt.color} text-gov-bg` : 'text-gov-grey hover:text-white'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${logStatus === opt.id ? 'bg-gov-bg' : opt.color}`}></span>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Evidencia Fotográfica</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="w-full bg-gov-bg border border-gov-light rounded-xl py-2 px-4 text-xs text-gov-grey"
                                        onChange={(e) => setLogFile(e.target.files?.[0] || null)}
                                    />
                                </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Descripción Técnica</label>
                                <textarea 
                                    rows={3}
                                    value={logDesc}
                                    onChange={(e) => setLogDesc(e.target.value)}
                                    placeholder="Describe detalladamente los trabajos realizados, incidencias o acuerdos..."
                                    className="w-full bg-gov-bg border border-gov-light rounded-xl py-3 px-4 text-white focus:border-gov-primary outline-none transition-all"
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button 
                                    disabled={isSaving}
                                    className="bg-gov-primary text-gov-bg font-bold px-8 py-3 rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(27,218,91,0.3)] disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">{isSaving ? 'sync' : 'save'}</span>
                                    {isSaving ? 'Publicando...' : 'Publicar Reporte'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* IA Contract extraction */}
                    <div className="bg-gov-surface border-2 border-dashed border-gov-light p-8 rounded-2xl group hover:border-gov-primary/50 transition-all text-center">
                        <div className={`w-16 h-16 rounded-full bg-gov-light mx-auto mb-4 flex items-center justify-center ${isExtracting ? 'animate-spin' : ''}`}>
                            <span className="material-symbols-outlined text-gov-primary text-3xl">auto_awesome</span>
                        </div>
                        <h4 className="text-white font-bold text-lg mb-1">Cargar Contrato vía IA</h4>
                        <p className="text-gov-grey text-sm mb-6 max-w-sm mx-auto">Sube una foto o PDF del contrato y Gemini extraerá automáticamente los montos, fechas y contratistas.</p>
                        
                        <input 
                            type="file" 
                            id="contract-ia" 
                            className="hidden" 
                            accept="image/*,application/pdf"
                            onChange={handleExtractContract}
                            disabled={isExtracting}
                        />
                        <label 
                            htmlFor="contract-ia" 
                            className="inline-flex items-center gap-2 bg-gov-light text-white font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-gov-primary hover:text-gov-bg transition-all"
                        >
                            <span className="material-symbols-outlined">upload_file</span>
                            {isExtracting ? 'Procesando con IA...' : 'Seleccionar Archivo'}
                        </label>
                    </div>
                </div>

                {/* Sidebar Operativo */}
                <div className="space-y-6">
                    {/* Alertas del Alcalde */}
                    <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500">campaign</span>
                                Alertas del Alcalde
                            </h3>
                            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded-lg border border-amber-500/20 uppercase tracking-tighter">
                                {alerts.filter(a => !a.read_at).length} Nuevas
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {alerts.length === 0 ? (
                                <p className="text-gov-grey text-center text-xs py-10">No hay alertas activas.</p>
                            ) : (
                                alerts.map((alert) => (
                                    <div key={alert.id} className={`p-4 rounded-xl border transition-all ${
                                        alert.read_at ? 'bg-gov-bg/50 border-gov-light/30' : 'bg-gov-light/20 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                                    }`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold uppercase ${
                                                alert.priority === 'urgent' ? 'text-red-400' : 'text-amber-400'
                                            }`}>
                                                {alert.priority === 'urgent' ? '¡URGENTE!' : 'NORMAL'}
                                            </span>
                                            <span className="text-[10px] text-gov-grey">{new Date(alert.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className={`text-sm mb-3 ${alert.read_at ? 'text-gov-grey' : 'text-white'}`}>{alert.message}</p>
                                        {!alert.read_at && (
                                            <button 
                                                onClick={() => markAsRead(alert.id)}
                                                className="w-full py-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-bold hover:bg-amber-500 hover:text-gov-bg transition-all"
                                            >
                                                MARCAR COMO ATENDIDA
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stats de Gestión */}
                    <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4">Métricas de Obra</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gov-grey">Avance Reportado</span>
                                <span className="text-white font-bold">{project.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gov-bg rounded-full overflow-hidden">
                                <div className="h-full bg-gov-primary" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-gov-light/30">
                                <div>
                                    <p className="text-[10px] text-gov-grey uppercase font-bold mb-1">Presupuesto</p>
                                    <p className="text-white font-bold text-xs">${(project.budget/1000).toFixed(0)}k</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gov-grey uppercase font-bold mb-1">Días en Obra</p>
                                    <p className="text-white font-bold text-xs">45 días</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
