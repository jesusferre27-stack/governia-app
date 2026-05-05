"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase";

export default function CitizenLoginPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/citizen`,
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Error Google OAuth:', error);
            setErrorMsg(error.message || 'Error al iniciar sesión con Google');
            setLoading(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-[#071a2e]" />;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#071a2e] text-white">
            <h1 className="text-3xl font-black text-[#22c55e] mb-8">GOVERNIA</h1>

            <div className="w-full max-w-[400px] bg-[#0f172a] rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
                <h2 className="text-2xl font-bold mb-2">Portal Ciudadano</h2>
                <p className="text-slate-400 text-sm mb-8">Ingreso premium con Google</p>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-[55px] bg-white text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                >
                    <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs">G</span>
                    {loading ? "Conectando..." : "Entrar o Registrarse con Google"}
                </button>
                <p className="text-[10px] text-slate-500 mt-4 italic">No necesitas cuenta previa</p>

                {errorMsg && <p className="text-red-400 text-xs mt-4 bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>}

                <div className="mt-8 pt-6 border-t border-white/5">
                    <Link href="/" className="text-white/40 text-xs hover:text-[#22c55e]">Volver al inicio</Link>
                </div>
            </div>
        </div>
    );
}
