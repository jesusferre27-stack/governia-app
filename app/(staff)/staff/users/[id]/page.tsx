"use client";

import Link from "next/link";
import { useState } from "react";

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("historial");

    // Mock Data simulating a fetch based on ID
    const user = {
        id: params.id,
        name: "Carlos Hernández",
        email: "carlos.hdz@example.com",
        phone: "555-0199-8822",
        address: "Calle Benito Juárez #45, Centro",
        curp: "HEGC890120HDFRRN09",
        joined: "12 Mar 2023",
        trustScore: 92,
        verified: true,
        avatar: "https://i.pravatar.cc/150?img=11",
        history: [
            { id: 1, type: "report", title: "Bache en Calle 5", date: "Hace 2d", status: "Resuelto" },
            { id: 2, type: "service", title: "Licencia de Funcionamiento", date: "Hace 1sem", status: "Aprobado" },
            { id: 3, type: "payment", title: "Pago Predial 2023", date: "Ene 2023", status: "Pagado" },
            { id: 4, type: "report", title: "Luminaria fundida", date: "Nov 2022", status: "Resuelto" }
        ],
        notes: "Ciudadano participativo, suele reportar temas de alumbrado. Cumplido con sus pagos."
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4 mb-2">
                <Link href="/staff/users" className="p-2 rounded-lg bg-gov-surface hover:bg-gov-light text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex items-center gap-2 text-gov-grey text-sm">
                    <span>Usuarios</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-white font-bold">{user.name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card (Left Column) */}
                <div className="space-y-6">
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-gov-primary to-emerald-600 mb-4 relative">
                            <img src={user.avatar} className="w-full h-full rounded-full border-4 border-gov-bg object-cover" />
                            {user.verified && (
                                <div className="absolute bottom-0 right-0 bg-gov-primary text-gov-bg p-1 rounded-full border-2 border-gov-bg" title="Verificado">
                                    <span className="material-symbols-outlined text-sm font-bold block">check</span>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white text-center">{user.name}</h2>
                        <p className="text-gov-grey text-sm mb-4">{user.email}</p>

                        <div className="w-full grid grid-cols-2 gap-2 text-center border-t border-gov-light/30 pt-4 mt-2">
                            <div>
                                <p className="text-2xl font-bold text-emerald-400">{user.trustScore}%</p>
                                <p className="text-[10px] text-gov-grey uppercase tracking-wider">Confianza</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">4</p>
                                <p className="text-[10px] text-gov-grey uppercase tracking-wider">Actividades</p>
                            </div>
                        </div>

                        <div className="w-full mt-6 space-y-3">
                            <button className="w-full bg-gov-primary/10 hover:bg-gov-primary text-gov-primary hover:text-gov-bg py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">mail</span> Contactar
                            </button>
                            <button className="w-full bg-gov-light hover:bg-white text-gov-grey hover:text-gov-bg py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">edit</span> Editar Datos
                            </button>
                        </div>
                    </div>

                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4">Datos de Contacto</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gov-grey block mb-1">Teléfono</label>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-gov-grey text-sm">call</span>
                                    {user.phone}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gov-grey block mb-1">Dirección</label>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-gov-grey text-sm">home</span>
                                    {user.address}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gov-grey block mb-1">CURP</label>
                                <div className="flex items-center gap-2 text-white">
                                    <span className="material-symbols-outlined text-gov-grey text-sm">badge</span>
                                    {user.curp}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed (Main Column) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Notes */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                        <span className="material-symbols-outlined text-amber-500">sticky_note_2</span>
                        <div>
                            <h4 className="font-bold text-amber-500 text-sm mb-1">Notas del Personal</h4>
                            <p className="text-gray-300 text-sm italic">"{user.notes}"</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gov-light flex gap-6">
                        {["Historial", "Documentos", "Pagos"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`pb-3 text-sm font-bold capitalize transition-colors relative ${activeTab === tab.toLowerCase() ? "text-gov-primary" : "text-gov-grey hover:text-white"}`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gov-primary rounded-t-full"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 pt-2">
                        {user.history.map((item) => (
                            <div key={item.id} className="bg-gov-surface border border-gov-light rounded-xl p-4 flex items-center justify-between group hover:border-gov-light/80 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'report' ? 'bg-rose-500/10 text-rose-500' :
                                            item.type === 'service' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        <span className="material-symbols-outlined">
                                            {item.type === 'report' ? 'warning' :
                                                item.type === 'service' ? 'description' :
                                                    'payments'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm group-hover:text-gov-primary transition-colors">{item.title}</h4>
                                        <p className="text-xs text-gov-grey capitalize">{item.type} • {item.date}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.status === 'Resuelto' || item.status === 'Pagado' || item.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
