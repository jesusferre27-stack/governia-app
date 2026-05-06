"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/app/supabase";

interface FormData {
    full_name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    cadastral_key: string;
}

const STEPS = ["Información", "Datos", "Documentos", "Confirmar", "Éxito"];

export default function ProcedureWizardPage() {
    const params = useParams();
    const router = useRouter();
    const [procedure, setProcedure] = useState<any>(null);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [folio, setFolio] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [formData, setFormData] = useState<FormData>({
        full_name: "", phone: "", email: "", address: "", notes: "", cadastral_key: "",
    });
    const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setFormData(prev => ({
                    ...prev,
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
                    email: session.user.email || "",
                }));
            }
            const { data } = await supabase.from("procedures").select("*").eq("id", params.id).single();
            if (data) setProcedure(data);
            setLoading(false);
        };
        init();
    }, [params.id]);

    const requirements = (() => {
        let r = procedure?.requirements;
        if (typeof r === "string") { try { r = JSON.parse(r); } catch { r = [r]; } }
        return Array.isArray(r) ? r : [];
    })();

    const validateForm = () => {
        const errors: Partial<FormData> = {};
        if (!formData.full_name.trim()) errors.full_name = "Nombre requerido";
        if (!formData.phone.trim()) errors.phone = "Teléfono requerido";
        if (!formData.email.trim()) errors.email = "Email requerido";
        if (!formData.address.trim()) errors.address = "Dirección requerida";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateRequest = async () => {
        if (!validateForm()) return;
        setSubmitting(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { alert("Debes iniciar sesión."); setSubmitting(false); return; }

        const { data, error } = await supabase
            .from("procedure_requests")
            .insert({
                procedure_id: procedure.id,
                department_id: procedure.department_id,
                citizen_id: session.user.id,
                status: "draft",
                current_step: 2,
                full_name: formData.full_name,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                notes: formData.notes,
                cadastral_key: formData.cadastral_key,
            })
            .select()
            .single();

        if (error) { alert("Error al crear solicitud: " + error.message); setSubmitting(false); return; }
        setRequestId(data.id);
        setSubmitting(false);
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { alert("Debes iniciar sesión."); return; }

        setUploading(true);
        const userId = session.user.id;
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
        const filePath = `${userId}/${procedure.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("procedure-documents")
            .upload(filePath, file);

        if (uploadError) {
            alert("Error al subir: " + uploadError.message);
            setUploading(false);
            return;
        }

        if (requestId) {
            await supabase.from("procedure_documents").insert({
                request_id: requestId,
                procedure_id: procedure.id,
                user_id: userId,
                document_type: "requisito",
                file_path: filePath,
                file_name: file.name,
                file_url: filePath,
            });
        }

        setUploadedFiles(prev => [...prev, file.name]);
        setUploading(false);
        e.target.value = "";
    };

    const handleFinalSubmit = async () => {
        if (!requestId) return;
        setSubmitting(true);
        const { data, error } = await supabase
            .from("procedure_requests")
            .update({ status: "pending", current_step: 4 })
            .eq("id", requestId)
            .select("folio")
            .single();

        if (!error && data?.folio) setFolio(data.folio);
        setSubmitting(false);
        setStep(5);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) return (
        <div className="min-h-screen bg-gov-bg flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-gov-primary border-t-transparent rounded-full" />
        </div>
    );
    if (!procedure) return (
        <div className="min-h-screen bg-gov-bg flex items-center justify-center text-white">
            Trámite no encontrado.
        </div>
    );

    return (
        <div className="min-h-screen bg-gov-bg pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 bg-gov-surface/80 backdrop-blur-md sticky top-0 z-10 border-b border-gov-light/20">
                <button onClick={() => step > 1 && step < 5 ? setStep(s => s - 1) : router.back()}
                    className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex-1">
                    <p className="text-xs text-gov-grey uppercase tracking-wider font-bold">Solicitud de Trámite</p>
                    <h1 className="text-sm md:text-lg font-bold text-white truncate max-w-xs md:max-w-none">{procedure.title}</h1>
                </div>
                {step < 5 && (
                    <span className="text-xs text-gov-grey bg-gov-surface border border-gov-light px-3 py-1 rounded-full">
                        Paso {step} de {STEPS.length - 1}
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            {step < 5 && (
                <div className="w-full bg-gov-light/20 h-1">
                    <div
                        className="h-1 bg-gov-primary transition-all duration-500"
                        style={{ width: `${((step - 1) / 4) * 100}%` }}
                    />
                </div>
            )}

            <div className="max-w-2xl mx-auto p-4 space-y-6 mt-4">

                {/* PASO 1: Información del trámite */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-white">Información del Trámite</h2>
                            <p className="text-gov-grey leading-relaxed">{procedure.description}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gov-bg p-4 rounded-xl border border-gov-light/20">
                                    <span className="text-gov-grey text-xs uppercase block mb-1">Costo</span>
                                    <span className="text-emerald-400 font-bold text-lg">{procedure.cost}</span>
                                </div>
                                <div className="bg-gov-bg p-4 rounded-xl border border-gov-light/20">
                                    <span className="text-gov-grey text-xs uppercase block mb-1">Tiempo</span>
                                    <span className="text-amber-400 font-bold text-lg">{procedure.estimated_time}</span>
                                </div>
                            </div>
                            {requirements.length > 0 && (
                                <div>
                                    <p className="text-white font-bold mb-3">Requisitos:</p>
                                    <ul className="space-y-2">
                                        {requirements.map((r: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gov-grey text-sm p-2 bg-gov-bg/50 rounded-lg">
                                                <span className="material-symbols-outlined text-gov-primary text-base mt-0.5">check_circle</span>
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gov-primary/20">
                            Iniciar Trámite <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                )}

                {/* PASO 2: Datos personales */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 space-y-5">
                            <h2 className="text-2xl font-bold text-white">Datos del Solicitante</h2>
                            <p className="text-gov-grey text-sm">Esta información aparecerá en el documento oficial.</p>

                            {[
                                { key: "full_name", label: "Nombre Completo", icon: "person", placeholder: "Como aparece en tu identificación oficial" },
                                { key: "phone", label: "Teléfono de Contacto", icon: "phone", placeholder: "10 dígitos" },
                                { key: "email", label: "Correo Electrónico", icon: "email", placeholder: "Para notificaciones del trámite" },
                                { key: "address", label: "Domicilio del Solicitante", icon: "home", placeholder: "Calle, número, colonia" },
                            ].map(({ key, label, icon, placeholder }) => (
                                <div key={key}>
                                    <label className="text-xs text-gov-grey uppercase font-bold tracking-wider mb-1 block">{label}</label>
                                    <div className={`flex items-center gap-3 bg-gov-bg border rounded-xl px-4 py-3 transition-colors ${formErrors[key as keyof FormData] ? "border-red-500" : "border-gov-light/50 focus-within:border-gov-primary"}`}>
                                        <span className="material-symbols-outlined text-gov-grey text-lg">{icon}</span>
                                        <input
                                            type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                                            value={formData[key as keyof FormData]}
                                            onChange={e => {
                                                setFormData(prev => ({ ...prev, [key]: e.target.value }));
                                                setFormErrors(prev => ({ ...prev, [key]: "" }));
                                            }}
                                            placeholder={placeholder}
                                            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gov-grey/60"
                                        />
                                    </div>
                                    {formErrors[key as keyof FormData] && (
                                        <p className="text-red-400 text-xs mt-1">{formErrors[key as keyof FormData]}</p>
                                    )}
                                </div>
                            ))}

                            {/* Campo Especial para Predial */}
                            {procedure.title?.toLowerCase().includes("predial") && (
                                <div className="animate-in zoom-in duration-300">
                                    <label className="text-xs text-amber-400 uppercase font-bold tracking-wider mb-1 block">Clave Catastral (Recomendado)</label>
                                    <div className="flex items-center gap-3 bg-gov-bg border border-amber-500/50 rounded-xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                                        <span className="material-symbols-outlined text-amber-400 text-lg">fact_check</span>
                                        <input
                                            type="text"
                                            value={formData.cadastral_key}
                                            onChange={e => setFormData(prev => ({ ...prev, cadastral_key: e.target.value }))}
                                            placeholder="Ej: 01-001-001-001"
                                            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gov-grey/60"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gov-grey mt-1 italic">Si no tienes el recibo a la mano, ingresa tu clave para agilizar la búsqueda.</p>
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-gov-grey uppercase font-bold tracking-wider mb-1 block">Notas Adicionales (opcional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    placeholder="Información adicional relevante para el trámite..."
                                    rows={3}
                                    className="w-full bg-gov-bg border border-gov-light/50 focus:border-gov-primary rounded-xl px-4 py-3 text-white text-sm placeholder-gov-grey/60 outline-none resize-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleCreateRequest}
                            disabled={submitting}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gov-primary/20 disabled:opacity-50">
                            {submitting ? "Guardando..." : "Continuar"} <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                )}

                {/* PASO 3: Documentos */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-white">Documentos Requeridos</h2>
                            <p className="text-gov-grey text-sm">Adjunta los documentos en formato PDF, JPG o PNG (máx. 10MB cada uno).</p>

                            {requirements.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gov-grey uppercase font-bold tracking-wider">Necesitas adjuntar:</p>
                                    {requirements.map((r: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gov-grey p-2 bg-gov-bg/50 rounded-lg">
                                            <span className="material-symbols-outlined text-amber-400 text-base">upload_file</span>
                                            {r}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="block border-2 border-dashed border-gov-light/50 hover:border-gov-primary/50 p-8 rounded-xl text-center cursor-pointer transition-colors group">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <span className="material-symbols-outlined text-4xl text-gov-primary mb-2">cloud_sync</span>
                                        <p className="text-white font-bold">Subiendo archivo...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <span className="material-symbols-outlined text-4xl text-gov-grey group-hover:text-gov-primary transition-colors mb-2">cloud_upload</span>
                                        <p className="text-gov-grey group-hover:text-white transition-colors text-sm">
                                            Haz clic para seleccionar un archivo
                                        </p>
                                        <p className="text-xs text-gov-grey/60 mt-1">PDF, JPG, PNG — Máx. 10MB</p>
                                    </div>
                                )}
                            </label>

                            {uploadedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gov-grey uppercase font-bold tracking-wider">Archivos adjuntados:</p>
                                    {uploadedFiles.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                                            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
                                            <span className="text-sm text-white truncate">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => { setStep(4); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gov-primary/20">
                            Continuar <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        {uploadedFiles.length === 0 && (
                            <p className="text-center text-xs text-amber-400">Puedes continuar sin documentos, pero tu solicitud podría tardar más en procesarse.</p>
                        )}
                    </div>
                )}

                {/* PASO 4: Confirmación */}
                {step === 4 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-white">Confirmación Final</h2>
                            <p className="text-gov-grey text-sm">Revisa tu información antes de enviar.</p>

                            <div className="space-y-3">
                                <div className="p-4 bg-gov-bg rounded-xl border border-gov-light/30">
                                    <p className="text-xs text-gov-grey uppercase font-bold mb-1">Trámite</p>
                                    <p className="text-white font-bold">{procedure.title}</p>
                                    <p className="text-xs text-gov-grey mt-1">{procedure.category} · {procedure.cost} · {procedure.estimated_time}</p>
                                </div>
                                {[
                                    { label: "Solicitante", value: formData.full_name },
                                    { label: "Teléfono", value: formData.phone },
                                    { label: "Email", value: formData.email },
                                    { label: "Dirección", value: formData.address },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-start p-3 bg-gov-bg/50 rounded-xl">
                                        <span className="text-xs text-gov-grey uppercase font-bold">{label}</span>
                                        <span className="text-white text-sm text-right max-w-[60%]">{value}</span>
                                    </div>
                                ))}
                                {uploadedFiles.length > 0 && (
                                    <div className="p-3 bg-gov-bg/50 rounded-xl">
                                        <span className="text-xs text-gov-grey uppercase font-bold block mb-2">Documentos</span>
                                        {uploadedFiles.map((f, i) => (
                                            <p key={i} className="text-white text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-400 text-sm">attach_file</span>{f}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleFinalSubmit}
                            disabled={submitting}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gov-primary/20 disabled:opacity-50">
                            {submitting ? "Enviando..." : "Enviar Solicitud"}
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                )}

                {/* PASO 5: Éxito */}
                {step === 5 && (
                    <div className="text-center pt-10 animate-in fade-in duration-500 space-y-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-5xl text-emerald-400">check_circle</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h2>
                            <p className="text-gov-grey">Tu trámite ha sido registrado exitosamente.</p>
                        </div>

                        {folio && (
                            <div className="bg-gov-surface border border-gov-primary/30 rounded-2xl p-6 max-w-xs mx-auto">
                                <p className="text-xs text-gov-grey uppercase font-bold mb-1">Folio de seguimiento</p>
                                <p className="text-3xl font-mono font-bold text-gov-primary">{folio}</p>
                                <p className="text-xs text-gov-grey mt-2">Guarda este folio para consultar el estatus de tu trámite.</p>
                            </div>
                        )}

                        <div className="space-y-3 max-w-xs mx-auto">
                            <button
                                onClick={() => router.push("/citizen/requests")}
                                className="w-full bg-gov-primary text-gov-bg font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors">
                                Ver Mis Trámites
                            </button>
                            <button
                                onClick={() => router.push("/citizen")}
                                className="w-full bg-gov-surface border border-gov-light text-white font-bold py-3 rounded-xl hover:bg-gov-light transition-colors">
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
