"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        curp: "",
        notifications: true
    });

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { router.replace("/"); return; }
            const u = session.user;
            setUser(u);
            setFormData({
                phone: u.user_metadata?.phone || "",
                address: u.user_metadata?.address || "",
                curp: u.user_metadata?.curp || "",
                notifications: u.user_metadata?.notifications ?? true
            });
            setLoading(false);
        };
        load();
    }, [router]);

    const handleSave = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.updateUser({
            data: {
                ...formData,
                full_name: editingName || fullName // Update name if changed
            }
        });
        
        if (!error) {
            setUser(data.user);
            setIsEditing(false);
        } else {
            console.error("Error saving profile:", error);
            alert("Hubo un error al guardar los cambios.");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };

    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Ciudadano";
    const [editingName, setEditingName] = useState("");
    
    // Sync editingName when entering edit mode
    useEffect(() => {
        if (isEditing) setEditingName(fullName);
    }, [isEditing, fullName]);

    const email = user?.email || "";
    const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

    if (loading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gov-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 space-y-6 pt-16 md:pt-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 px-2">
                <Link href="/citizen" className="p-2 rounded-full bg-gov-surface/50 border border-gov-light text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center justify-center py-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gov-primary to-emerald-600 p-[2px] shadow-lg shadow-gov-primary/10">
                    {avatar ? (
                        <img src={avatar} alt="Foto de perfil" className="w-full h-full rounded-full border-4 border-gov-bg object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-full h-full rounded-full border-4 border-gov-bg bg-gov-surface flex items-center justify-center">
                            <span className="material-symbols-outlined text-gov-grey text-4xl">person</span>
                        </div>
                    )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{fullName}</h2>
                <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-gov-primary text-sm">verified</span>
                    <span className="text-sm text-gov-grey">Ciudadano Verificado</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Datos de Identidad */}
                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 border-b border-gov-light/30 pb-3">
                        <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider">Información Personal</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold transition-all ${isEditing ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-gov-primary/10 text-gov-primary border border-gov-primary/20 hover:bg-gov-primary/20'}`}
                        >
                            <span className="material-symbols-outlined text-sm">{isEditing ? "close" : "edit"}</span>
                            {isEditing ? "Cancelar" : "Editar Datos"}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gov-grey">Nombre Completo</label>
                            <div className="flex justify-between items-center border-b border-gov-light/30">
                                <input
                                    type="text"
                                    value={isEditing ? editingName : fullName}
                                    onChange={e => setEditingName(e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full bg-transparent text-white font-medium outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                                />
                                <span className="material-symbols-outlined text-gov-grey text-sm">
                                    {isEditing ? "edit" : "lock"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gov-grey">Correo Electrónico</label>
                            <div className="flex justify-between items-center border-b border-gov-light/30">
                                <p className="text-white font-medium py-1 opacity-70">{email}</p>
                                <span className="material-symbols-outlined text-gov-grey text-sm">lock</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gov-grey">CURP</label>
                            <input
                                type="text"
                                value={formData.curp}
                                onChange={e => setFormData(p => ({ ...p, curp: e.target.value }))}
                                disabled={!isEditing}
                                placeholder={isEditing ? "Ingresa tu CURP" : "No registrado"}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="bg-gov-surface/50 backdrop-blur-md border border-gov-light/50 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4 border-b border-gov-light/30 pb-2">Contacto</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gov-grey">Teléfono Celular</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                disabled={!isEditing}
                                placeholder={isEditing ? "Ingresa tu teléfono" : "No registrado"}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gov-grey">Dirección Principal</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                                disabled={!isEditing}
                                placeholder={isEditing ? "Ingresa tu dirección" : "No registrada"}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-gov-primary text-gov-bg font-extrabold py-4 rounded-xl shadow-lg shadow-gov-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-gov-bg border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined">save</span>
                                Guardar Cambios
                            </>
                        )}
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full py-4 text-red-400 font-medium text-sm flex items-center justify-center gap-2 hover:text-red-300 transition-colors"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
