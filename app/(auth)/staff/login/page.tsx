"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/app/supabase";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError(signInError.message);
            setLoading(false);
            return;
        }
        router.push("/staff/dashboard");
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
            <h1 className="text-3xl font-black text-[#22c55e] tracking-tight mb-8 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-fade-up duration-700">
                GOVERNIA
            </h1>

            <div
                className="w-full max-w-[400px] rounded-3xl p-8 md:p-10 flex flex-col relative z-10 animate-fade-in duration-500"
                style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.55)'
                }}
            >
                {/* Card Header Institutional */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div
                      className="h-16 w-36 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 gap-1 mb-4 cursor-pointer hover:border-white/30 transition-colors group"
                      title="Aquí va el logo de tu municipio"
                    >
                      <span className="material-symbols-outlined text-2xl text-white/30 group-hover:text-white/50 transition-colors">account_balance</span>
                      <span className="text-white/20 text-[8px] uppercase tracking-widest group-hover:text-white/35 transition-colors">Tu municipio</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Acceso de Funcionarios</h2>
                    <p className="text-slate-400 text-sm font-medium">Sistema municipal • Gobierno Digital</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 flex-1">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white/90 ml-1">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#22c55e] transition-colors">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white text-base focus:border-[#22c55e]/50 focus:ring-4 focus:ring-[#22c55e]/10 focus:outline-none transition-all placeholder-white/20"
                                placeholder="funcionario@municipio.gob.mx"
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

                    {error && <p className="text-red-400 text-xs text-center font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full h-[52px] bg-[#22c55e] hover:brightness-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-[#04101f] font-bold rounded-2xl text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Verificando..." : "Iniciar sesión"}
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
