
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase";

interface Department {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export default function InviteDirectorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDept, setSelectedDept] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [inviteLink, setInviteLink] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
            setInviteLink("");
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        const { data } = await supabase.from("departments").select("*");
        if (data) setDepartments(data);
    };

    const generateInvite = async () => {
        if (!selectedDept) return;
        setLoading(true);

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        const { error } = await supabase.from("crew_invitations").insert({
            department_id: selectedDept,
            token,
            email: email || null,
        });

        if (!error) {
            const link = `${window.location.origin}/invitacion/${token}`;
            setInviteLink(link);
        } else {
            console.error("Error creating invite:", error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gov-bg/80 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative bg-gov-surface border border-gov-light rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute top-6 right-6 text-gov-grey hover:text-white transition-colors z-10">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-gov-primary">person_add</span>
                        Invitar Director
                    </h2>
                    <p className="text-gov-grey text-sm mt-1">Genera un enlace de acceso para el jefe de cuadrilla.</p>
                </div>

                {!inviteLink ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gov-grey uppercase tracking-widest mb-2">Departamento</label>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {departments.map((dept) => (
                                    <button
                                        key={dept.id}
                                        onClick={() => setSelectedDept(dept.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedDept === dept.id ? "bg-gov-primary/10 border-gov-primary text-gov-primary" : "bg-gov-bg border-gov-light text-white hover:border-gov-grey"}`}
                                    >
                                        <span className="material-symbols-outlined">{dept.icon}</span>
                                        <span className="font-bold text-sm">{dept.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gov-grey uppercase tracking-widest mb-2">Correo (Opcional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="director@municipio.gob.mx"
                                className="w-full bg-gov-bg border border-gov-light rounded-xl px-4 py-3 text-white outline-none focus:border-gov-primary transition-colors"
                            />
                        </div>

                        <button
                            onClick={generateInvite}
                            disabled={loading || !selectedDept}
                            className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-gov-bg border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">link</span>
                                    Generar Enlace de Acceso
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                            <span className="material-symbols-outlined text-emerald-400 text-4xl mb-2">check_circle</span>
                            <p className="text-white font-bold">¡Enlace Generado!</p>
                            <p className="text-gov-grey text-xs mt-1">Comparte este enlace con el director para que active su panel.</p>
                        </div>

                        <div className="bg-gov-bg border border-gov-light rounded-xl p-4 break-all font-mono text-[10px] text-gov-primary select-all">
                            {inviteLink}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(inviteLink);
                                    alert("Copiado al portapapeles");
                                }}
                                className="bg-gov-surface border border-gov-light text-white font-bold py-4 rounded-2xl hover:bg-gov-light transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                Copiar
                            </button>

                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                    `¡Hola! Te invito a gestionar tu panel de cuadrilla en Governia. Haz clic aquí para activar tu cuenta: ${inviteLink}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] text-gov-bg font-bold py-4 rounded-2xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5" alt="WA" />
                                WhatsApp
                            </a>
                        </div>

                        <button
                            onClick={() => setInviteLink("")}
                            className="w-full text-gov-grey text-xs hover:text-white transition-colors"
                        >
                            Generar otro para otro departamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
