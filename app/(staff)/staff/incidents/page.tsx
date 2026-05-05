"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";

interface Report {
    id: string;
    folio: string;
    category: string;
    description: string;
    address: string | null;
    status: string;
    priority: string;
    created_at: string;
    departments: { name: string; icon: string; color: string } | null;
    report_photos: { file_url: string }[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
    nuevo:       { label: "Nuevo",      bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-l-blue-500"    },
    asignado:    { label: "Asignado",   bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-l-purple-500"  },
    en_progreso: { label: "En Proceso", bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-l-amber-500"   },
    resuelto:    { label: "Resuelto",   bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-l-emerald-500" },
    rechazado:   { label: "Rechazado",  bg: "bg-red-500/10",     text: "text-red-400",     border: "border-l-red-500"     },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    baja:    { label: "Baja",    color: "text-slate-400"  },
    media:   { label: "Media",   color: "text-amber-400"  },
    alta:    { label: "Alta",    color: "text-orange-400" },
    critica: { label: "Crítica", color: "text-red-400"    },
};



import IncidentDrawer from "@/components/IncidentDrawer";

import { useSearchParams } from "next/navigation";

export default function IncidentsPage() {
    const searchParams = useSearchParams();
    const deptParam = searchParams.get("dept");
    
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Todos");
    const [search, setSearch] = useState(deptParam || "");
    const [updating, setUpdating] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        if (deptParam) {
            setSearch(deptParam);
        }
    }, [deptParam]);

    useEffect(() => {
        fetchReports();
        // Suscripción en tiempo real
        const channel = supabase
            .channel("reports-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => {
                fetchReports();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchReports = async () => {
        const { data, error } = await supabase
            .from("reports")
            .select(`
                id, folio, category, description, address, status, priority, created_at, latitude, longitude, department_id,
                departments (name, icon, color),
                report_photos (file_url)
            `)
            .order("created_at", { ascending: false })
            .limit(100);

        if (!error && data) setReports(data as any[]);
        setLoading(false);
        
        // Update selected report if it exists and is in the list
        if (selectedReport) {
            const updated = (data as any[]).find(r => r.id === selectedReport.id);
            if (updated) setSelectedReport(updated);
        }
    };

    const updateStatus = async (reportId: string, newStatus: string) => {
        setUpdating(reportId);
        await supabase
            .from("reports")
            .update({ status: newStatus, ...(newStatus === "resuelto" ? { resolved_at: new Date().toISOString() } : {}) })
            .eq("id", reportId);
        await fetchReports();
        setUpdating(null);
    };

    const filtered = reports.filter(r => {
        const matchFilter =
            filter === "Todos"      ? true :
            filter === "Críticos"   ? r.priority === "alta" || r.priority === "critica" :
            filter === "Nuevos"     ? r.status === "nuevo" :
            filter === "En Proceso" ? r.status === "en_progreso" || r.status === "asignado" :
            filter === "Resueltos"  ? r.status === "resuelto" : true;

        const searchLower = search.toLowerCase();
        const matchSearch = search === "" ||
            r.folio.toLowerCase().includes(searchLower) ||
            r.category.toLowerCase().includes(searchLower) ||
            (r.description || "").toLowerCase().includes(searchLower) ||
            (r.address || "").toLowerCase().includes(searchLower) ||
            (r.departments?.name || "").toLowerCase().includes(searchLower);

        return matchFilter && matchSearch;
    });

    const kpis = {
        total:    reports.length,
        nuevos:   reports.filter(r => r.status === "nuevo").length,
        proceso:  reports.filter(r => r.status === "en_progreso" || r.status === "asignado").length,
        resueltos:reports.filter(r => r.status === "resuelto").length,
        criticos: reports.filter(r => r.priority === "critica" || r.priority === "alta").length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Incidentes y Reportes</h2>
                    <p className="text-gov-grey">Reportes ciudadanos en tiempo real • Se actualiza automáticamente</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gov-primary animate-pulse"></div>
                    <span className="text-gov-grey text-xs">En vivo</span>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Reportes",  val: kpis.total,    icon: "inbox",        color: "text-white"         },
                    { label: "Nuevos",           val: kpis.nuevos,   icon: "fiber_new",    color: "text-blue-400"      },
                    { label: "En Proceso",       val: kpis.proceso,  icon: "pending",      color: "text-amber-400"     },
                    { label: "Resueltos",        val: kpis.resueltos,icon: "check_circle", color: "text-emerald-400"   },
                    { label: "Alta Prioridad",   val: kpis.criticos, icon: "warning",      color: "text-red-400"       },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className={`text-2xl font-bold ${stat.color}`}>{loading ? "—" : stat.val}</h3>
                        </div>
                        <span className={`material-symbols-outlined text-2xl ${stat.color} opacity-70`}>{stat.icon}</span>
                    </div>
                ))}
            </div>

            {/* Filters + Search */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="bg-gov-bg p-1 rounded-lg border border-gov-light flex overflow-x-auto max-w-full gap-1 no-scrollbar">
                        {["Todos", "Nuevos", "Críticos", "En Proceso", "Resueltos"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-xs font-bold transition-all whitespace-nowrap ${filter === f ? "bg-gov-light text-white shadow-sm" : "text-gov-grey hover:text-white"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gov-grey text-sm">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por folio, categoría..."
                            className="w-full bg-gov-bg border border-gov-light rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gov-grey focus:border-gov-primary outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Lista */}
                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="bg-gov-bg border border-gov-light rounded-xl p-4 h-20 animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-5xl text-gov-grey/30 mb-4 block">inbox</span>
                        <p className="text-gov-grey">
                            {reports.length === 0 ? "No hay reportes ciudadanos aún." : "Sin resultados para este filtro."}
                        </p>
                        {reports.length === 0 && (
                            <p className="text-gov-grey/60 text-sm mt-2">Los reportes de ciudadanos aparecerán aquí en tiempo real.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((rep) => {
                            const statusCfg = STATUS_CONFIG[rep.status] || STATUS_CONFIG["nuevo"];
                            const priorityCfg = PRIORITY_CONFIG[rep.priority] || PRIORITY_CONFIG["media"];
                            const photo = rep.report_photos?.[0]?.file_url;
                            const isUpdating = updating === rep.id;

                            return (
                                <div
                                    key={rep.id}
                                    onClick={() => setSelectedReport(rep)}
                                    className={`group relative bg-gov-bg border border-gov-light ${statusCfg.border} border-l-4 rounded-xl p-4 hover:border-gov-primary transition-all overflow-hidden cursor-pointer active:scale-[0.99]`}
                                >
                                    <div className="flex gap-4">
                                        {/* Foto thumbnail */}
                                        {photo ? (
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gov-light">
                                                <img src={photo} alt="foto" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl bg-gov-surface border border-gov-light flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-gov-grey text-2xl">
                                                    {(rep as any).departments?.icon || "report"}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            {/* Row 1 */}
                                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                                <span className="text-gov-primary font-mono text-xs font-bold">{rep.folio}</span>
                                                <span className="text-[10px] bg-gov-surface text-gov-grey px-2 py-0.5 rounded border border-gov-light/50">{rep.category}</span>
                                                {(rep as any).departments && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded border border-gov-light/50" style={{ color: (rep as any).departments.color }}>
                                                        {(rep as any).departments.name}
                                                    </span>
                                                )}
                                                <span className={`text-[10px] font-bold ml-auto ${priorityCfg.color}`}>
                                                    {priorityCfg.label}
                                                </span>
                                            </div>

                                            {/* Descripción */}
                                            <p className="text-white text-sm font-medium truncate">
                                                {rep.description || "(Sin descripción)"}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-3 text-xs text-gov-grey mt-1">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                                                    {timeAgo(rep.created_at)}
                                                </span>
                                                {rep.address && (
                                                    <span className="flex items-center gap-1 truncate">
                                                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                                                        {rep.address}
                                                    </span>
                                                )}
                                                {rep.report_photos?.length > 0 && (
                                                    <span className="flex items-center gap-1 text-gov-primary">
                                                        <span className="material-symbols-outlined text-[12px]">photo</span>
                                                        {rep.report_photos.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status + acciones */}
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusCfg.bg} ${statusCfg.text}`}>
                                                {statusCfg.label}
                                            </span>

                                            {/* Cambio rápido de estado */}
                                            {rep.status !== "resuelto" && (
                                                <div className="hidden md:block">
                                                    <select
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => e.target.value && updateStatus(rep.id, e.target.value)}
                                                        disabled={isUpdating}
                                                        defaultValue=""
                                                        className="text-[10px] bg-gov-surface border border-gov-light rounded-lg px-2 py-1 text-gov-grey hover:border-gov-primary transition-colors cursor-pointer outline-none disabled:opacity-50"
                                                    >
                                                        <option value="" disabled>Estado</option>
                                                        {rep.status !== "asignado"    && <option value="asignado">Asignar</option>}
                                                        {rep.status !== "en_progreso" && <option value="en_progreso">En proceso</option>}
                                                        <option value="resuelto">Resuelto</option>
                                                        <option value="rechazado">Rechazar</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <IncidentDrawer 
                report={selectedReport} 
                onClose={() => setSelectedReport(null)}
                onRefresh={fetchReports}
            />
        </div>
    );
}
