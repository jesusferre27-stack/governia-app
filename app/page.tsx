import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1116] flex flex-col items-center justify-center p-8 relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#1bda5b]/10 via-[#0B1116] to-[#0B1116]"></div>

      <div className="relative z-10 max-w-2xl w-full space-y-12 text-center">

        <div className="space-y-4 animate-in zoom-in duration-700">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#1bda5b] to-emerald-700 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(27,218,91,0.3)] mb-6">
            <span className="material-symbols-outlined text-black text-5xl">shield</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">GOVERNIA</h1>
          <p className="text-xl text-gray-400">Plataforma de Gobierno Digital Inteligente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Staff Card */}
          <Link href="/dashboard" className="group">
            <div className="bg-[#151F26] border border-gray-800 p-8 rounded-3xl hover:border-[#1bda5b] transition-all hover:shadow-[0_0_30px_rgba(27,218,91,0.1)] h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1C262E] flex items-center justify-center group-hover:bg-[#1bda5b] transition-colors">
                <span className="material-symbols-outlined text-white text-3xl group-hover:text-black">admin_panel_settings</span>
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl">Staff / Alcaldía</h3>
                <p className="text-gray-500 text-sm mt-2">Panel administrativo y gestión de operarios</p>
              </div>
            </div>
          </Link>

          {/* Citizen Card */}
          <Link href="/citizen" className="group">
            <div className="bg-[#151F26] border border-gray-800 p-8 rounded-3xl hover:border-[#1bda5b] transition-all hover:shadow-[0_0_30px_rgba(27,218,91,0.1)] h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1C262E] flex items-center justify-center group-hover:bg-[#1bda5b] transition-colors">
                <span className="material-symbols-outlined text-white text-3xl group-hover:text-black">smartphone</span>
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl">App Ciudadana</h3>
                <p className="text-gray-500 text-sm mt-2">Simulación móvil para el ciudadano</p>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-gray-600 text-sm font-mono">v2.4.0 • Build Sprint</p>

      </div>

    </div>
  );
}