"use client";

import Link from "next/link";

export default function ContactCardPage() {
    return (
        <div className="min-h-screen bg-gov-bg flex flex-col items-center relative overflow-x-hidden font-sans">

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-gov-primary/10 to-transparent opacity-50"></div>
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <main className="w-full max-w-md mx-auto px-6 py-10 relative z-10 flex flex-col gap-8 pb-20">

                {/* 1. Profile / Header */}
                <div className="flex flex-col items-center text-center animate-fade-up">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-gov-primary via-emerald-400 to-blue-500 mb-6 shadow-[0_0_40px_rgba(27,218,91,0.3)] relative group">
                        <div className="w-full h-full rounded-full bg-gov-surface overflow-hidden relative">
                            {/* Placeholder for User Photo - You can replace src later */}
                            <img
                                src="/logo-governia.png"
                                alt="Governia Logo"
                                className="w-full h-full object-cover p-0 opacity-100 group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-gov-bg border-4 border-gov-bg rounded-full p-2">
                            <img src="/logo-governia.png" alt="GovTech" className="w-8 h-8 object-contain" />
                            {/* Fallback icon if logo not loaded yet */}
                            {/* <span className="material-symbols-outlined text-gov-primary">verified</span> */}
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                        L.C.C. Jesús Hernández
                    </h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-surface border border-gov-light/50 backdrop-blur-md mb-4 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-gov-primary animate-pulse"></span>
                        <span className="text-xs font-bold text-gov-primary tracking-wide uppercase">DIRECTOR GENERAL GOVERNIA</span>
                    </div>
                </div>

                {/* 2. Quick Actions */}
                <div className="grid grid-cols-2 gap-4 animate-fade-up delay-100">
                    <a
                        href="https://wa.me/529221739694?text=Hola%20Director,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20la%20plataforma%20Governia."
                        target="_blank"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all active:scale-95 group"
                    >
                        <span className="material-symbols-outlined text-3xl text-[#25D366] group-hover:scale-110 transition-transform">chat</span>
                        <span className="text-sm font-bold text-white">WhatsApp</span>
                    </a>
                    <a
                        href="tel:9222093996"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all active:scale-95 group"
                    >
                        <span className="material-symbols-outlined text-3xl text-blue-400 group-hover:scale-110 transition-transform">call</span>
                        <span className="text-sm font-bold text-white">Llamar</span>
                    </a>
                </div>

                {/* 3. The Pitch - "Valor para el Alcalde" */}
                <div className="bg-gov-surface/60 backdrop-blur-xl border border-gov-light rounded-3xl p-6 relative overflow-hidden animate-fade-up delay-200 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gov-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gov-accent">campaign</span>
                            ¿Por qué Governia?
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                                    <span className="material-symbols-outlined text-xl">savings</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Ahorro Inteligente</h3>
                                    <p className="text-xs text-gov-grey mt-0.5">Reduce carga administrativa y optimiza el personal operativo.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                                    <span className="material-symbols-outlined text-xl">visibility</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Control Total</h3>
                                    <p className="text-xs text-gov-grey mt-0.5">Monitorea opinión pública y avance de obras en tiempo real.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Implementación Fast-Track</h3>
                                    <p className="text-xs text-gov-grey mt-0.5">Despliegue completo y capacitación en semanas, no meses.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Demos Links */}
                <div className="space-y-3 animate-fade-up delay-300">
                    <p className="text-center text-xs text-gov-grey font-bold uppercase tracking-widest mb-2">Accesos Demo</p>

                    <Link href="/citizen/login" className="block relative group overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <span className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <span className="material-symbols-outlined">smartphone</span>
                                </span>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Portal Ciudadano</p>
                                    <p className="text-[10px] opacity-80">Reportes y trámites digitales</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-white group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </Link>

                    <Link href="/staff/login" className="block relative group overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-gov-primary opacity-90 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gov-bg">
                                <span className="p-2 bg-black/10 rounded-lg backdrop-blur-sm">
                                    <span className="material-symbols-outlined">admin_panel_settings</span>
                                </span>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Panel de Gobierno</p>
                                    <p className="text-[10px] font-medium opacity-80">Gestión y toma de decisiones</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gov-bg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 animate-fade-in delay-500">
                    <p className="text-[10px] text-gov-grey">Governia © 2026. Transformación Digital.</p>
                </div>

            </main>
        </div>
    );
}
