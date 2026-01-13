import Link from "next/link";

export default function ReportPage() {
    return (
        <div className="bg-gov-bg min-h-full pb-20 animate-in slide-in-from-bottom-5 duration-500">
            {/* App Bar */}
            <div className="bg-gov-surface/80 backdrop-blur-md sticky top-0 z-40 p-4 flex items-center gap-4 border-b border-gov-light">
                <Link href="/citizen" className="text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-lg font-bold text-white">Nuevo Reporte</h1>
            </div>

            <div className="p-5 space-y-8">

                {/* Progress Stepper */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-gov-primary shadow-[0_0_10px_rgba(27,218,91,0.5)]"></div>
                    <div className="w-12 h-0.5 bg-gov-light"></div>
                    <div className="w-3 h-3 rounded-full bg-gov-light"></div>
                    <div className="w-12 h-0.5 bg-gov-light"></div>
                    <div className="w-3 h-3 rounded-full bg-gov-light"></div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white leading-tight">¿Qué te gustaría <br /><span className="text-gov-primary">reportar hoy?</span></h2>
                    <p className="text-gov-grey text-sm">Selecciona la categoría que mejor describa el problema.</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: "lightbulb", label: "Alumbrado", color: "text-yellow-400" },
                        { icon: "water_drop", label: "Fuga de Agua", color: "text-blue-400" },
                        { icon: "delete", label: "Basura", color: "text-gray-400" },
                        { icon: "pothole", label: "Baches", color: "text-orange-400" },
                        { icon: "security", label: "Seguridad", color: "text-red-400" },
                        { icon: "nature", label: "Parques", color: "text-green-400" },
                    ].map((cat, i) => (
                        <button key={i} className="bg-gov-surface border border-gov-light hover:border-gov-primary/50 group p-4 rounded-2xl flex flex-col items-center gap-3 transition-all hover:bg-gov-surface/80">
                            <div className={`w-12 h-12 rounded-full bg-gov-bg flex items-center justify-center border border-gov-light group-hover:scale-110 transition-transform ${cat.color}`}>
                                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                            </div>
                            <span className="text-sm font-medium text-gov-grey group-hover:text-white transition-colors">{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <div className="pt-4">
                    <button className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(27,218,91,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        Continuar
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
