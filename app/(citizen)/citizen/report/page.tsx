"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReportPage() {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        { icon: "lightbulb", label: "Alumbrado", color: "text-yellow-400", glow: "shadow-yellow-400/50", border: "border-yellow-400" },
        { icon: "water_drop", label: "Fuga de Agua", color: "text-blue-400", glow: "shadow-blue-400/50", border: "border-blue-400" },
        { icon: "delete", label: "Basura", color: "text-gray-400", glow: "shadow-gray-400/50", border: "border-gray-400" },
        { icon: "edit_road", label: "Baches", color: "text-orange-400", glow: "shadow-orange-400/50", border: "border-orange-400" },
        { icon: "security", label: "Seguridad", color: "text-red-400", glow: "shadow-red-400/50", border: "border-red-400" },
        { icon: "nature", label: "Parques", color: "text-green-400", glow: "shadow-green-400/50", border: "border-green-400" },
    ];

    const handleSubmit = async () => {
        setSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setStep(3);
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
            </div>

            <div className="p-5 space-y-8">

                {step === 1 && (
                    <>
                        <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-white leading-tight">¿Qué te gustaría <br /><span className="text-gov-primary">reportar hoy?</span></h2>
                            <p className="text-gov-grey text-sm">Selecciona la categoría que mejor describa el problema.</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {categories.map((cat, i) => {
                                    const isSelected = selectedCategory === cat.label;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedCategory(cat.label)}
                                            className={`relative bg-gov-surface border group p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? `${cat.border} border-2 shadow-[0_0_30px_-5px] ${cat.glow} scale-[1.02]` : 'border-gov-light hover:border-gov-primary/50 hover:bg-gov-surface/80'}`}
                                        >
                                            {isSelected && (
                                                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full ${cat.color.replace('text-', 'bg-')} flex items-center justify-center`}>
                                                    <span className="material-symbols-outlined text-[14px] text-gov-bg font-bold">check</span>
                                                </div>
                                            )}

                                            <div className={`w-14 h-14 rounded-full bg-gov-bg flex items-center justify-center border border-gov-light transition-transform duration-300 ${isSelected ? 'scale-110 border-transparent ring-2 ring-offset-2 ring-offset-gov-surface ' + cat.color.replace('text-', 'ring-') : 'group-hover:scale-110'} ${cat.color}`}>
                                                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white font-bold' : 'text-gov-grey group-hover:text-white'}`}>{cat.label}</span>
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
                                        ? 'bg-gov-primary text-gov-bg shadow-[0_0_20px_rgba(27,218,91,0.4)] hover:shadow-[0_0_30px_rgba(27,218,91,0.6)] active:scale-95 cursor-pointer'
                                        : 'bg-gov-surface border border-gov-light text-gov-grey/50 cursor-not-allowed grayscale'
                                    }`}
                            >
                                Continuar
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                        <h2 className="text-2xl font-bold text-white">Detalles del Reporte</h2>

                        {/* Mock Map */}
                        <div className="bg-gov-surface border border-gov-light rounded-2xl h-48 relative overflow-hidden flex items-center justify-center">
                            <span className="material-symbols-outlined text-6xl text-gov-grey/30">map</span>
                            <div className="absolute inset-0 bg-gradient-to-t from-gov-surface via-transparent to-transparent"></div>
                            <p className="absolute bottom-4 text-gov-grey text-sm">Ubicación aproximada detectada</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gov-grey font-bold uppercase">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gov-surface border border-gov-light rounded-xl p-4 text-white focus:border-gov-primary focus:outline-none min-h-[120px]"
                                placeholder="Describe el problema con más detalle..."
                            ></textarea>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(27,218,91,0.4)] mt-4 disabled:opacity-50"
                        >
                            {submitting ? "Enviando..." : "Enviar Reporte"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center pt-10 animate-in zoom-in duration-500">
                        <span className="material-symbols-outlined text-8xl text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">check_circle</span>
                        <h2 className="text-3xl font-bold text-white mb-2">¡Reporte Enviado!</h2>
                        <p className="text-gov-grey mb-8">Tu folio es #REP-{Math.floor(Math.random() * 10000)}</p>
                        <Link href="/citizen">
                            <button className="text-white underline hover:text-gov-primary transition-colors">Volver al inicio</button>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
