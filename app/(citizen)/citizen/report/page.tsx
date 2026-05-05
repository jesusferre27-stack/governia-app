"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";

// Mapeo categoría → departamento (nombre en DB)
const CATEGORY_TO_DEPT: Record<string, string> = {
    "Alumbrado":    "Alumbrado Público",
    "Fuga de Agua": "Agua Potable y Drenaje",
    "Basura":       "Limpia Pública",
    "Baches":       "Obras Públicas",
    "Seguridad":    "Seguridad Pública",
    "Parques":      "Parques y Jardines",
};

const categories = [
    { icon: "lightbulb",  label: "Alumbrado",    color: "text-yellow-400", glow: "shadow-yellow-400/50", border: "border-yellow-400" },
    { icon: "water_drop", label: "Fuga de Agua", color: "text-blue-400",   glow: "shadow-blue-400/50",   border: "border-blue-400"   },
    { icon: "delete",     label: "Basura",        color: "text-gray-400",   glow: "shadow-gray-400/50",   border: "border-gray-400"   },
    { icon: "edit_road",  label: "Baches",        color: "text-orange-400", glow: "shadow-orange-400/50", border: "border-orange-400" },
    { icon: "security",   label: "Seguridad",     color: "text-red-400",    glow: "shadow-red-400/50",    border: "border-red-400"    },
    { icon: "nature",     label: "Parques",       color: "text-green-400",  glow: "shadow-green-400/50",  border: "border-green-400"  },
];

interface PhotoPreview {
    file: File;
    url: string;
}

