"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

const STATUS_LABELS: Record<string, string> = {
    draft: "Borrador", pending: "Pendiente", in_progress: "En Proceso",
    completed: "Aprobado", rejected: "Rechazado", correction: "Requiere Corrección",
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

export default function StaffServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [staffNotes, setStaffNotes] = useState("");
    const [updating, setUpdating] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabase
                .from("procedure_requests")
                .select(`id, folio, status, created_at, full_name, phone, email, address, cadastral_key, notes,
                    staff_notes, reviewed_at, municipality_name,
                    procedures (title, category, cost, estimated_time, requirements),
                    procedure_documents (id, file_name, file_path, document_type)`)
                .eq("id", params.id)
                .single();
            if (!error && data) {
                setRequest(data as any);
                setStaffNotes(data.staff_notes || "");
            }
            setLoading(false);
        };
        fetch();
    }, [params.id]);

    const handleUpdateStatus = async (newStatus: "completed" | "rejected" | "in_progress") => {
        if (!request) return;
        setUpdating(true);
        const { data: { user } } = await supabase.auth.getUser();
        await supabase
            .from("procedure_requests")
            .update({
                status: newStatus,
                staff_notes: staffNotes,
                reviewed_by: user?.id,
                reviewed_at: new Date().toISOString(),
            })
            .eq("id", request.id);

        setRequest(prev => prev ? { ...prev, status: newStatus, staff_notes: staffNotes } : prev);
        setUpdating(false);
    };

    const generatePDF = async () => {
        if (!request) return;
        setGeneratingPdf(true);

        const proc = request.procedures;
        const now = new Date();
        const dateStr = now.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });

        // Dynamic import para no afectar bundle en cliente
        const html2pdf = (await import("html2pdf.js" as any)).default;

        const el = document.createElement("div");
        el.innerHTML = `
            <div style="font-family: 'Arial', sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #1a1a1a;">
                <!-- ENCABEZADO -->
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom: 3px solid #1BDA5B; padding-bottom: 20px; margin-bottom: 24px;">
                    <div style="display:flex; align-items:center; gap: 16px;">
                        <!-- Espacio para logo municipal -->
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

                <!-- TÍTULO DEL DOCUMENTO -->
                <div style="text-align:center; margin-bottom:28px;">
                    <h2 style="font-size:18px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin:0;">
                        Constancia de ${proc?.title || "Trámite Municipal"}
                    </h2>
                    <p style="color:#666; font-size:12px; margin-top:6px;">Documento Oficial — Expedido por el H. Ayuntamiento</p>
                </div>

                <!-- RESOLUCIÓN -->
                <div style="background: ${request.status === "completed" ? "#f0fdf4" : "#fef2f2"}; border: 1px solid ${request.status === "completed" ? "#86efac" : "#fca5a5"}; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align:center;">
                    <p style="font-weight:bold; font-size:14px; color:${request.status === "completed" ? "#16a34a" : "#dc2626"}; margin:0;">
                        ${request.status === "completed" ? "✓  SOLICITUD APROBADA" : "✗  SOLICITUD RECHAZADA"}
                    </p>
                    ${staffNotes ? `<p style="font-size:12px; color:#666; margin-top:8px;">Nota: ${staffNotes}</p>` : ""}
                </div>

                <!-- DATOS DEL SOLICITANTE -->
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:13px; font-weight:bold; text-transform:uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom:8px; margin-bottom:12px;">Datos del Solicitante</h3>
                    <table style="width:100%; border-collapse:collapse; font-size:12px;">
                        <tr><td style="padding:6px 0; color:#666; width:35%;">Nombre completo:</td><td style="font-weight:bold;">${request.full_name}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Teléfono:</td><td>${request.phone}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Correo electrónico:</td><td>${request.email}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Domicilio:</td><td>${request.address}</td></tr>
                        ${request.cadastral_key ? `<tr><td style="padding:6px 0; color:#666; font-weight:bold;">CLAVE CATASTRAL:</td><td style="font-weight:bold; color:#1BDA5B;">${request.cadastral_key}</td></tr>` : ""}
                        ${request.notes ? `<tr><td style="padding:6px 0; color:#666;">Notas:</td><td>${request.notes}</td></tr>` : ""}
                    </table>
                </div>

                <!-- DATOS DEL TRÁMITE -->
                <div style="margin-bottom:24px;">
                    <h3 style="font-size:13px; font-weight:bold; text-transform:uppercase; border-bottom: 1px solid #e5e7eb; padding-bottom:8px; margin-bottom:12px;">Datos del Trámite</h3>
                    <table style="width:100%; border-collapse:collapse; font-size:12px;">
                        <tr><td style="padding:6px 0; color:#666; width:35%;">Tipo de trámite:</td><td style="font-weight:bold;">${proc?.title || "-"}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Categoría:</td><td>${proc?.category || "-"}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Costo:</td><td>${proc?.cost || "-"}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Tiempo de resolución:</td><td>${proc?.estimated_time || "-"}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Fecha de solicitud:</td><td>${new Date(request.created_at).toLocaleDateString("es-MX")}</td></tr>
                        <tr><td style="padding:6px 0; color:#666;">Fecha de resolución:</td><td>${request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString("es-MX") : dateStr}</td></tr>
                    </table>
                </div>

                <!-- ESPACIO PARA FIRMA -->
                <div style="display:flex; justify-content:space-between; margin-top:48px; padding-top:24px;">
                    <div style="text-align:center; width:40%;">
                        <div style="border-top: 1px solid #333; padding-top:8px;">
                            <p style="font-size:11px; font-weight:bold; margin:0;">PRESIDENTE MUNICIPAL</p>
                            <!-- Espacio para nombre del presidente -->
                            <div style="height:20px; border-bottom: 1px dashed #ccc; margin: 8px 0;"></div>
                            <p style="font-size:10px; color:#666; margin:0;">Firma y Sello Oficial</p>
                        </div>
                    </div>
                    <div style="text-align:center; width:40%;">
                        <div style="border-top: 1px solid #333; padding-top:8px;">
                            <p style="font-size:11px; font-weight:bold; margin:0;">DIRECTOR DE SERVICIOS</p>
                            <div style="height:20px; border-bottom: 1px dashed #ccc; margin: 8px 0;"></div>
                            <p style="font-size:10px; color:#666; margin:0;">Firma y Sello Oficial</p>
                        </div>
                    </div>
                </div>

                <!-- PIE DE PÁGINA -->
                <div style="text-align:center; margin-top:32px; padding-top:16px; border-top: 1px solid #e5e7eb; font-size:9px; color:#999;">
                    <p>Documento generado electrónicamente por el Sistema Governia · Folio: ${request.folio}</p>
                    <p>Para verificar la autenticidad de este documento comuníquese al Ayuntamiento Municipal de ${request.municipality_name || "Soteapan"}</p>
                </div>
            </div>
        `;

        await html2pdf()
            .from(el)
            .set({
                margin: 0,
                filename: `${request.folio}-${proc?.title?.replace(/\s+/g, "_") || "tramite"}.pdf`,
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .save();

        setGeneratingPdf(false);
    };

    const getSignedUrl = async (filePath: string) => {
        const { data } = await supabase.storage
            .from("procedure-documents")
            .createSignedUrl(filePath, 3600);
        if (data?.signedUrl) window.open(data.signedUrl, "_blank");
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
    const isResolved = request.status === "completed" || request.status === "rejected";

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <Link href="/staff/services" className="p-2 rounded-lg bg-gov-surface hover:bg-gov-light text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">{proc?.title || "Solicitud"}</h2>
                    <p className="text-gov-grey flex items-center gap-2 text-sm">
                        Folio: <span className="font-mono text-gov-primary">{request.folio || "Sin folio"}</span>
                        <span className="w-1 h-1 rounded-full bg-gov-grey" />
                        <span>{proc?.category}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    {isResolved && (
                        <button
                            onClick={generatePDF}
                            disabled={generatingPdf}
                            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 rounded-lg font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50">
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                            {generatingPdf ? "Generando..." : "Generar PDF"}
                        </button>
                    )}
                    {!isResolved && (
                        <>
                            <button
                                onClick={() => handleUpdateStatus("in_progress")}
                                disabled={updating}
                                className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">pending</span>
                                En Proceso
                            </button>
                            <button
                                onClick={() => handleUpdateStatus("rejected")}
                                disabled={updating}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-bold text-sm transition-all">
                                Rechazar
                            </button>
                            <button
                                onClick={() => handleUpdateStatus("correction")}
                                disabled={updating}
                                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">edit_note</span>
                                Solicitar Corrección
                            </button>
                            <button
                                onClick={() => handleUpdateStatus("completed")}
                                disabled={updating}
                                className="px-4 py-2 bg-gov-primary hover:bg-emerald-400 text-gov-bg font-bold rounded-lg text-sm shadow-[0_0_15px_rgba(27,218,91,0.3)] transition-all flex items-center gap-2 disabled:opacity-50">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                {updating ? "Guardando..." : "Aprobar"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Citizen Info */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light/30 pb-2">Información del Ciudadano</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Nombre Completo", value: request.full_name },
                                { label: "Fecha de Solicitud", value: new Date(request.created_at).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) },
                                { label: "Teléfono", value: request.phone },
                                { label: "Email", value: request.email },
                                { label: "Clave Catastral", value: request.cadastral_key, highlight: true },
                            ].map(({ label, value, highlight }) => (
                                <div key={label}>
                                    <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">{label}</label>
                                    <p className={`font-medium mt-1 ${highlight && value ? "text-amber-400 font-bold" : "text-white"}`}>{value || "—"}</p>
                                </div>
                            ))}
                            <div className="md:col-span-2">
                                <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Domicilio</label>
                                <p className="text-white font-medium mt-1">{request.address || "—"}</p>
                            </div>
                            {request.notes && (
                                <div className="md:col-span-2">
                                    <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Notas del Ciudadano</label>
                                    <p className="text-white mt-1 text-sm leading-relaxed">{request.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light/30 pb-2">
                            Documentación Adjunta
                            <span className="ml-2 text-xs text-gov-grey font-normal">({request.procedure_documents?.length || 0} archivo{request.procedure_documents?.length !== 1 ? "s" : ""})</span>
                        </h3>
                        {!request.procedure_documents?.length ? (
                            <p className="text-gov-grey text-sm italic">El ciudadano no adjuntó documentos.</p>
                        ) : (
                            <div className="space-y-3">
                                {request.procedure_documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gov-bg border border-gov-light/50 rounded-xl hover:border-gov-primary/50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gov-light/20 rounded-lg text-gov-primary">
                                                <span className="material-symbols-outlined">
                                                    {doc.file_name?.endsWith(".pdf") ? "picture_as_pdf" : "image"}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium group-hover:text-white">{doc.file_name}</span>
                                        </div>
                                        <button
                                            onClick={() => getSignedUrl(doc.file_path)}
                                            className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1">
                                            Ver <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Staff Notes */}
                    {!isResolved && (
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light/30 pb-2">Notas del Evaluador</h3>
                            <textarea
                                value={staffNotes}
                                onChange={e => setStaffNotes(e.target.value)}
                                placeholder="Escribe notas internas o la razón de aprobación/rechazo (visible para el ciudadano)..."
                                rows={4}
                                className="w-full bg-gov-bg border border-gov-light/50 focus:border-gov-primary rounded-xl px-4 py-3 text-white text-sm placeholder-gov-grey/60 outline-none resize-none transition-colors"
                            />
                        </div>
                    )}
                    {isResolved && request.staff_notes && (
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Nota del Evaluador</h3>
                            <p className="text-white text-sm leading-relaxed">{request.staff_notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Status */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Estado Actual</h3>
                        <div className="flex flex-col items-center py-4">
                            <span className={`px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-2 ${
                                request.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                request.status === "rejected"  ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                request.status === "in_progress" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                                {STATUS_LABELS[request.status] || request.status}
                            </span>
                        </div>

                        {/* Timeline */}
                        <div className="mt-4 space-y-4 relative">
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gov-light/30" />
                            {[
                                { icon: "check_circle", label: "Solicitud Recibida", sub: new Date(request.created_at).toLocaleDateString("es-MX"), done: true },
                                { icon: "pending", label: "En Revisión", sub: request.status === "in_progress" ? "Actual" : "Pendiente", done: ["in_progress","completed","rejected"].includes(request.status) },
                                { icon: "gavel", label: "Dictamen Final", sub: request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString("es-MX") : "Pendiente", done: isResolved },
                            ].map((step, i) => (
                                <div key={i} className={`flex gap-4 relative ${!step.done ? "opacity-40" : ""}`}>
                                    <span className={`material-symbols-outlined bg-gov-bg z-10 p-1 rounded-full text-sm border ${step.done ? "text-gov-primary border-gov-primary" : "text-gov-grey border-gov-grey"}`}>
                                        {step.icon}
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-white">{step.label}</p>
                                        <p className="text-[10px] text-gov-grey">{step.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trámite Info */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Info del Trámite</h3>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-xs text-gov-grey uppercase font-bold">Categoría</p><p className="text-white">{proc?.category || "—"}</p></div>
                            <div><p className="text-xs text-gov-grey uppercase font-bold">Costo</p><p className="text-emerald-400 font-bold">{proc?.cost || "—"}</p></div>
                            <div><p className="text-xs text-gov-grey uppercase font-bold">Tiempo Est.</p><p className="text-amber-400 font-bold">{proc?.estimated_time || "—"}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
