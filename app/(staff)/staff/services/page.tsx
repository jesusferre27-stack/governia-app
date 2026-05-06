"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    draft:       { label: "Borrador",   color: "text-gov-grey",    bg: "bg-gov-grey/10",    border: "border-gov-grey/20" },
    pending:     { label: "Pendiente",  color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20" },
    in_progress: { label: "En Proceso", color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/20" },
    completed:   { label: "Aprobado",   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    rejected:    { label: "Rechazado",  color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20" },
};

interface ServiceRequest {
    id: string;
    folio: string;
    status: string;
    created_at: string;
    full_name: string;
    phone: string;
    email: string;
    procedures: { title: string; category: string } | null;
    departments: { name: string; icon: string; color: string } | null;
}

export default function StaffServicesPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Todos");
    const [search, setSearch] = useState("");

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("procedure_requests")
            .select(`id, folio, status, created_at, full_name, phone, email,
                procedures (title, category),
                departments (name, icon, color)`)
            .neq("status", "draft")
            .order("created_at", { ascending: false });

        if (!error && data) setRequests(data as any);
        setLoading(false);
    };

    const filtered = requests.filter(r => {
        const matchFilter = filter === "Todos" ||
            (filter === "Pendientes" && r.status === "pending") ||
            (filter === "Aprobadas" && r.status === "completed") ||
            (filter === "Rechazadas" && r.status === "rejected") ||
            (filter === "En Proceso" && r.status === "in_progress");
        const matchSearch = search === "" ||
            (r.folio || "").toLowerCase().includes(search.toLowerCase()) ||
            (r.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
            (r.procedures?.title || "").toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const counts = {
        total:       requests.length,
        pending:     requests.filter(r => r.status === "pending").length,
        in_progress: requests.filter(r => r.status === "in_progress").length,
        completed:   requests.filter(r => r.status === "completed").length,
        rejected:    requests.filter(r => r.status === "rejected").length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Servicios Digitales</h2>
                    <p className="text-gov-grey font-medium mt-1">Gestión de solicitudes ciudadanas de trámites municipales</p>
                </div>
                <button onClick={fetchRequests} className="flex items-center gap-2 text-xs text-gov-grey hover:text-white border border-gov-light px-3 py-2 rounded-xl hover:border-gov-primary transition-all">
                    <span className="material-symbols-outlined text-base">refresh</span> Actualizar
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Solicitudes", val: counts.total,       icon: "folder",        color: "text-gov-primary" },
                    { label: "Pendientes",         val: counts.pending,     icon: "hourglass_empty", color: "text-amber-400",  alert: counts.pending > 0 },
                    { label: "En Proceso",         val: counts.in_progress, icon: "pending",       color: "text-blue-400" },
                    { label: "Aprobadas",          val: counts.completed,   icon: "check_circle",  color: "text-emerald-400" },
                    { label: "Rechazadas",         val: counts.rejected,    icon: "cancel",        color: "text-red-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-gov-light/80 transition-all">
                        {stat.alert && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-gov-bg text-[10px] font-bold px-2 py-0.5 rounded-bl-lg animate-pulse">
                                ATENCIÓN
                            </div>
                        )}
                        <span className={`material-symbols-outlined text-3xl mb-3 ${stat.color}`}>{stat.icon}</span>
                        <div>
                            <p className="text-gov-grey text-xs uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{loading ? "..." : stat.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-white">Solicitudes Ciudadanas</h3>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Búsqueda */}
                        <div className="flex-1 md:w-64 flex items-center gap-2 bg-gov-bg border border-gov-light px-3 py-2 rounded-xl focus-within:border-gov-primary transition-colors">
                            <span className="material-symbols-outlined text-gov-grey text-lg">search</span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Folio, ciudadano, trámite..."
                                className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gov-grey/60"
                            />
                        </div>
                        {/* Filtros */}
                        <div className="bg-gov-bg p-1 rounded-lg border border-gov-light flex">
                            {["Todos", "Pendientes", "En Proceso", "Aprobadas", "Rechazadas"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${filter === f ? "bg-gov-light text-white shadow-sm" : "text-gov-grey hover:text-white"}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3].map(i => <div key={i} className="bg-gov-bg border border-gov-light rounded-xl h-16 animate-pulse" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gov-grey">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                        <p>No hay solicitudes en esta categoría.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(req => {
                            const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                            return (
                                <Link key={req.id} href={`/staff/services/${req.id}`}>
                                    <div className="flex items-center justify-between p-4 bg-gov-bg border border-gov-light/50 rounded-xl hover:border-gov-primary transition-all group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-xl bg-gov-surface border border-gov-light text-gov-primary">
                                                <span className="material-symbols-outlined text-lg">description</span>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm group-hover:text-gov-primary transition-colors">
                                                    {req.procedures?.title || "Trámite"}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {req.folio && <p className="text-gov-primary font-mono text-xs">{req.folio}</p>}
                                                    <span className="w-1 h-1 rounded-full bg-gov-grey" />
                                                    <p className="text-gov-grey text-xs">{req.full_name || "Sin nombre"}</p>
                                                    <span className="w-1 h-1 rounded-full bg-gov-grey" />
                                                    {req.departments && (
                                                        <>
                                                            <div className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[12px]" style={{ color: req.departments.color }}>{req.departments.icon}</span>
                                                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: req.departments.color }}>{req.departments.name}</p>
                                                            </div>
                                                            <span className="w-1 h-1 rounded-full bg-gov-grey" />
                                                        </>
                                                    )}
                                                    <p className="text-gov-grey text-xs">{timeAgo(req.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${status.bg} ${status.color} ${status.border}`}>
                                                {status.label}
                                            </span>
                                            <span className="material-symbols-outlined text-gov-grey group-hover:text-gov-primary transition-colors text-lg">chevron_right</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
