
import Link from "next/link";

export default function CitizenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-[#000] flex justify-center items-center">
            {/* Mobile Emulator/Frame */}
            <div className="w-full max-w-[400px] bg-gov-bg h-[850px] max-h-[100vh] border border-gov-light relative overflow-hidden flex flex-col shadow-2xl">
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {children}
                </div>

                {/* Bottom Nav */}
                <div className="h-20 bg-gov-surface/90 backdrop-blur-xl border-t border-gov-light flex items-center justify-around px-2 shrink-0 z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                    <Link href="/citizen" className="flex flex-col items-center gap-1 p-2 text-gov-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl drop-shadow-[0_0_5px_rgba(27,218,91,0.5)]">home</span>
                        <span className="text-[10px] font-bold tracking-wide">Inicio</span>
                    </Link>
                    <Link href="/citizen/activity" className="flex flex-col items-center gap-1 p-2 text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">history</span>
                        <span className="text-[10px] font-medium">Actividad</span>
                    </Link>
                    <Link href="/citizen/report" className="flex items-center justify-center -mt-8 bg-gradient-to-tr from-gov-primary to-emerald-400 text-gov-bg rounded-full w-16 h-16 shadow-[0_0_20px_rgba(27,218,91,0.6)] border-4 border-gov-bg hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">add</span>
                    </Link>
                    <Link href="/citizen/procedures" className="flex flex-col items-center gap-1 p-2 text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">assignment</span>
                        <span className="text-[10px] font-medium">Trámites</span>
                    </Link>
                    <Link href="/citizen/profile" className="flex flex-col items-center gap-1 p-2 text-gov-grey hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-2xl">person</span>
                        <span className="text-[10px] font-medium">Perfil</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
