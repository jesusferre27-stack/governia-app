"use client";

import { useState } from "react";
import { supabase } from "./supabase"; // Importamos el puente que creamos

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Consultamos tu tabla de Flutter 'app_users'
    const { data, error } = await supabase
      .from("app_users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      alert("Error: Usuario no encontrado en la base de datos municipal.");
    } else {
      // Aquí podrías validar la contraseña o usar el sistema de Auth de Supabase
      alert(`¡Bienvenido, ${data.full_name || 'Funcionario'}! Acceso concedido.`);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-[#0d1b2a] font-sans">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h1 className="text-[#1bda5b] text-[32px] font-bold leading-tight">GOVERNIA</h1>
        </header>
        
        <main className="bg-[#1b263b] p-8 rounded-xl shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[#e0e1dd] text-sm font-medium pb-2">Email Address</label>
              <input 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg text-[#e0e1dd] border border-[#415a77] bg-[#2a364a] h-14 p-3.5 outline-none focus:border-[#1bda5b]"
                placeholder="tu@municipio.gov" 
                type="email" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#e0e1dd] text-sm font-medium pb-2">Password</label>
              <input 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg text-[#e0e1dd] border border-[#415a77] bg-[#2a364a] h-14 p-3.5 outline-none focus:border-[#1bda5b]"
                placeholder="••••••••••••" 
                type="password" 
              />
            </div>

            <button 
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#1bda5b] h-14 px-6 text-base font-semibold text-[#0d1b2a] hover:brightness-110 transition-all disabled:opacity-50" 
              type="submit"
            >
              {loading ? "Verificando..." : "Login"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}