"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CitizenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    return (
        <div className="min-h-screen w-full bg-gov-bg flex flex-col items-center relative overflow-x-hidden">

            {/* Background Assets (Shared with Staff Dashboard) */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gov-primary/5 via-gov-bg to-gov-bg pointer-events-none fixed z-0"></div>

            {/* Main Content Area - Full Width Institutional Standard */}
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 relative z-10 flex-1 pb-24 md:pb-6">
                {children}
            </main>

            {/* Bottom Nav - Mobile Only (Hidden on Desktop to avoid clutter) */}
            <div className="md:hidden fixed bottom-0 w-full bg-gov-surface/90 backdrop-blur-xl border-t border-gov-light flex items-center justify-around px-2 z-50 h-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <Link href="/citizen" className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/citizen') ? 'text-gov-primary' : 'text-gov-grey hover:text-white'}`}>
                    <span className={`material-symbols-outlined text-2xl ${isActive('/citizen') ? 'drop-shadow-[0_0_5px_rgba(27,218,91,0.5)]' : ''}`}>home</span>
                    <span className="text-[10px] font-bold tracking-wide">Inicio</span>
                </Link>
                <Link href="/citizen/activity" className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/citizen/activity') ? 'text-gov-primary' : 'text-gov-grey hover:text-white'}`}>
                    <span className="material-symbols-outlined text-2xl">history</span>
                    <span className="text-[10px] font-medium">Actividad</span>
                </Link>

                {/* Floating Action Button (FAB) effect */}
                <div className="relative -top-6">
                    <Link href="/citizen/report" className="flex items-center justify-center bg-gov-primary text-gov-bg rounded-full w-14 h-14 shadow-[0_0_20px_rgba(27,218,91,0.4)] border-4 border-gov-bg hover:scale-110 hover:brightness-110 transition-all">
                        <span className="material-symbols-outlined text-3xl font-bold">add</span>
                    </Link>
                </div>

                <Link href="/citizen/procedures" className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/citizen/procedures') ? 'text-gov-primary' : 'text-gov-grey hover:text-white'}`}>
                    <span className="material-symbols-outlined text-2xl">assignment</span>
                    <span className="text-[10px] font-medium">Trámites</span>
                </Link>
                <Link href="/citizen/profile" className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive('/citizen/profile') ? 'text-gov-primary' : 'text-gov-grey hover:text-white'}`}>
                    <span className="material-symbols-outlined text-2xl">person</span>
                    <span className="text-[10px] font-medium">Perfil</span>
                </Link>
            </div>

            {/* Desktop Navigation Hint (Optional) */}
            <div className="hidden md:flex fixed top-6 right-8 z-50 items-center gap-4 bg-gov-surface/80 backdrop-blur-md px-6 py-3 rounded-full border border-gov-light shadow-lg">
                <Link href="/citizen" className={`text-sm font-bold hover:text-gov-primary transition-colors ${isActive('/citizen') ? 'text-gov-primary' : 'text-white'}`}>Inicio</Link>
                <Link href="/citizen/activity" className={`text-sm font-bold hover:text-gov-primary transition-colors ${isActive('/citizen/activity') ? 'text-gov-primary' : 'text-white'}`}>Mis Reportes</Link>
                <Link href="/citizen/procedures" className={`text-sm font-bold hover:text-gov-primary transition-colors ${isActive('/citizen/procedures') ? 'text-gov-primary' : 'text-white'}`}>Trámites</Link>
                <div className="w-px h-4 bg-gov-light mx-2"></div>
                <Link href="/citizen/profile" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gov-light overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=12" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
