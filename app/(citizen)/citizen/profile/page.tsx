"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    // Mock user data (In real implementation, fetch from Supabase auth)
    const [formData, setFormData] = useState({
        name: "Carlos Hernández",
        email: "carlos.hdz@example.com",
        phone: "555-0199-8822",
        address: "Calle Benito Juárez #45, Centro",
        curp: "HEGC890120HDFRRN09",
        notifications: true
    });

    return (
        <div className="min-h-screen pb-24 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 rounded-full bg-gov-surface/50 border border-gov-light text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="ml-auto text-gov-primary font-bold text-sm"
                >
                    {isEditing ? "Cancelar" : "Editar"}
                </button>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center py-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gov-primary to-emerald-600 p-[2px]">
                        <img
                            src="https://i.pravatar.cc/150?img=11"
                            alt="Profile"
                            className="w-full h-full rounded-full border-4 border-gov-bg object-cover"
                        />
                    </div>
                    {isEditing && (
                        <button className="absolute bottom-0 right-0 p-2 bg-gov-surface border border-gov-light rounded-full text-gov-primary shadow-lg">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                    )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{formData.name}</h2>
                <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-gov-primary text-sm">verified</span>
                    <span className="text-sm text-gov-grey">Ciudadano Verificado</span>
                </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
                {/* Personal Data */}
                <div className="bg-gov-surface/50 backdrop-blur-md border border-gov-light/50 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4 border-b border-gov-light/30 pb-2">Información Personal</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gov-grey">Nombre Completo</label>
                            <input
                                type="text"
                                value={formData.name}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gov-grey">CURP</label>
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    value={formData.curp}
                                    disabled
                                    className="w-full bg-transparent text-white font-medium border-b border-transparent py-1 opacity-70"
                                />
                                <span className="material-symbols-outlined text-gov-primary text-sm">lock</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gov-grey">Correo Electrónico</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Data */}
                <div className="bg-gov-surface/50 backdrop-blur-md border border-gov-light/50 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4 border-b border-gov-light/30 pb-2">Contacto</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gov-grey">Teléfono Celular</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gov-grey">Dirección Principal</label>
                            <input
                                type="text"
                                value={formData.address}
                                disabled={!isEditing}
                                className="w-full bg-transparent text-white font-medium border-b border-gov-light/30 focus:border-gov-primary outline-none py-1 disabled:opacity-70 disabled:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-gov-surface/50 backdrop-blur-md border border-gov-light/50 rounded-2xl p-5 mb-8">
                    <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4 border-b border-gov-light/30 pb-2">Configuración</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-white font-medium">Notificaciones Push</span>
                            <span className="text-xs text-gov-grey">Alertas de trámites y seguridad</span>
                        </div>
                        <div
                            onClick={() => isEditing && setFormData(prev => ({ ...prev, notifications: !prev.notifications }))}
                            className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${formData.notifications ? "bg-gov-primary" : "bg-gov-light"}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${formData.notifications ? "translate-x-6" : "translate-x-0"}`}></div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <button
                        onClick={() => setIsEditing(false)}
                        className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl shadow-lg shadow-gov-primary/20 sticky bottom-24 animate-in slide-in-from-bottom-4"
                    >
                        Guardar Cambios
                    </button>
                )}

                <button className="w-full py-4 text-gov-danger font-medium text-sm flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
