"use client";

import Link from "next/link";

export default function DirectoryPage() {
    const emergencyNumbers = [
        { name: "Emergencias Nacionales", number: "911", icon: "emergency", color: "bg-red-500", text: "text-white" },
        { name: "Policía Municipal", number: "555-0123", icon: "local_police", color: "bg-blue-600", text: "text-white" },
        { name: "Protección Civil", number: "555-0999", icon: "flood", color: "bg-amber-500", text: "text-gov-bg" },
        { name: "Bomberos", number: "555-1122", icon: "local_fire_department", color: "bg-orange-600", text: "text-white" },
        { name: "Cruz Roja", number: "555-6543", icon: "medical_services", color: "bg-white", text: "text-red-600" },
        { name: "Denuncia Anónima", number: "089", icon: "policy", color: "bg-gov-surface", text: "text-gov-grey", border: true },
    ];

    const offices = [
        { name: "Presidencia Municipal", address: "Calle Principal #1, Centro", hours: "8:00 AM - 4:00 PM", lat: 18.23, lng: -94.23 },
        { name: "DIF Municipal", address: "Av. Reforma #200", hours: "8:00 AM - 3:00 PM", lat: 18.24, lng: -94.22 },
        { name: "Obras Públicas", address: "Carretera Federal Km 2", hours: "9:00 AM - 5:00 PM", lat: 18.25, lng: -94.21 },
        { name: "Agua Potable (CMAS)", address: "Calle Acueducto #45", hours: "8:00 AM - 4:00 PM", lat: 18.22, lng: -94.24 },
    ];

    return (
        <div className="min-h-screen pb-24 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/citizen" className="p-2 rounded-full bg-gov-surface/50 border border-gov-light text-gov-grey hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="text-2xl font-bold text-white">Directorio</h1>
            </div>

            {/* Emergency Grid */}
            <section>
                <h2 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4 border-b border-gov-light/30 pb-2">Números de Emergencia</h2>
                <div className="grid grid-cols-2 gap-3">
                    {emergencyNumbers.map((item, i) => (
                        <a
                            href={`tel:${item.number}`}
                            key={i}
                            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 ${item.color} ${item.border ? "border border-gov-light" : "shadow-lg"}`}
                        >
                            <span className={`material-symbols-outlined text-3xl ${item.text}`}>{item.icon}</span>
                            <div className="text-center">
                                <p className={`text-xs font-bold leading-tight ${item.text}`}>{item.name}</p>
                                <p className={`text-lg font-black ${item.text}`}>{item.number}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Offices List */}
            <section>
                <h2 className="text-sm font-bold text-gov-grey uppercase tracking-wider mb-4 border-b border-gov-light/30 pb-2 mt-2">Dependencias</h2>
                <div className="space-y-3">
                    {offices.map((office, i) => (
                        <div key={i} className="bg-gov-surface/50 backdrop-blur-md border border-gov-light/50 rounded-xl p-4 hover:border-gov-primary/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-white mb-1">{office.name}</h3>
                                    <p className="text-xs text-gov-grey flex items-center gap-1 mb-1">
                                        <span className="material-symbols-outlined text-[10px]">location_on</span>
                                        {office.address}
                                    </p>
                                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                                        {office.hours}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="p-2 rounded-lg bg-gov-bg border border-gov-light text-gov-primary hover:bg-gov-primary hover:text-gov-bg transition-colors">
                                        <span className="material-symbols-outlined text-lg">call</span>
                                    </button>
                                    <button className="p-2 rounded-lg bg-gov-bg border border-gov-light text-blue-400 hover:bg-blue-400 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-lg">map</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
