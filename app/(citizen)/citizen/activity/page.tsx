"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";

const STATUS_CONFIG: Record<string, { label: string; color: string; border: string; bg: string }> = {
    nuevo:       { label: "Nuevo",        color: "text-blue-400",    border: "border-l-blue-400",    bg: "bg-blue-400/10 border border-blue-400/20"    },
    asignado:    { label: "Asignado",     color: "text-purple-400",  border: "border-l-purple-400",  bg: "bg-purple-400/10 border border-purple-400/20" },
    en_progreso: { label: "En Proceso",   color: "text-amber-400",   border: "border-l-amber-400",   bg: "bg-amber-400/10 border border-amber-400/20"   },
    resuelto:    { label: "Resuelto",     color: "text-emerald-400", border: "border-l-emerald-400", bg: "bg-emerald-400/10 border border-emerald-400/20"},
    rechazado:   { label: "Rechazado",    color: "text-red-400",     border: "border-l-red-400",     bg: "bg-red-400/10 border border-red-400/20"       },
};

const CATEGORY_ICONS: Record<string, string> = {
    "Alumbrado":    "lightbulb",
    "Fuga de Agua": "water_drop",
    "Basura":       "delete",
    "Baches":       "edit_road",
    "Seguridad":    "security",
    "Parques":      "nature",
};

interface Report {
    id: string;
    folio: string;
    category: string;
    description: string;
    address: string | null;
    status: string;
    created_at: string;
    report_photos: { file_url: string }[];
}



export default function CitizenActivityPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("todos");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("reports")
            .select(`
                id, folio, category, description, address, status, created_at,
                report_photos (file_url)
            `)
            .eq("citizen_id", session.user.id)
            .order("created_at", { ascending: false });

        if (!error && data) setReports(data as Report[]);
        setLoading(false);
    };

    const filtered = reports.filter(r => {
        const matchesFilter = filter === "todos" || r.status === filter;
        const matchesSearch = search === "" ||
            r.folio.toLowerCase().includes(search.toLowerCase()) ||
            r.category.toLowerCase().includes(search.toLowerCase()) ||
            (r.description || "").toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const counts = {
        todos:      reports.length,
        nuevo:      reports.filter(r => r.status === "nuevo").length,
        en_progreso:reports.filter(r => r.status === "en_progreso" || r.status === "asignado").length,
        resuelto:   reports.filter(r => r.status === "resuelto").length,
    };

    return (
        <div className="p-4 space-y-6 pb-20 bg-gov-bg min-h-screen animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-white">Mis Reportes</h2>
                    <p className="text-gov-grey text-xs">{reports.length} reporte{reports.length !== 1 ? "s" : ""} en total</p>
                </div>
                <Link href="/citizen/report" className="ml-auto bg-gov-primary p-2 rounded-full shadow-[0_0_10px_rgba(27,218,91,0.3)] text-gov-bg transform hover:scale-105 transition-all">
                    <span className="material-symbols-outlined font-bold">add</span>
                </Link>
            </div>

            {/* Illustration Hero */}
            <div className="relative h-32 md:h-40 rounded-3xl overflow-hidden bg-gov-surface border border-gov-light shadow-2xl group">
                <img 
                    src="/activity_hero.png" 
                    alt="Actividad" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gov-bg via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">Seguimiento de Reportes</h3>
                    <p className="text-gov-grey text-[10px] uppercase font-bold tracking-widest">Panel de Control Ciudadano</p>
                </div>
                <div className="absolute top-4 right-6 bg-gov-primary/20 backdrop-blur-md p-2 rounded-full border border-gov-primary/30">
                    <span className="material-symbols-outlined text-gov-primary text-xl">insights</span>
                </div>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Nuevos", count: counts.nuevo, color: "text-blue-400" },
                    { label: "En proceso", count: counts.en_progreso, color: "text-amber-400" },
                    { label: "Resueltos", count: counts.resuelto, color: "text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light rounded-2xl p-3 text-center">
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                        <p className="text-gov-grey text-[10px] uppercase tracking-wide">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Búsqueda */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <span className="material-symbols-outlined text-gov-grey">search</span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por folio, categoría..."
                    className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gov-grey"
                />
            </div>

            {/* Filtros */}
            <div className="bg-gov-bg border border-gov-light p-1 rounded-xl flex overflow-x-auto gap-1">
                {[
                    { key: "todos",       label: `Todos (${counts.todos})` },
                    { key: "nuevo",       label: "Nuevos"     },
                    { key: "en_progreso", label: "En proceso" },
                    { key: "resuelto",    label: "Resueltos"  },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === f.key ? "bg-gov-primary text-gov-bg" : "text-gov-grey hover:text-white"}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista de reportes */}
            {loading ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-gov-surface border border-gov-light rounded-xl p-4 h-20 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-gov-grey/30 mb-4 block">inbox</span>
                    <h3 className="text-white font-bold mb-2">
                        {reports.length === 0 ? "No tienes reportes aún" : "Sin resultados"}
                    </h3>
                    <p className="text-gov-grey text-sm mb-6">
                        {reports.length === 0
                            ? "Cuando reportes un problema aparecerá aquí."
                            : "Prueba con otros filtros o términos de búsqueda."}
                    </p>
                    {reports.length === 0 && (
                        <Link href="/citizen/report">
                            <button className="bg-gov-primary text-gov-bg font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors">
                                Crear primer reporte
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((item) => {
                        const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG["nuevo"];
                        const icon = CATEGORY_ICONS[item.category] || "report";
                        const photo = item.report_photos?.[0]?.file_url;
                        return (
                            <div
                                key={item.id}
                                className={`bg-gov-surface border-y border-r border-gov-light/50 border-l-4 ${statusCfg.border} rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-gov-surface/80 hover:shadow-lg cursor-pointer group`}
                            >
                                {/* Thumbnail o icono */}
                                {photo ? (
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gov-light">
                                        <img src={photo} alt="foto" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-gov-light/10 border border-gov-light flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-gov-grey text-2xl">{icon}</span>
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-gov-primary font-mono text-xs font-bold">{item.folio}</span>
                                        <span className="text-gov-grey text-xs">•</span>
                                        <span className="text-gov-grey text-xs">{item.category}</span>
                                    </div>
                                    <p className="text-white font-bold text-sm truncate">
                                        {item.description || item.category}
                                    </p>
                                    <p className="text-gov-grey text-xs mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                                        {timeAgo(item.created_at)}
                                        {item.address && <><span>•</span>{item.address}</>}
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                                        {statusCfg.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
