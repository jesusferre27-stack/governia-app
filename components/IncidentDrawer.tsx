
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo, formatDate } from "@/lib/date";

interface Department {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface Photo {
    file_url: string;
    is_resolution: boolean;
}

interface Report {
    id: string;
    folio: string;
    category: string;
    description: string;
    address: string | null;
    status: string;
    priority: string;
    created_at: string;
    latitude?: number;
    longitude?: number;
    department_id?: string;
    departments: Department | null;
    report_photos: Photo[];
    resolution_notes?: string;
}

interface Props {
    report: Report | null;
    onClose: () => void;
    onRefresh: () => void;
    isDirectorView?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    nuevo:       { label: "Nuevo",      bg: "bg-blue-500/10",    text: "text-blue-400"    },
    asignado:    { label: "Asignado",   bg: "bg-purple-500/10",  text: "text-purple-400"  },
    en_progreso: { label: "En Proceso", bg: "bg-amber-500/10",   text: "text-amber-400"   },
    resuelto:    { label: "Resuelto",   bg: "bg-emerald-500/10", text: "text-emerald-400" },
    rechazado:   { label: "Rechazado",  bg: "bg-red-500/10",     text: "text-red-400"     },
};

export default function IncidentDrawer({ report, onClose, onRefresh, isDirectorView = false }: Props) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [loading, setLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [resNotes, setResNotes] = useState("");
    const [resFiles, setResFiles] = useState<File[]>([]);
    const [resPreviews, setResPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (report) {
            fetchDepartments();
            setSelectedDept(report.department_id || "");
            setResNotes(report.resolution_notes || "");
            setResFiles([]);
            setResPreviews([]);
            setIsClosing(false);
        }
    }, [report]);

    const fetchDepartments = async () => {
        const { data } = await supabase.from("departments").select("*").eq("active", true).order("sort_order");
        if (data) setDepartments(data);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setResFiles(prev => [...prev, ...files]);
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setResPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!report) return;
        setLoading(true);

        try {
            // 1. Subir fotos de resolución si hay
            const photoUrls: string[] = [];
            for (const file of resFiles) {
                const fileName = `${report.id}/res_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                const { data, error } = await supabase.storage
                    .from("report-photos")
                    .upload(fileName, file);
                
                if (data) {
                    const { data: { publicUrl } } = supabase.storage.from("report-photos").getPublicUrl(fileName);
                    photoUrls.push(publicUrl);
                }
            }

            // 2. Insertar registros de fotos en la tabla
            if (photoUrls.length > 0) {
                await supabase.from("report_photos").insert(
                    photoUrls.map(url => ({
                        report_id: report.id,
                        file_url: url,
                        file_path: "legacy",
                        is_resolution: true
                    }))
                );
            }

            // 3. Actualizar reporte
            const { error } = await supabase
                .from("reports")
                .update({ 
                    status: newStatus,
                    resolution_notes: resNotes,
                    ...(newStatus === "resuelto" ? { resolved_at: new Date().toISOString() } : {})
                })
                .eq("id", report.id);

            if (!error) {
                onRefresh();
                handleClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    if (!report) return null;

    const statusCfg = STATUS_CONFIG[report.status] || STATUS_CONFIG["nuevo"];
    const complaintPhotos = report.report_photos?.filter(p => !p.is_resolution) || [];
    const resolutionPhotos = report.report_photos?.filter(p => p.is_resolution) || [];

    return (
        <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            <div className={`relative w-full max-w-lg bg-gov-bg border-l border-gov-light shadow-2xl h-full flex flex-col transition-transform duration-300 transform ${isClosing ? "translate-x-full" : "translate-x-0"}`}>
                
                <div className="p-6 border-b border-gov-light flex items-center justify-between bg-gov-surface/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-gov-primary font-mono font-black text-lg">{report.folio}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text}`}>
                                {statusCfg.label}
                            </span>
                        </div>
                        <p className="text-gov-grey text-xs">Reportado el {formatDate(report.created_at)}</p>
                    </div>
                    <button onClick={handleClose} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-gov-grey">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    
                    {/* Fotos de Reporte */}
                    {complaintPhotos.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gov-grey uppercase tracking-widest">Evidencia Inicial</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {complaintPhotos.map((photo, i) => (
                                    <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-gov-light">
                                        <img src={photo.file_url} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">{report.category}</h3>
                        <p className="text-slate-300 text-sm">{report.description}</p>
                        
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-gov-primary mb-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                <span className="text-xs font-bold">Ubicación</span>
                            </div>
                            <p className="text-white text-xs">{report.address}</p>
                        </div>
                    </div>

                    {/* Fotos de Resolución (si ya existen) */}
                    {resolutionPhotos.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Evidencia de Solución
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {resolutionPhotos.map((photo, i) => (
                                    <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-emerald-500/30">
                                        <img src={photo.file_url} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            {report.resolution_notes && (
                                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl text-sm text-emerald-100 italic">
                                    "{report.resolution_notes}"
                                </div>
                            )}
                        </div>
                    )}

                    {/* Área de Resolución para el Director */}
                    {report.status !== 'resuelto' && report.status !== 'rechazado' && (
                        <div className="pt-8 border-t border-gov-light/30 space-y-6">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Registrar Solución</h4>
                            
                            {/* Subida de Fotos */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gov-grey uppercase">Fotos de la Solución</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {resPreviews.map((url, i) => (
                                        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gov-light">
                                            <img src={url} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-xl border-2 border-dashed border-gov-light flex flex-col items-center justify-center cursor-pointer hover:border-gov-primary hover:bg-gov-primary/5 transition-all">
                                        <span className="material-symbols-outlined text-gov-grey">add_a_photo</span>
                                        <span className="text-[10px] text-gov-grey mt-1">Añadir</span>
                                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Notas */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gov-grey uppercase">Notas de Resolución</label>
                                <textarea 
                                    value={resNotes}
                                    onChange={(e) => setResNotes(e.target.value)}
                                    placeholder="Explica brevemente qué se hizo..."
                                    className="w-full bg-gov-surface border border-gov-light rounded-xl p-4 text-white text-sm outline-none focus:border-gov-primary h-24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleUpdateStatus('en_progreso')}
                                    className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-amber-500/30 text-amber-500 font-bold hover:bg-amber-500/10 transition-all text-xs"
                                >
                                    Guardar Progreso
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus('resuelto')}
                                    disabled={loading || (resFiles.length === 0 && !report.resolution_notes)}
                                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-gov-primary text-gov-bg font-black hover:bg-emerald-400 transition-all text-xs disabled:opacity-50"
                                >
                                    {loading ? "Subiendo..." : "MARCAR RESUELTO"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
