"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function CitizenLoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
            return;
        }
        window.location.href = "/citizen";
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { role: 'citizen', full_name: email.split('@')[0] } }
        });

        setLoading(false);

        if (error) {
            setErrorMsg(error.message);
        } else if (data.session) {
            window.location.href = "/citizen";
        } else {
            alert("¡Registro creado! Verifica tu correo.");
            setMode('login');
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (mode === 'login') return handleLogin(e);
        return handleRegister(e);
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-x-hidden font-sans"
            style={{
                background: `
                    radial-gradient(900px 500px at 50% 0%, rgba(255,255,255,0.05), transparent 60%),
                    linear-gradient(180deg, #071a2e 0%, #04101f 100%)
                `
            }}
        >
            {/* Top Brand */}
            <h1 className="text-3xl font-black text-[#22c55e] tracking-tight mb-8 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-in slide-in-from-top-4 duration-700">
                GOVERNIA
            </h1>

            <div
                className="w-full max-w-[400px] rounded-3xl p-8 md:p-10 flex flex-col relative z-10 animate-in zoom-in duration-500"
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)'
                }}
            >
                {/* Card Header Institutional */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <img src="/logo-soteapan.png" alt="Soteapan" className="h-7 w-auto object-contain mb-4 opacity-90 brightness-150" />
                    <h2 className="text-2xl font-bold text-white mb-1">Portal Ciudadano</h2>
                    <p className="text-slate-400 text-sm font-medium">Trámites y reportes del Ayuntamiento</p>
                </div>

                {/* Switcher */}
                <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5">
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all ${mode === 'login' ? 'bg-[#22c55e] text-[#04101f] shadow-lg shadow-green-900/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        Ingresar
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all ${mode === 'register' ? 'bg-[#22c55e] text-[#04101f] shadow-lg shadow-green-900/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        Registrarse
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/90 ml-1">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#22c55e] transition-colors">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-base focus:border-[#22c55e]/50 focus:ring-4 focus:ring-[#22c55e]/10 focus:outline-none transition-all placeholder-white/20"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/90 ml-1">Contraseña</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#22c55e] transition-colors">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-base focus:border-[#22c55e]/50 focus:ring-4 focus:ring-[#22c55e]/10 focus:outline-none transition-all placeholder-white/20"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {errorMsg && <p className="text-red-400 text-xs text-center font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-pulse">{errorMsg}</p>}

                    <div className="pt-2">
                        <button type="submit" disabled={loading} className="w-full h-[52px] bg-[#22c55e] hover:brightness-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-[#04101f] font-bold rounded-2xl text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Procesando..." : (mode === 'login' ? "Entrar" : "Crear Cuenta")}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link href="/" className="text-white/40 text-xs hover:text-[#22c55e] transition-colors font-medium">
                            Volver al inicio
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
