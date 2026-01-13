"use client";

import Link from "next/link";
import { useState } from "react";

const allRequests = [
    { id: "REQ-2948", type: "Licencia de Funcionamiento", citizen: "Alma Pérez", date: "Hace 2d", status: "Aprobado" },
    { id: "REQ-2947", type: "Permiso de Construcción", citizen: "Carlos Fernández", date: "Hace 5d", status: "Pendiente" },
    { id: "REQ-2946", type: "Acta de Nacimiento", citizen: "Juana Wilson", date: "Hace 1sem", status: "Rechazado" },
    { id: "REQ-2945", type: "Licencia de Funcionamiento", citizen: "Rafael Espejel", date: "Hace 2sem", status: "Aprobado" },
    { id: "REQ-2944", type: "Permiso de Construcción", citizen: "Miguel Angel", date: "Hace 3sem", status: "Pendiente" },
];

export default function ServicesPage() {
    const [filter, setFilter] = useState("Todos");

    const filteredRequests = allRequests.filter(req => {
        if (filter === "Todos") return true;
        if (filter === "Pendientes") return req.status === "Pendiente";
        if (filter === "Aprobadas") return req.status === "Aprobado";
        if (filter === "Rechazadas") return req.status === "Rechazado";
        return true;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Servicios Digitales</h2>
                    <p className="text-gov-grey font-medium mt-1">Estado actual de la atención ciudadana y eficiencia administrativa</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "Tiempo Promedio", val: "3.2 días", icon: "timer", color: "text-blue-400", sub: "Resolución" },
                    { label: "Solicitudes Totales", val: "1,482", icon: "folder", color: "text-gov-primary", sub: "Histórico" },
                    { label: "Pendientes", val: "86", icon: "hourglass_empty", color: "text-amber-500", alert: true },
                    { label: "Aprobadas", val: "1,204", icon: "check_circle", color: "text-emerald-500", sub: "81% Efectividad" },
                    { label: "Rechazadas", val: "192", icon: "cancel", color: "text-red-500", sub: "13% Rechazo" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-gov-light/80 transition-all">
                        {stat.alert && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-gov-bg text-[10px] font-bold px-2 py-0.5 rounded-bl-lg animate-pulse">
                                REQUIEREN ATENCIÓN
                            </div>
                        )}
                        <span className={`material-symbols-outlined text-3xl mb-3 ${stat.color}`}>{stat.icon}</span>
                        <div>
                            <p className="text-gov-grey text-xs uppercase tracking-wider mb-1 font-bold">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                            {stat.sub && <p className="text-xs text-gov-grey mt-1">{stat.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 min-h-[400px]">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-white">Solicitudes Recientes</h3>

                    <div className="bg-gov-bg p-1 rounded-lg border border-gov-light flex">
                        {["Todos", "Pendientes", "Aprobadas", "Rechazadas"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${filter === f ? "bg-gov-light text-white shadow-sm" : "text-gov-grey hover:text-white"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredRequests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 bg-gov-bg border border-gov-light/50 rounded-xl hover:border-gov-primary transition-all group cursor-pointer relative overflow-hidden">

                            {/* Hover Actions Overlay */}
                            <div className="absolute inset-0 bg-gov-surface/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end px-6 gap-3 z-10">
                                <span className="text-gov-grey text-xs font-bold mr-auto pl-4">ID: {req.id}</span>
                                <button className="bg-gov-primary/10 hover:bg-gov-primary text-gov-primary hover:text-gov-bg px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                    Ver Detalle
                                </button>
                                {req.status === "Pendiente" && (
                                    <button className="bg-gov-light hover:bg-white text-white hover:text-gov-bg px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">person_add</span>
                                        Asignar
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${req.type === "Licencia de Funcionamiento" ? "bg-emerald-900/20 text-emerald-400" :
                                    req.type === "Permiso de Construcción" ? "bg-amber-900/20 text-amber-400" :
                                        "bg-rose-900/20 text-rose-400"
                                    }`}>
                                    <span className="material-symbols-outlined">
                                        {req.type === "Licencia de Funcionamiento" ? "store" : req.type === "Permiso de Construcción" ? "construction" : "description"}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{req.type}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-gov-grey text-xs">{req.citizen}</p>
                                        <span className="w-1 h-1 rounded-full bg-gov-grey"></span>
                                        <p className="text-gov-grey text-xs">{req.date}</p>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${req.status === "Aprobado" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                req.status === "Pendiente" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                    "bg-red-500/10 text-red-500 border-red-500/20"
                                }`}>
                                {req.status}
                            </span>
                        </div>
                    ))}
                    {filteredRequests.length === 0 && (
                        <div className="text-center py-10 text-gov-grey">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                            <p>No hay solicitudes en esta categoría.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
