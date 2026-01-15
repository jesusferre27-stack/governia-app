"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Dashboard", href: "/staff/dashboard", icon: "dashboard" },
    { name: "Incidentes", href: "/staff/incidents", icon: "warning" },
    { name: "Obras Públicas", href: "/staff/projects", icon: "engineering" },
    { name: "Servicios", href: "/staff/services", icon: "assignment" },
    { name: "Social", href: "/staff/social", icon: "sentiment_satisfied" },
    { name: "Usuarios", href: "/staff/users", icon: "group" },
    { name: "Configuración", href: "/staff/settings", icon: "settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gov-surface border-r border-gov-light flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gov-primary to-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gov-bg font-bold text-sm">shield</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">GOVERNIA</h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                                ? "bg-gov-primary text-gov-bg shadow-[0_0_15px_rgba(27,218,91,0.3)] font-bold"
                                : "text-gov-grey hover:bg-gov-light hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gov-light">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gov-light flex items-center justify-center text-xs font-bold text-gov-primary border border-gov-primary/20">
                        SL
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Lic. Sosimo Lopez</span>
                        <span className="text-[10px] text-gov-grey">Alcalde</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
