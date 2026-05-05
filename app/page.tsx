"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-center font-sans py-12 px-4 md:px-6 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 0%, #112240 0%, #071a2e 100%)`
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-blue-400/20 rounded-full animate-float delay-100 blur-[1px]"></div>
        <div className="absolute top-[60%] left-[20%] w-3 h-3 bg-emerald-400/10 rounded-full animate-float delay-700 blur-[2px]"></div>
        <div className="absolute top-[30%] right-[15%] w-2 h-2 bg-cyan-400/20 rounded-full animate-float delay-300 blur-[1px]"></div>
        <div className="absolute bottom-[20%] right-[25%] w-4 h-4 bg-gov-primary/10 rounded-full animate-float delay-500 blur-[4px]"></div>
      </div>

      {/* Header Content */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8 md:gap-16">

        {/* Main Brand Header */}
        <div className="text-center space-y-6">
          {/* Logos Combined - FADE IN */}
          <div className="flex flex-col items-center justify-center gap-3 animate-fade-in duration-1000">
            <div className="flex items-center justify-center gap-6 opacity-90">
              <div
                className="h-32 md:h-44 w-36 md:w-52 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm gap-2 hover:border-white/40 transition-colors group"
                title="Aquí puede ir el logotipo de tu municipio"
              >
                <span className="material-symbols-outlined text-5xl text-white/30 group-hover:text-white/50 transition-colors">account_balance</span>
                <span className="text-white/25 text-[9px] uppercase tracking-widest text-center leading-tight px-3 group-hover:text-white/40 transition-colors">Logotipo de tu<br />municipio aquí</span>
              </div>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2"></div>
            <span className="text-white/70 text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-shadow-sm">Gobierno Municipal Digital</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#22c55e] tracking-tight drop-shadow-[0_0_25px_rgba(34,197,94,0.4)] animate-fade-up delay-200 duration-1000">
              GOVERNIA
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide animate-fade-up delay-500 duration-1000">
              Portal Municipal
            </h2>
          </div>

          <p className="text-slate-400 font-medium max-w-lg mx-auto text-sm md:text-base animate-fade-up delay-700 duration-1000">
            Trámites y reportes digitales para <span className="text-emerald-200 font-bold">tu municipio</span>
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4 animate-fade-up delay-1000 duration-1000">

          {/* Staff Card */}
          <Link href="/staff/login" className="group h-full w-full">
            <div
              className="h-full w-full rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 
                         border border-white/5 bg-white/[0.03] backdrop-blur-xl shadow-2xl
                         group-hover:scale-105 group-hover:border-gov-primary/30 group-hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)]
                         relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl flex items-center justify-center mb-6 
                              group-hover:bg-gov-primary/20 transition-all duration-500 border border-white/10 group-hover:border-gov-primary/50 group-hover:rotate-3">
                <span className="material-symbols-outlined text-4xl text-white/90 group-hover:text-gov-primary transition-colors">admin_panel_settings</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gov-primary transition-colors">Funcionarios</h3>
              <p className="text-sm text-slate-400 mb-8 px-4 leading-relaxed group-hover:text-slate-300 transition-colors">
                Acceso administrativo para gestión operativa, monitoreo de incidentes y servicios municipales.
              </p>

              <div className="mt-auto w-full relative group/btn">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-gov-primary rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative flex items-center justify-center w-full h-[56px] bg-[#22c55e] text-[#04101f] font-bold rounded-2xl text-lg 
                              overflow-hidden transition-all active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-2">
                    Ingresar <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                  </span>
                  {/* Shine Effect */}
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover/btn:animate-shine"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* Citizen Card */}
          <Link href="/citizen/login" className="group h-full w-full">
            <div
              className="h-full w-full rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-500 
                         border border-white/5 bg-white/[0.03] backdrop-blur-xl shadow-2xl
                         group-hover:scale-105 group-hover:border-blue-400/30 group-hover:shadow-[0_20px_40px_rgba(96,165,250,0.1)]
                         relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl flex items-center justify-center mb-6 
                              group-hover:bg-blue-500/20 transition-all duration-500 border border-white/10 group-hover:border-blue-400/50 group-hover:-rotate-3">
                <span className="material-symbols-outlined text-4xl text-white/90 group-hover:text-blue-400 transition-colors">smartphone</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Ciudadanos</h3>
              <p className="text-sm text-slate-400 mb-8 px-4 leading-relaxed group-hover:text-slate-300 transition-colors">
                Realiza tus reportes, consulta trámites y accede a servicios digitales desde cualquier lugar.
              </p>

              <div className="mt-auto w-full relative group/btn">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative flex items-center justify-center w-full h-[56px] bg-blue-500 text-white font-bold rounded-2xl text-lg 
                              overflow-hidden transition-all active:scale-[0.98]">
                  <span className="relative z-10 flex items-center gap-2">
                    Acceder <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                  </span>
                  {/* Shine Effect */}
                  <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover/btn:animate-shine"></div>
                </div>
              </div>
            </div>
          </Link>

        </div>

        <div className="mt-12 opacity-40 animate-fade-in delay-1000 duration-1000">
          <p className="text-[10px] text-slate-500 font-mono tracking-[0.3em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Plataforma Oficial v3.5
          </p>
        </div>
      </div>
    </div>
  );
}