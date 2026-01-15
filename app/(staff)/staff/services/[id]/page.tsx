"use client";

import Link from "next/link";

export default function ServiceRequestDetail({ params }: { params: { id: string } }) {
    // Mock Data simulating a fetch based on ID
    const request = {
        id: params.id,
        type: "Licencia de Funcionamiento",
        citizen: "Alma Pérez",
        status: "Pendiente",
        date: "2023-10-24",
        phone: "555-0123",
        email: "alma.perez@example.com",
        address: "Av. Reforma 123, Centro",
        description: "Solicitud de renovación para local comercial de abarrotes.",
        documents: [
            { name: "Identificación Oficial", url: "#", type: "pdf" },
            { name: "Comprobante de Domicilio", url: "#", type: "pdf" },
            { name: "Plano del Local", url: "#", type: "img" }
        ]
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/staff/services" className="p-2 rounded-lg bg-gov-surface hover:bg-gov-light text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white">Detalle de Solicitud</h2>
                    <p className="text-gov-grey flex items-center gap-2">
                        ID: <span className="font-mono text-gov-primary">{request.id}</span>
                    </p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="px-4 py-2 bg-gov-danger/10 hover:bg-gov-danger/20 text-gov-danger border border-gov-danger/50 rounded-lg font-bold text-sm transition-all">
                        Rechazar
                    </button>
                    <button className="px-4 py-2 bg-gov-primary hover:bg-emerald-400 text-gov-bg font-bold rounded-lg text-sm shadow-[0_0_15px_rgba(27,218,91,0.4)] transition-all">
                        Aprobar Solicitud
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Citizen Card */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light/30 pb-2">Información del Ciudadano</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Nombre</label>
                                <p className="text-white font-medium text-lg">{request.citizen}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Fecha Solicitud</label>
                                <p className="text-white font-medium">{request.date}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Teléfono</label>
                                <p className="text-white font-medium">{request.phone}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Email</label>
                                <p className="text-white font-medium">{request.email}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gov-grey uppercase tracking-wider font-bold">Dirección del Negocio/Obra</label>
                                <p className="text-white font-medium">{request.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-gov-light/30 pb-2">Documentación Adjunta</h3>
                        <div className="space-y-3">
                            {request.documents.map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gov-bg border border-gov-light/50 rounded-xl hover:border-gov-primary/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gov-light/20 rounded-lg text-gov-primary">
                                            <span className="material-symbols-outlined">{doc.type === 'pdf' ? 'picture_as_pdf' : 'image'}</span>
                                        </div>
                                        <span className="text-sm text-gray-300 font-medium group-hover:text-white">{doc.name}</span>
                                    </div>
                                    <button className="text-xs font-bold text-gov-primary hover:underline flex items-center gap-1">
                                        Ver Documento <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Timeline/Status */}
                <div className="space-y-6">
                    <div className="bg-gov-surface border border-gov-light rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Estado Actual</h3>
                        <div className="flex flex-col items-center py-4">
                            <span className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase tracking-widest text-sm mb-2">
                                {request.status}
                            </span>
                            <p className="text-xs text-gov-grey text-center">Esperando revisión administrativa</p>
                        </div>
                        <div className="mt-6 space-y-4 relative">
                            {/* Connector Line */}
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gov-light/30"></div>

                            {/* Timeline Items */}
                            <div className="flex gap-4 relative">
                                <span className="material-symbols-outlined text-gov-primary bg-gov-bg z-10 p-1 rounded-full text-sm border border-gov-primary">check_circle</span>
                                <div>
                                    <p className="text-xs font-bold text-white">Solicitud Recibida</p>
                                    <p className="text-[10px] text-gov-grey">Hace 2 días</p>
                                </div>
                            </div>
                            <div className="flex gap-4 relative">
                                <span className="material-symbols-outlined text-amber-500 bg-gov-bg z-10 p-1 rounded-full text-sm border border-amber-500">pending</span>
                                <div>
                                    <p className="text-xs font-bold text-white">En Revisión</p>
                                    <p className="text-[10px] text-gov-grey">Actual</p>
                                </div>
                            </div>
                            <div className="flex gap-4 relative opacity-40">
                                <span className="material-symbols-outlined text-gov-grey bg-gov-bg z-10 p-1 rounded-full text-sm border border-gov-grey">gavel</span>
                                <div>
                                    <p className="text-xs font-bold text-white">Dictamen Final</p>
                                    <p className="text-[10px] text-gov-grey">Pendiente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
