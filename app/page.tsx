"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center font-sans -mb-1"
      style={{
        background: `
                    radial-gradient(900px 500px at 50% 0%, rgba(255,255,255,0.05), transparent 60%),
                    linear-gradient(180deg, #071a2e 0%, #04101f 100%)
                `
      }}
    >

      {/* Header Content */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center gap-8 md:gap-12">

        {/* Main Brand Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Logos Combined */}
          <div className="flex items-center justify-center gap-4 opacity-80 mb-2">
            <img src="/logo-soteapan.png" alt="Soteapan" className="h-8 w-auto object-contain brightness-200 contrast-0 grayscale opacity-70" />
            <div className="h-4 w-px bg-white/20"></div>
            <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Ayuntamiento Constitucional</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-[#22c55e] tracking-tight drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            GOVERNIA
          </h1>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            Portal Municipal
          </h2>
          <p className="text-slate-400 font-medium max-w-lg mx-auto">
            Trámites y reportes digitales para <span className="text-slate-200">Soteapan, Veracruz</span>
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-2">

          {/* Staff Card */}
          <Link href="/staff/login" className="group h-full">
            <div
              className="h-full rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.55)'
              }}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5">
                <span className="material-symbols-outlined text-3xl text-white/80">admin_panel_settings</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Funcionarios</h3>
              <p className="text-sm text-slate-400 mb-8 px-2 leading-relaxed">
                Acceso administrativo para gestión de reportes y servicios.
              </p>

              <div className="mt-auto w-full">
                <span className="flex items-center justify-center w-full h-[52px] bg-[#22c55e] hover:brightness-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-[#04101f] font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
                  Ingresar
                </span>
              </div>
            </div>
          </Link>

          {/* Citizen Card */}
          <Link href="/citizen/login" className="group h-full">
            <div
              className="h-full rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.55)'
              }}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors border border-white/5">
                <span className="material-symbols-outlined text-3xl text-white/80">smartphone</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Ciudadanos</h3>
              <p className="text-sm text-slate-400 mb-8 px-2 leading-relaxed">
                Realiza tus trámites y reportes desde cualquier lugar.
              </p>

              <div className="mt-auto w-full">
                <span className="flex items-center justify-center w-full h-[52px] bg-[#22c55e] hover:brightness-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-[#04101f] font-bold rounded-2xl text-base transition-all active:scale-[0.98]">
                  Acceder
                </span>
              </div>
            </div>
          </Link>

        </div>

        <div className="absolute bottom-6 opacity-30">
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Plataforma Oficial v3.0
          </p>
        </div>
      </div>
    </div>
  );
}