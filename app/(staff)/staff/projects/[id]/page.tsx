"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    budget: number;
    contractor: string;
    start_date: string;
    end_date: string;
    location_text: string;
    latitude: number;
    longitude: number;
    cover_image: string;
}

interface LogEntry {
    id: string;
    entry_date: string;
    status_type: 'green' | 'yellow' | 'red';
    title: string;
    description: string;
    progress_at: number;
    author_name: string;
}

const STATUS_MAP: Record<string, string> = {
    planning: "Planeación",
    in_progress: "En Ejecución",
    paused: "Pausada",
    completed: "Completada",
    cancelled: "Cancelada"
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchProjectData();
        }
    }, [params.id]);

    const fetchProjectData = async () => {
        setLoading(true);
        try {
            // Fetch Project
            const { data: proj, error: projErr } = await supabase
                .from("public_works_projects")
                .select("*")
                .eq("id", params.id)
                .single();

            if (projErr || !proj) throw projErr;
            setProject(proj);

            // Fetch Logs
            const { data: logData } = await supabase
                .from("public_works_log")
                .select("*")
                .eq("project_id", params.id)
                .order("entry_date", { ascending: false });

            setLogs(logData || []);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertPriority, setAlertPriority] = useState<"normal" | "urgent" | "critical">("normal");
    const [isSendingAlert, setIsSendingAlert] = useState(false);

    const handleSendAlert = async () => {
        if (!alertMsg) return;
        setIsSendingAlert(true);
        const { error } = await supabase.from("public_works_alerts").insert({
            project_id: params.id,
            message: alertMsg,
            priority: alertPriority,
            sent_by_name: "Alcalde"
        });

        if (!error) {
            setAlertMsg("");
            setIsAlertModalOpen(false);
            alert("Alerta enviada al supervisor");
        }
        setIsSendingAlert(false);
    };

    const downloadPDF = async () => {
        try {
            const html2pdfModule = await import("html2pdf.js");
            const html2pdf = html2pdfModule.default || html2pdfModule;
            
            const element = document.getElementById("expediente-tecnico");
            if (!element) return;

            const opt = {
                margin:       10,
                filename:     `Expediente_${project?.name.replace(/\s+/g, '_')}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Hacer visible temporalmente para la captura
            element.parentElement!.style.opacity = "1";
            await html2pdf().from(element).set(opt).save();
            element.parentElement!.style.opacity = "0";
        } catch (err) {
            console.error("Error detallado de PDF:", err);
            alert("Error al generar el documento. Intenta de nuevo.");
        }
    };

    if (loading) return <div className="p-10 text-center text-white animate-pulse text-xl">Cargando detalles de obra...</div>;

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white py-20">
                <span className="material-symbols-outlined text-6xl text-gov-grey/30 mb-4">error</span>
                <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
                <Link href="/staff/projects" className="text-gov-primary mt-4 hover:underline">Volver al listado</Link>
            </div>
        );
    }

    const mapSrc = `https://www.google.com/maps?q=${project.latitude},${project.longitude}&output=embed`;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Link href="/staff/projects" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-white">{project.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gov-grey text-sm">ID: #{project.id.slice(0, 8)}</p>
                            <span className="w-1 h-1 rounded-full bg-gov-grey"></span>
                            <p className="text-gov-primary text-sm font-bold flex items-center gap-1">
                                <span className="max-w-[8px] max-h-[8px] min-w-[8px] min-h-[8px] rounded-full bg-gov-primary animate-pulse"></span>
                                Datos Actualizados
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="bg-gov-surface border border-gov-light text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-gov-light/50 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">warning</span>
                        Ver Riesgos
                    </button>
                    <button 
                        onClick={() => setIsAlertModalOpen(true)}
                        className="bg-gov-primary text-gov-bg font-bold px-4 py-2 rounded-xl text-sm shadow-[0_0_15px_rgba(27,218,91,0.3)] hover:brightness-110 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">notification_important</span>
                        Alertar Supervisor
                    </button>
                </div>
            </div>

            {/* Modal de Alerta */}
            {isAlertModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-gov-surface border border-gov-light p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500">campaign</span>
                                Enviar Alerta Directa
                            </h3>
                            <button onClick={() => setIsAlertModalOpen(false)} className="text-gov-grey hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-gov-grey text-sm">Esta alerta llegará de inmediato al panel del departamento de Obras Públicas.</p>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Mensaje</label>
                                <textarea 
                                    className="w-full bg-gov-bg border border-gov-light rounded-xl p-4 text-white focus:border-gov-primary outline-none transition-all"
                                    rows={3}
                                    value={alertMsg}
                                    onChange={(e) => setAlertMsg(e.target.value)}
                                    placeholder="Escribe el motivo de la alerta..."
                                ></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gov-grey uppercase tracking-widest">Prioridad</label>
                                <select 
                                    className="w-full bg-gov-bg border border-gov-light rounded-xl p-3 text-white outline-none"
                                    value={alertPriority}
                                    onChange={(e) => setAlertPriority(e.target.value as any)}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgente</option>
                                    <option value="critical">Crítica</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            disabled={isSendingAlert || !alertMsg}
                            onClick={handleSendAlert}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {isSendingAlert ? "Enviando..." : "Enviar Alerta"}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Avance Visual Principal (Premium) */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl h-96 relative overflow-hidden group shadow-2xl">
                        <img 
                            src="/demo/parque.png" 
                            alt={project.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gov-bg/90 via-transparent to-transparent"></div>

                        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gov-light/30 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full animate-pulse ${project.status === 'completed' ? 'bg-blue-500' : 'bg-gov-primary'}`}></span>
                                <span className="text-xs font-bold text-white uppercase">{STATUS_MAP[project.status]}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-3 h-3 bg-gov-primary rounded-full animate-pulse shadow-[0_0_10px_#1BDA5B]"></span>
                                <p className="text-[10px] font-bold text-gov-primary uppercase tracking-widest">Estado Actual de la Intervención</p>
                            </div>
                            <h3 className="text-4xl font-bold text-white mb-2">Avance Visual</h3>
                            <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
                                Último registro fotográfico de la zona de intervención principal. La obra presenta un cumplimiento del calendario técnico superior al 95%.
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gov-primary">info</span>
                                Descripción Técnica
                            </h3>
                            <p className="text-gov-grey text-sm leading-relaxed">{project.description}</p>
                        </div>

                        {/* Summary Info */}
                        <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-400">monitoring</span>
                                    Eficiencia Presupuestal
                                </h3>
                                <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded-lg border border-blue-500/20">ÓPTIMO</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex-1 text-center border-r border-gov-light/30">
                                    <span className="text-4xl font-bold text-emerald-400 block mb-1">100%</span>
                                    <span className="text-xs text-gov-grey uppercase tracking-wider font-bold">Recurso Asignado</span>
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-2xl font-bold text-gov-primary block mb-1">Activa</span>
                                    <span className="text-xs text-gov-grey uppercase tracking-wider font-bold">Etapa Administrativa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bitácora */}
                    <div className="bg-gov-surface border border-gov-light p-8 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary">traffic</span>
                            Bitácora de Avances
                        </h3>
                        {logs.length === 0 ? (
                            <p className="text-gov-grey text-center py-10">No hay entradas en la bitácora aún.</p>
                        ) : (
                            <div className="space-y-8 border-l-2 border-gov-light ml-3 pl-8 relative">
                                {logs.map((log, i) => (
                                    <div key={log.id} className="relative group">
                                        <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-gov-bg border-4 box-content group-hover:scale-125 transition-transform ${
                                            log.status_type === 'green' ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' :
                                            log.status_type === 'yellow' ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' :
                                            'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                        }`}></div>
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <p className={`text-sm font-bold mb-1 uppercase tracking-wide ${
                                                    log.status_type === 'green' ? 'text-emerald-400' :
                                                    log.status_type === 'yellow' ? 'text-amber-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {new Date(log.entry_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                                <h4 className="text-white text-lg font-bold">{log.title}</h4>
                                                <p className="text-gov-grey text-sm mt-1 mb-3">{log.description}</p>
                                                
                                                {(log as any).photos && (log as any).photos.length > 0 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {(log as any).photos.map((photo: string, idx: number) => (
                                                            <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-gov-light/30 group/img">
                                                                <img 
                                                                    src={photo.includes('supabase.co') ? '/demo/parque.png' : photo} 
                                                                    crossOrigin="anonymous"
                                                                    onError={(e) => (e.currentTarget.src = '/demo/parque.png')}
                                                                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform" 
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-4 flex items-center gap-2 text-[10px] text-gov-grey uppercase tracking-widest font-bold">
                                                    <span className="material-symbols-outlined text-xs">person</span>
                                                    {log.author_name}
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                                                log.status_type === 'green' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                log.status_type === 'yellow' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                                {log.status_type === 'green' ? 'Normal' : log.status_type === 'yellow' ? 'Alerta' : 'Crítico'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Mapa de Ubicación */}
                    <div className="bg-gov-surface border border-gov-light rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px]">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={`https://www.google.com/maps?q=${project?.latitude || 18.2290},${project?.longitude || -94.8730}&z=17&t=k&output=embed`}
                            allowFullScreen
                            className="grayscale-[0.2] contrast-[1.1]"
                        ></iframe>
                        <div className="absolute bottom-6 inset-x-6">
                            <div className="bg-gov-bg/80 backdrop-blur-md border border-gov-light p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                                <div className="p-2 bg-gov-primary/10 rounded-xl text-gov-primary">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <div>
                                    <p className="text-[8px] text-gov-grey uppercase font-black tracking-widest">Ubicación</p>
                                    <p className="text-xs text-white font-medium truncate max-w-[180px]">{project?.location_text}</p>
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
                                <span className="text-gov-primary">{project.progress}%</span>
                            </div>
                            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gov-bg border border-gov-light">
                                <div 
                                    style={{ width: `${project.progress}%` }} 
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gov-primary stripe-pattern relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gov-grey">
                                Entrega estimada: {project.end_date ? new Date(project.end_date).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }) : 'No definida'}
                            </p>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl space-y-6">
                        <h3 className="text-white font-bold mb-2">Ficha Técnica</h3>

                        <div className="flex items-start gap-4">
                            <div className="bg-gov-light p-2 rounded-lg text-emerald-400"><span className="material-symbols-outlined">payments</span></div>
                            <div>
                                <p className="text-xs text-gov-grey uppercase tracking-wider mb-1">Presupuesto</p>
                                <p className="text-white font-mono text-lg font-bold">${(project.budget || 0).toLocaleString()} MXN</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-gov-light p-2 rounded-lg text-amber-400"><span className="material-symbols-outlined">engineering</span></div>
                            <div>
                                <p className="text-xs text-gov-grey uppercase tracking-wider mb-1">Contratista</p>
                                <p className="text-white text-lg font-medium leading-tight">{project.contractor || 'No asignado'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-gov-light p-2 rounded-lg text-blue-400"><span className="material-symbols-outlined">calendar_month</span></div>
                            <div>
                                <p className="text-xs text-gov-grey uppercase tracking-wider mb-1">Periodo</p>
                                <p className="text-white text-sm font-medium">
                                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : '—'} 
                                    <span className="mx-2">al</span> 
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={downloadPDF}
                        className="w-full bg-gov-surface border border-gov-light hover:bg-gov-light/30 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
                    >
                        <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">download</span>
                        Descargar Expediente Técnico
                    </button>
                </div>
            </div>

            {/* PLANTILLA PDF — SIN TAILWIND (100% inline styles para compatibilidad con html2canvas) */}
            <div style={{ opacity: 0, pointerEvents: 'none', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
                <div id="expediente-tecnico" style={{ padding: '40px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'Arial, Helvetica, sans-serif', width: '210mm' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '20px' }}>G</div>
                            <div>
                                <h1 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Governia</h1>
                                <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', color: '#888', textTransform: 'uppercase', margin: 0 }}>Gestión de Infraestructura Municipal</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>EXPEDIENTE TÉCNICO DE OBRA</p>
                            <p style={{ fontSize: '10px', color: '#888', margin: 0 }}>ID PROYECTO: #{project.id.slice(0, 8)}</p>
                        </div>
                    </div>

                    {/* Título y Estatus */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ flex: 2 }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>{project.name}</h2>
                            <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.4' }}>{project.description}</p>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#aaa', textTransform: 'uppercase', marginBottom: '4px' }}>Estatus Actual</p>
                            <p style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>{STATUS_MAP[project.status]}</p>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{project.progress}% de Avance</p>
                        </div>
                    </div>

                    {/* Info Contractual + Ubicación */}
                    <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '11px', fontWeight: 900, borderBottom: '1px solid #e0e0e0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Información Contractual</h3>
                            <table style={{ fontSize: '13px', width: '100%' }}>
                                <tbody>
                                    <tr><td style={{ fontWeight: 'bold', padding: '3px 0' }}>Contratista:</td><td>{project.contractor || 'Asignación Pendiente'}</td></tr>
                                    <tr><td style={{ fontWeight: 'bold', padding: '3px 0' }}>Presupuesto:</td><td>${(project.budget || 0).toLocaleString()} MXN</td></tr>
                                    <tr><td style={{ fontWeight: 'bold', padding: '3px 0' }}>Fecha Inicio:</td><td>{project.start_date || 'N/A'}</td></tr>
                                    <tr><td style={{ fontWeight: 'bold', padding: '3px 0' }}>Fecha Término:</td><td>{project.end_date || 'N/A'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '11px', fontWeight: 900, borderBottom: '1px solid #e0e0e0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Ubicación Geográfica</h3>
                            <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '13px' }}>{project.location_text}</p>
                            <p style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>Coordenadas: {project.latitude}, {project.longitude}</p>
                        </div>
                    </div>

                    {/* Bitácora */}
                    <div style={{ marginBottom: '48px' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: 900, borderBottom: '1px solid #e0e0e0', paddingBottom: '4px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Bitácora de Avances Recientes</h3>
                        <table style={{ width: '100%', textAlign: 'left', fontSize: '12px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f3f3' }}>
                                    <th style={{ padding: '8px', border: '1px solid #e0e0e0' }}>Fecha</th>
                                    <th style={{ padding: '8px', border: '1px solid #e0e0e0' }}>Actividad / Concepto</th>
                                    <th style={{ padding: '8px', border: '1px solid #e0e0e0' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td style={{ padding: '8px', border: '1px solid #e0e0e0' }}>{new Date(log.entry_date).toLocaleDateString()}</td>
                                        <td style={{ padding: '8px', border: '1px solid #e0e0e0' }}>
                                            <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{log.title}</p>
                                            <p style={{ color: '#666', fontSize: '11px', fontStyle: 'italic', margin: 0 }}>{log.description}</p>
                                            {log.photos && log.photos.length > 0 && (
                                                <div style={{ paddingTop: '8px' }}>
                                                    <img 
                                                        src={log.photos[0].includes('supabase.co') ? '/demo/parque.png' : log.photos[0]} 
                                                        alt="Evidencia" 
                                                        style={{ borderRadius: '8px', border: '1px solid #ddd', maxHeight: '150px' }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '8px', border: '1px solid #e0e0e0', textTransform: 'uppercase', fontWeight: 'bold' }}>{log.status_type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Firmas */}
                    <div style={{ display: 'flex', gap: '80px', paddingTop: '40px', textAlign: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Lic. Sosimo Lopez</p>
                                <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', margin: 0 }}>Presidente Municipal</p>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                <p style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Ing. Supervisor de Obra</p>
                                <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', margin: 0 }}>Director de Obras Públicas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
