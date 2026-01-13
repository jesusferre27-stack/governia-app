"use client";

import Link from "next/link";
import { useState } from "react";

const allIncidents = [
    { id: "INC-1234", type: "Vandalismo", title: "Graffiti en Palacio Municipal", location: "Colonia Centro", date: "Hace 2h", status: "En Progreso", urgency: "Alta" },
    { id: "INC-1235", type: "Disturbio Público", title: "Ruido excesivo vecinal", location: "Colonia Condesa", date: "Hace 4h", status: "Resuelto", urgency: "Baja" },
    { id: "INC-1232", type: "Robo Infraestructura", title: "Robo de luminaria", location: "Colonia Polanco", date: "Ayer", status: "Reportado", urgency: "Media" },
    { id: "INC-1230", type: "Queja Vecinal", title: "Fiesta no autorizada", location: "Colonia Juárez", date: "Hace 2 días", status: "Resuelto", urgency: "Baja" },
    { id: "INC-1229", type: "Falla Eléctrica", title: "Apagón en calle principal", location: "Colonia Roma", date: "Hace 10 min", status: "Reportado", urgency: "Alta" },
];

export default function IncidentsPage() {
    const [filter, setFilter] = useState("Todos");

    const filteredIncidents = allIncidents.filter(inc => {
        if (filter === "Todos") return true;
        if (filter === "Críticos") return inc.urgency === "Alta";
        if (filter === "Hoy") return inc.date.includes("Hace") || inc.date === "Hoy";
        if (filter === "Sin Asignar") return inc.status === "Reportado";
        return true;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Incidentes</h2>
                    <p className="text-gov-grey">Control operativo y priorización de reportes.</p>
                </div>
                <button className="bg-gov-primary hover:bg-emerald-400 text-gov-bg font-bold px-4 py-2 rounded-lg text-sm shadow-[0_0_15px_rgba(27,218,91,0.4)] flex items-center gap-2 transition-all">
                    <span className="material-symbols-outlined">add_circle</span>
                    Crear Ticket
                </button>
            </div>

            {/* KPI Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Incidentes Críticos", val: "3", icon: "warning", color: "text-gov-danger" },
                    { label: "En Progreso", val: "12", icon: "pending", color: "text-amber-500" },
                    { label: "Resueltos Hoy", val: "45", icon: "check_circle", color: "text-emerald-500" },
                    { label: "Tiempo Promedio", val: "45 min", icon: "timer", color: "text-blue-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                        </div>
                        <div className={`p-2 rounded-lg bg-gov-light/30 ${stat.color}`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 min-h-[500px]">

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="bg-gov-bg p-1 rounded-lg border border-gov-light flex overflow-x-auto max-w-full">
                        {["Todos", "Críticos", "Hoy", "Sin Asignar"].map((f) => (
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
                        <input type="text" placeholder="Buscar..." className="w-full bg-gov-bg border border-gov-light rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gov-grey focus:border-gov-primary outline-none transition-colors" />
                    </div>
                </div>

                {/* Incidents List */}
                <div className="space-y-3">
                    {filteredIncidents.map((inc) => (
                        <Link href={`/incidents/${inc.id}`} key={inc.id}>
                            <div className={`group relative bg-gov-bg border border-gov-light rounded-xl p-4 hover:border-gov-primary/50 transition-all cursor-pointer overflow-hidden ${inc.urgency === "Alta" ? "border-l-4 border-l-gov-danger" : "border-l-4 border-l-gov-light"}`}>

                                {/* Hover Actions Overlay (Ghost Buttons) */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button className="bg-gov-surface border border-gov-light text-gov-grey hover:text-white hover:border-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                        Asignar
                                    </button>
                                    <button className="bg-gov-primary/10 text-gov-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                                        Ver detalle <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                    </button>
                                </div>

                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {/* Header Row */}
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-white font-bold text-sm tracking-wide">{inc.type}</span>
                                            <span className="text-[10px] text-gov-grey bg-gov-surface px-1.5 py-0.5 rounded border border-gov-light/50">{inc.id}</span>
                                            {inc.urgency === "Alta" && (
                                                <span className="flex items-center gap-1 text-gov-danger text-[10px] font-bold border border-gov-danger/30 px-1.5 py-0.5 rounded bg-gov-danger/10">
                                                    <span className="material-symbols-outlined text-[10px]">priority_high</span> URGENTE
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-gov-grey text-sm mb-2 group-hover:text-white transition-colors">{inc.title}</h3>

                                        {/* Metadata */}
                                        <div className="flex items-center gap-4 text-xs text-gov-grey">
                                            <span className="flex items-center gap-1 group-hover:text-gov-primary transition-colors">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {inc.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {inc.date}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge (Right aligned, fades on hover to make room for actions on mobile/desktop) */}
                                    <div className="group-hover:opacity-0 transition-opacity duration-300">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${inc.status === "Resuelto" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            inc.status === "En Progreso" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            }`}>
                                            {inc.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}