export default function ReportPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [photos, setPhotos] = useState<PhotoPreview[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [folio, setFolio] = useState("");
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Limpiar URLs de objeto al desmontar
    useEffect(() => {
        return () => photos.forEach(p => URL.revokeObjectURL(p.url));
    }, [photos]);

    const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = 5 - photos.length;
        const newPhotos = files.slice(0, remaining).map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
        // Reset input para permitir re-seleccionar el mismo archivo
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError(null);

        try {
            // 1. Verificar usuario autenticado
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
                setSubmitting(false);
                return;
            }
            const citizenId = user.id;

            // 2. Obtener department_id del departamento correspondiente
            const deptName = CATEGORY_TO_DEPT[selectedCategory!] || "Obras Públicas";
            const { data: dept } = await supabase
                .from("departments")
                .select("id")
                .eq("name", deptName)
                .single();

            // 3. Generar folio: contar existentes + 1
            const { count } = await supabase
                .from("reports")
                .select("*", { count: "exact", head: true });
            const newFolio = "REP-" + String((count ?? 0) + 1).padStart(4, "0");

            // 4. Crear el reporte
            const { data: report, error: reportError } = await supabase
                .from("reports")
                .insert({
                    folio: newFolio,
                    citizen_id: citizenId,
                    category: selectedCategory!,
                    description,
                    address: address || null,
                    department_id: dept?.id || null,
                    status: "nuevo",
                    priority: "media",
                })
                .select()
                .single();

            if (reportError) throw reportError;

            // 5. Subir fotos si las hay
            if (photos.length > 0 && report) {
                let uploadedCount = 0;
                for (const photo of photos) {
                    const ext = photo.file.name.split(".").pop();
                    const filePath = `${report.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

                    const { error: uploadError } = await supabase.storage
                        .from("report-photos")
                        .upload(filePath, photo.file, {
                            contentType: photo.file.type,
                            upsert: false,
                        });

                    if (!uploadError) {
                        const { data: urlData } = supabase.storage
                            .from("report-photos")
                            .getPublicUrl(filePath);

                        await supabase.from("report_photos").insert({
                            report_id: report.id,
                            file_path: filePath,
                            file_url: urlData.publicUrl,
                        });
                        uploadedCount++;
                    } else {
                        console.error("Upload error:", uploadError);
                        // Si falla la primera foto y es obligatorio, avisar
                        if (uploadedCount === 0) {
                            setError("Error al subir las fotos. Verifica los permisos del servidor.");
                            setSubmitting(false);
                            return;
                        }
                    }
                }
            }

            setFolio(newFolio);
            setStep(3);
        } catch (err: any) {
            console.error("Error al enviar reporte:", err);
            setError(err.message || "Error al enviar el reporte. Inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gov-bg min-h-full pb-20 animate-in slide-in-from-bottom-5 duration-500">
            {/* App Bar */}
            <div className="bg-gov-surface/80 backdrop-blur-md sticky top-0 z-40 p-4 flex items-center gap-4 border-b border-gov-light">
                {step > 1 && step < 3 ? (
                    <button onClick={() => setStep(step - 1)} className="text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                ) : (
                    <Link href="/citizen" className="text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                )}
                <h1 className="text-lg font-bold text-white">Nuevo Reporte</h1>
                {step < 3 && (
                    <span className="ml-auto text-xs text-gov-grey font-medium">
                        Paso {step} de 2
                    </span>
                )}
            </div>

            <div className="p-5 space-y-8">

                {/* STEP 1: Categoría */}
                {step === 1 && (
                    <>
                        <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-white leading-tight">¿Qué te gustaría <br /><span className="text-gov-primary">reportar hoy?</span></h2>
                            <p className="text-gov-grey text-sm">Selecciona la categoría que mejor describa el problema.</p>

                            {/* Illustration Hero */}
                            <div className="relative h-24 md:h-32 rounded-2xl overflow-hidden bg-gov-surface border border-gov-light shadow-lg">
                                <img 
                                    src="/report_hero.png" 
                                    alt="Reportar" 
                                    className="w-full h-full object-cover opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-gov-bg via-transparent to-transparent"></div>
                                <div className="absolute inset-y-0 left-4 flex items-center">
                                    <span className="text-xs font-bold text-white/80 uppercase tracking-tighter">Ayúdanos a mejorar tu ciudad</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {categories.map((cat, i) => {
                                    const isSelected = selectedCategory === cat.label;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedCategory(cat.label)}
                                            className={`relative bg-gov-surface border group p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? `${cat.border} border-2 shadow-[0_0_30px_-5px] ${cat.glow} scale-[1.02]` : "border-gov-light hover:border-gov-primary/50 hover:bg-gov-surface/80"}`}
                                        >
                                            {isSelected && (
                                                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full ${cat.color.replace("text-", "bg-")} flex items-center justify-center`}>
                                                    <span className="material-symbols-outlined text-[14px] text-gov-bg font-bold">check</span>
                                                </div>
                                            )}
                                            <div className={`w-14 h-14 rounded-full bg-gov-bg flex items-center justify-center border border-gov-light transition-transform duration-300 ${isSelected ? "scale-110 border-transparent ring-2 ring-offset-2 ring-offset-gov-surface " + cat.color.replace("text-", "ring-") : "group-hover:scale-110"} ${cat.color}`}>
                                                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${isSelected ? "text-white font-bold" : "text-gov-grey group-hover:text-white"}`}>{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedCategory}
                                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 
                                    ${selectedCategory
                                        ? "bg-gov-primary text-gov-bg shadow-[0_0_20px_rgba(27,218,91,0.4)] hover:shadow-[0_0_30px_rgba(27,218,91,0.6)] active:scale-95 cursor-pointer"
                                        : "bg-gov-surface border border-gov-light text-gov-grey/50 cursor-not-allowed grayscale"
                                    }`}
                            >
                                Continuar
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 2: Detalles + Fotos */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Detalles del Reporte</h2>
                            <p className="text-gov-grey text-sm mt-1">
                                Categoría: <span className="text-gov-primary font-bold">{selectedCategory}</span>
                            </p>
                        </div>

                        {/* Ubicación */}
                        <div className="space-y-2">
                            <label className="text-sm text-gov-grey font-bold uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">location_on</span>
                                Ubicación
                                <span className="text-gov-grey font-normal normal-case text-[10px] bg-gov-light/10 px-2 py-0.5 rounded-full ml-auto">Opcional</span>
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full bg-gov-surface border border-gov-light rounded-xl p-4 text-white focus:border-gov-primary focus:outline-none transition-colors"
                                placeholder="Ej: Calle Hidalgo #45, Colonia Centro"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-sm text-gov-grey font-bold uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">description</span>
                                Descripción del problema
                                <span className="text-gov-grey font-normal normal-case text-[10px] bg-gov-light/10 px-2 py-0.5 rounded-full ml-auto">Opcional</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gov-surface border border-gov-light rounded-xl p-4 text-white focus:border-gov-primary focus:outline-none min-h-[120px] transition-colors"
                                placeholder="Describe el problema con más detalle..."
                            />
                        </div>

                        {/* Subida de Fotos */}
                        <div className="space-y-3">
                            <label className="text-sm text-gov-grey font-bold uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">photo_camera</span>
                                Evidencia Fotográfica
                                <span className="text-gov-danger font-normal normal-case text-[10px] bg-gov-danger/10 px-2 py-0.5 rounded-full">Obligatorio</span>
                                {photos.length > 0 && <span className="text-gov-primary font-normal normal-case text-xs">({photos.length}/5)</span>}
                            </label>

                            {/* Previews de fotos seleccionadas */}
                            {photos.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {photos.map((photo, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gov-surface border border-gov-light group">
                                            <img
                                                src={photo.url}
                                                alt={`Foto ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removePhoto(i)}
                                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Botón añadir más fotos */}
                                    {photos.length < 5 && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-xl border-2 border-dashed border-gov-light flex flex-col items-center justify-center gap-1 text-gov-grey hover:border-gov-primary hover:text-gov-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                            <span className="text-[10px] font-bold uppercase">Agregar</span>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Zona de drop / primer botón */}
                            {photos.length === 0 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-gov-danger/30 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-gov-primary hover:bg-gov-primary/5 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-4xl text-gov-danger group-hover:text-gov-primary transition-colors">add_photo_alternate</span>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-sm">Sube al menos una foto (Máx. 5)</p>
                                        <p className="text-gov-grey text-xs mt-1">La evidencia visual es necesaria para atender tu reporte.</p>
                                    </div>
                                    <span className="bg-gov-surface border border-gov-danger/30 text-gov-danger text-xs font-bold px-4 py-1.5 rounded-full group-hover:border-gov-primary group-hover:text-gov-primary transition-colors">
                                        Seleccionar archivos
                                    </span>
                                </button>
                            )}

                            {/* Input oculto */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleAddPhotos}
                                className="hidden"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3 items-start">
                                <span className="material-symbols-outlined text-red-400 mt-0.5">error</span>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={submitting || photos.length === 0}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(27,218,91,0.4)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors active:scale-95"
                        >
                            {submitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                    Enviando reporte...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Enviar Reporte
                                    {photos.length > 0 && <span className="bg-gov-bg/30 text-gov-bg text-xs font-bold px-2 py-0.5 rounded-full">{photos.length} foto{photos.length !== 1 ? "s" : ""}</span>}
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* STEP 3: Confirmación */}
                {step === 3 && (
                    <div className="text-center pt-10 animate-in zoom-in duration-500 space-y-6">
                        <div className="w-28 h-28 rounded-full bg-gov-primary/10 border-2 border-gov-primary/30 flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-7xl text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">check_circle</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">¡Reporte Enviado!</h2>
                            <p className="text-gov-grey">Tu reporte fue recibido exitosamente.</p>
                        </div>

                        <div className="bg-gov-surface border border-gov-primary/20 rounded-2xl p-6 text-left max-w-xs mx-auto">
                            <p className="text-gov-grey text-xs uppercase tracking-widest mb-1">Folio de seguimiento</p>
                            <p className="text-gov-primary font-bold text-2xl tracking-wider">{folio}</p>
                            <p className="text-gov-grey text-xs mt-2">Categoría: <span className="text-white">{selectedCategory}</span></p>
                            {photos.length > 0 && (
                                <p className="text-gov-grey text-xs mt-1">{photos.length} foto{photos.length !== 1 ? "s" : ""} adjunta{photos.length !== 1 ? "s" : ""}</p>
                            )}
                        </div>

                        <p className="text-gov-grey text-sm">Puedes dar seguimiento en <span className="text-gov-primary font-bold">Mis Reportes</span></p>

                        <div className="flex flex-col gap-3 pt-4">
                            <Link href="/citizen/activity">
                                <button className="w-full bg-gov-primary text-gov-bg font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors">
                                    Ver mis reportes
                                </button>
                            </Link>
                            <Link href="/citizen">
                                <button className="w-full text-white/60 hover:text-white text-sm transition-colors">
                                    Volver al inicio
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
