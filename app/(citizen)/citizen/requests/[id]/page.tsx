"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

const STATUS_LABELS: Record<string, string> = {
    draft: "Borrador", pending: "Pendiente", in_progress: "En Proceso",
    completed: "Aprobado", rejected: "Rechazado", correction: "Requiere Corrección",
};

const STATUS_COLORS: Record<string, string> = {
    draft: "text-gov-grey", pending: "text-amber-400", in_progress: "text-blue-400",
    completed: "text-emerald-400", rejected: "text-red-400", correction: "text-amber-500",
};

interface RequestDetail {
    id: string; folio: string; status: string; created_at: string;
    full_name: string; phone: string; email: string; address: string;
    cadastral_key: string | null;
    notes: string; staff_notes: string | null; reviewed_at: string | null;
    municipality_name: string;
    procedures: { title: string; category: string; cost: string; estimated_time: string; requirements: any } | null;
    procedure_documents: { id: string; file_name: string; file_path: string; document_type: string }[];
}

export default function CitizenRequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchRequest = async () => {
        const { data, error } = await supabase
            .from("procedure_requests")
            .select(`id, folio, status, created_at, full_name, phone, email, address, cadastral_key, notes,
                staff_notes, reviewed_at, municipality_name,
                procedures (title, category, cost, estimated_time, requirements),
                procedure_documents (id, file_name, file_path, document_type)`)
            .eq("id", params.id)
            .single();
        if (!error && data) setRequest(data as any);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequest();
    }, [params.id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !request) return;
        setUploading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session?.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("procedure-documents")
            .upload(filePath, file);

        if (uploadError) { alert("Error al subir: " + uploadError.message); setUploading(false); return; }

        await supabase.from("procedure_documents").insert({
            request_id: request.id,
            file_name: file.name,
            file_path: filePath,
            document_type: "Correction",
        });

        await fetchRequest();
        setUploading(false);
    };

    const handleSubmitCorrections = async () => {
        if (!request) return;
        setSubmitting(true);
        const { error } = await supabase
            .from("procedure_requests")
            .update({ status: "pending", staff_notes: "Correcciones enviadas por el ciudadano." })
            .eq("id", request.id);

        if (error) { alert("Error: " + error.message); }
        else { await fetchRequest(); }
        setSubmitting(false);
    };

    const generatePDF = async () => {
        if (!request) return;
        setGeneratingPdf(true);
        const proc = request.procedures;
        const now = new Date();
        const dateStr = now.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
        const html2pdf = (await import("html2pdf.js" as any)).default;

        const el = document.createElement("div");
        el.innerHTML = `
            <div style="font-family: 'Arial', sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #1a1a1a;">
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom: 3px solid #1BDA5B; padding-bottom: 20px; margin-bottom: 24px;">
                    <div style="display:flex; align-items:center; gap: 16px;">
                        <div style="width:80px; height:80px; border: 2px dashed #ccc; border-radius: 8px; display:flex; align-items:center; justify-content:center; flex-direction:column; color:#999; font-size:10px; text-align:center; padding:4px;">
                            LOGO<br/>MUNICIPAL
                        </div>
                        <div>
                            <p style="font-size:10px; color:#666; text-transform:uppercase; letter-spacing:2px; margin:0;">Gobierno Municipal de</p>
                            <h1 style="font-size:20px; font-weight:bold; margin:4px 0;">${request.municipality_name || "Soteapan"}</h1>
                            <p style="font-size:11px; color:#666; margin:0;">Dirección de Servicios al Ciudadano</p>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <p style="font-size:10px; color:#666; margin:0;">Folio:</p>
                        <p style="font-size:22px; font-weight:bold; color:#1BDA5B; font-family:monospace; margin:4px 0;">${request.folio}</p>
                        <p style="font-size:10px; color:#666; margin:0;">Fecha: ${dateStr}</p>
                    </div>
                </div>
                <div style="text-align:center; margin-bottom:28px;">
                    <h2 style="font-size:18px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin:0;">Constancia de ${proc?.title || "Trámite Municipal"}</h2>
                    <p style="color:#666; font-size:12px; margin-top:6px;">Documento Oficial — Expedido por el H. Ayuntamiento</p>
                </div>
                <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align:center;">
                    <p style="font-weight:bold; font-size:14px; color:#16a34a; margin:0;">✓  SOLICITUD APROBADA</p>
                    ${request.staff_notes ? `<p style="font-size:12px; color:#666; margin-top:8px;">Nota: ${request.staff_notes}</p>` : ""}
                </div>
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:13px; font-weight:bold; text-transform:uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom:8px; margin-bottom:12px;">Datos del Solicitante</h3>
                    <table style="width:100%; border-collapse:collapse; font-size:12px;">
                        <tr><td style="padding:6px 0; color:#666; width:35%;">Nombre completo:</td><td style="font-weight:bold;">${request.full_name}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Teléfono:</td><td>${request.phone}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Domicilio:</td><td>${request.address}</td></tr>
                        ${request.cadastral_key ? `<tr><td style="padding:6px 0; color:#666; font-weight:bold;">CLAVE CATASTRAL:</td><td style="font-weight:bold; color:#1BDA5B;">${request.cadastral_key}</td></tr>` : ""}
                    </table>
                </div>
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:13px; font-weight:bold; text-transform:uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom:8px; margin-bottom:12px;">Datos del Trámite</h3>
                    <table style="width:100%; border-collapse:collapse; font-size:12px;">
                        <tr><td style="padding:6px 0; color:#666; width:35%;">Tipo de trámite:</td><td style="font-weight:bold;">${proc?.title || "-"}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Folio:</td><td>${request.folio}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Fecha de aprobación:</td><td>${request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString("es-MX") : dateStr}</td></tr>
                    </table>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:48px; padding-top:24px;">
                    <div style="text-align:center; width:40%;"><div style="border-top: 1px solid #333; padding-top:8px;"><p style="font-size:11px; font-weight:bold; margin:0;">PRESIDENTE MUNICIPAL</p><div style="height:20px; border-bottom: 1px dashed #ccc; margin: 8px 0;"></div><p style="font-size:10px; color:#666; margin:0;">Firma y Sello Oficial</p></div></div>
                    <div style="text-align:center; width:40%;"><div style="border-top: 1px solid #333; padding-top:8px;"><p style="font-size:11px; font-weight:bold; margin:0;">DIRECTOR DE SERVICIOS</p><div style="height:20px; border-bottom: 1px dashed #ccc; margin: 8px 0;"></div><p style="font-size:10px; color:#666; margin:0;">Firma y Sello Oficial</p></div></div>
                </div>
                <div style="text-align:center; margin-top:32px; padding-top:16px; border-top: 1px solid #e5e7eb; font-size:9px; color:#999;"><p>Documento generado electrónicamente por el Sistema Governia</p></div>
            </div>
        `;

        await html2pdf().from(el).set({
            margin: 0,
            filename: `Constancia-${request.folio}.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }).save();
        setGeneratingPdf(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-gov-bg flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-gov-primary border-t-transparent rounded-full" />
        </div>
    );

    if (!request) return (
        <div className="min-h-screen bg-gov-bg flex items-center justify-center text-white">Solicitud no encontrada.</div>
    );

    const proc = request.procedures;
    const isApproved = request.status === "completed";
    const isCorrection = request.status === "correction";

    return (
        <div className="min-h-screen bg-gov-bg pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 bg-gov-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-gov-light/20">
                <button onClick={() => router.back()} className="p-2 hover:bg-gov-surface rounded-full text-gov-grey transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex-1">
                    <p className="text-[10px] text-gov-grey uppercase tracking-widest font-bold">Detalle del Trámite</p>
                    <h1 className="text-sm font-bold text-white">{proc?.title}</h1>
                </div>
                {isApproved && (
                    <button
                        onClick={generatePDF}
                        disabled={generatingPdf}
                        className="bg-gov-primary text-gov-bg font-bold text-[10px] px-3 py-1.5 rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">download</span> {generatingPdf ? "..." : "PDF"}
                    </button>
                )}
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Status Card */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gov-grey uppercase font-bold tracking-wider mb-1">Estatus Actual</p>
                            <h2 className={`text-2xl font-black ${STATUS_COLORS[request.status]}`}>{STATUS_LABELS[request.status]}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gov-grey uppercase font-bold tracking-wider mb-1">Folio</p>
                            <p className="text-gov-primary font-mono font-bold">{request.folio}</p>
                        </div>
                    </div>
                    {/* Background glow based on status */}
                    <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[80px] rounded-full opacity-20 ${
                        request.status === "completed" ? "bg-emerald-500" : 
                        request.status === "rejected" ? "bg-red-500" : "bg-amber-500"
                    }`} />
                </div>

                {/* Staff Message */}
                {request.staff_notes && (
                    <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-top-2">
                        <span className="material-symbols-outlined text-amber-400">info</span>
                        <div>
                            <p className="text-amber-400 text-xs font-bold uppercase mb-1">Mensaje del Municipio</p>
                            <p className="text-white text-sm leading-relaxed">{request.staff_notes}</p>
                        </div>
                    </div>
                )}

                {/* Correction Upload Section */}
                {isCorrection && (
                    <div className="bg-gov-surface border-2 border-dashed border-amber-500/30 rounded-2xl p-6 space-y-4 animate-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined">upload_file</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Subir documentos faltantes</h3>
                                <p className="text-gov-grey text-xs">Usa esta sección para completar tu solicitud.</p>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="bg-gov-bg border border-gov-light/30 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-gov-grey mb-2">add_a_photo</span>
                                <p className="text-xs text-gov-grey">{uploading ? "Subiendo..." : "Selecciona o arrastra el archivo"}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitCorrections}
                            disabled={submitting || uploading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-gov-bg font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50">
                            {submitting ? "Enviando..." : "Enviar Correcciones al Municipio"}
                        </button>
                    </div>
                )}

                {/* Details Grid */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 space-y-6">
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary text-lg">person</span>
                            Datos Enviados
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Nombre", value: request.full_name },
                                { label: "Teléfono", value: request.phone },
                                { label: "Email", value: request.email },
                                { label: "Domicilio", value: request.address, span: true },
                                ...(request.cadastral_key ? [{ label: "Clave Catastral", value: request.cadastral_key, highlight: true }] : []),
                            ].map((item: any, i) => (
                                <div key={i} className={item.span ? "md:col-span-2" : ""}>
                                    <label className="text-[10px] text-gov-grey uppercase font-bold tracking-widest">{item.label}</label>
                                    <p className={`text-sm mt-0.5 ${item.highlight ? "text-amber-400 font-bold" : "text-white"}`}>{item.value || "—"}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {request.notes && (
                        <div className="border-t border-gov-light/30 pt-4">
                            <label className="text-[10px] text-gov-grey uppercase font-bold tracking-widest">Notas Adicionales</label>
                            <p className="text-sm text-white mt-1 leading-relaxed">{request.notes}</p>
                        </div>
                    )}
                </div>

                {/* Documents */}
                {request.procedure_documents.length > 0 && (
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-primary text-lg">folder</span>
                            Documentación en el Expediente
                        </h3>
                        <div className="space-y-3">
                            {request.procedure_documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 bg-gov-bg border border-gov-light/30 rounded-xl group hover:border-gov-primary/30 transition-all">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`material-symbols-outlined ${doc.document_type === 'Correction' ? 'text-amber-400' : 'text-gov-grey'}`}>
                                            {doc.document_type === 'Correction' ? 'edit_document' : 'description'}
                                        </span>
                                        <div>
                                            <p className="text-xs text-white truncate">{doc.file_name}</p>
                                            {doc.document_type === 'Correction' && <span className="text-[8px] text-amber-400 font-bold uppercase">Corrección</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const { data } = await supabase.storage.from("procedure-documents").createSignedUrl(doc.file_path, 3600);
                                            if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                                        }}
                                        className="text-[10px] text-gov-primary font-bold px-2 py-1 hover:bg-gov-primary/10 rounded-lg transition-colors">
                                        VER
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action */}
                <button
                    onClick={() => router.back()}
                    className="w-full bg-gov-light/10 hover:bg-gov-light/20 text-white font-bold py-4 rounded-xl transition-colors">
                    Regresar
                </button>
            </div>
        </div>
    );
}
