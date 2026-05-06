"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    draft:       { label: "Borrador",    color: "text-gov-grey",   bg: "bg-gov-grey/10",   border: "border-gov-grey/20" },
    pending:     { label: "Pendiente",   color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
    in_progress: { label: "En Proceso",  color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
    completed:   { label: "Aprobado",    color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    rejected:    { label: "Rechazado",   color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
};

const CATEGORY_ICONS: Record<string, string> = {
    Obras: "construction", Pagos: "payments", Negocios: "store",
    Servicios: "cleaning_services", Identidad: "badge", Tesorería: "account_balance",
    Secretaría: "description", Salud: "local_hospital", Transporte: "directions_bus",
};

interface ServiceRequest {
    id: string;
    folio: string;
    status: string;
    created_at: string;
    full_name: string;
    staff_notes: string | null;
    procedures: { title: string; category: string; cost: string; estimated_time: string } | null;
}

export default function CitizenRequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("todos");

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setLoading(false); return; }

        const { data, error } = await supabase
            .from("procedure_requests")
            .select(`id, folio, status, created_at, full_name, staff_notes,
                procedures (title, category, cost, estimated_time)`)
            .eq("citizen_id", session.user.id)
            .order("created_at", { ascending: false });

        if (!error && data) setRequests(data as any);
        setLoading(false);
    };

    const filtered = requests.filter(r => filter === "todos" || r.status === filter);

    const counts = {
        todos: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        in_progress: requests.filter(r => r.status === "in_progress").length,
        completed: requests.filter(r => r.status === "completed").length,
    };

    return (
        <div className="p-4 space-y-6 pb-20 bg-gov-bg min-h-screen animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 hover:bg-gov-surface rounded-full text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-white">Mis Trámites</h2>
                    <p className="text-gov-grey text-xs">{requests.length} solicitud{requests.length !== 1 ? "es" : ""} registrada{requests.length !== 1 ? "s" : ""}</p>
                </div>
                <Link href="/citizen/procedures" className="ml-auto bg-gov-primary text-gov-bg font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span> Nuevo
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Pendientes", count: counts.pending, color: "text-amber-400" },
                    { label: "En proceso", count: counts.in_progress, color: "text-blue-400" },
                    { label: "Aprobados",  count: counts.completed, color: "text-emerald-400" },
                ].map((s, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light rounded-2xl p-3 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                        <p className="text-gov-grey text-[10px] uppercase tracking-wide">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="bg-gov-bg border border-gov-light p-1 rounded-xl flex overflow-x-auto gap-1">
                {[
                    { key: "todos",       label: `Todos (${counts.todos})` },
                    { key: "pending",     label: "Pendientes" },
                    { key: "in_progress", label: "En proceso" },
                    { key: "completed",   label: "Aprobados" },
                    { key: "rejected",    label: "Rechazados" },
                ].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filter === f.key ? "bg-gov-primary text-gov-bg" : "text-gov-grey hover:text-white"}`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {loading ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="bg-gov-surface border border-gov-light rounded-xl p-4 h-24 animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-gov-grey/30 mb-4 block">inbox</span>
                    <h3 className="text-white font-bold mb-2">
                        {requests.length === 0 ? "Aún no tienes trámites" : "Sin resultados"}
                    </h3>
                    <p className="text-gov-grey text-sm mb-6">
                        {requests.length === 0
                            ? "Solicita un trámite digital y aparecerá aquí."
                            : "Prueba con otro filtro."}
                    </p>
                    {requests.length === 0 && (
                        <Link href="/citizen/procedures">
                            <button className="bg-gov-primary text-gov-bg font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors">
                                Ver Catálogo de Trámites
                            </button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(req => {
                        const proc = req.procedures;
                        const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                        const icon = CATEGORY_ICONS[proc?.category || ""] || "description";
                        return (
                            <Link key={req.id} href={`/citizen/requests/${req.id}`} className="block group">
                                <div className="bg-gov-surface border border-gov-light/50 group-hover:border-gov-primary/50 rounded-2xl p-4 space-y-3 transition-all active:scale-[0.98]">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gov-light/10 border border-gov-light flex items-center justify-center shrink-0 group-hover:bg-gov-primary/10 transition-colors">
                                            <span className="material-symbols-outlined text-gov-primary">{icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="text-white font-bold text-sm truncate">{proc?.title || "Trámite"}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${status.bg} ${status.color} ${status.border} whitespace-nowrap`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            {req.folio && (
                                                <p className="text-gov-primary font-mono text-xs font-bold">{req.folio}</p>
                                            )}
                                            <p className="text-gov-grey text-xs mt-1">{proc?.category} · {timeAgo(req.created_at)}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-gov-grey group-hover:text-white transition-colors self-center">chevron_right</span>
                                    </div>
                                    {req.staff_notes && (
                                        <div className="bg-gov-bg border border-gov-light/30 rounded-xl p-3">
                                            <p className="text-xs text-gov-grey uppercase font-bold mb-1">Nota del evaluador:</p>
                                            <p className="text-sm text-white line-clamp-2">{req.staff_notes}</p>
                                        </div>
                                    )}
                                    <div className="flex gap-2 text-[10px] text-gov-grey/70">
                                        <span className="bg-gov-bg/50 px-2 py-1 rounded border border-gov-light/20">⏱ {proc?.estimated_time}</span>
                                        <span className="bg-gov-bg/50 px-2 py-1 rounded border border-gov-light/20">💰 {proc?.cost}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
