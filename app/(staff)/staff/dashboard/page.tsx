"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";
import IncidentDrawer from "@/components/IncidentDrawer";
import InviteDirectorModal from "@/components/InviteDirectorModal";

interface RecentReport {
    id: string;
    folio: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    address: string | null;
    description: string;
    latitude?: number;
    longitude?: number;
    department_id?: string;
    departments: { name: string; icon: string; color: string } | null;
    report_photos: { file_url: string }[];
}

interface KPIs {
    total: number;
    nuevos: number;
    en_proceso: number;
    resueltos: number;
    criticos: number;
    avgResponseHours: number | null;
}

const STATUS_LABEL: Record<string, string> = {
    nuevo: "Nuevo", asignado: "Asignado", en_progreso: "En Proceso",
    resuelto: "Resuelto", rechazado: "Rechazado",
};
const PRIORITY_COLOR: Record<string, string> = {
    baja: "text-slate-400", media: "text-amber-400", alta: "text-orange-400", critica: "text-red-400",
};

export default function DashboardPage() {
    const [kpis, setKpis] = useState<KPIs>({ total: 0, nuevos: 0, en_proceso: 0, resueltos: 0, criticos: 0, avgResponseHours: null });
    const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Funcionario");
    const [selectedReport, setSelectedReport] = useState<RecentReport | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // ... (auth logic stays the same)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const email = user.email || "";
            if (email.includes("jesusferre")) {
                setUserName("Lic. Sosimo Lopez");
            } else {
                setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Funcionario");
            }
        }

        // KPIs
        const { data: allReports } = await supabase
            .from("reports")
            .select("status, priority, created_at, resolved_at");

        if (allReports) {
            const total = allReports.length;
            const nuevos = allReports.filter(r => r.status === "nuevo").length;
            const en_proceso = allReports.filter(r => r.status === "en_progreso" || r.status === "asignado").length;
            const resueltos = allReports.filter(r => r.status === "resuelto").length;
            const criticos = allReports.filter(r => r.priority === "alta" || r.priority === "critica").length;

            const resolved = allReports.filter(r => r.resolved_at && r.created_at);
            let avgHours: number | null = null;
            if (resolved.length > 0) {
                const totalMs = resolved.reduce((sum, r) => {
                    return sum + (new Date(r.resolved_at!).getTime() - new Date(r.created_at).getTime());
                }, 0);
                avgHours = Math.round(totalMs / resolved.length / 3600000 * 10) / 10;
            }
            setKpis({ total, nuevos, en_proceso, resueltos, criticos, avgResponseHours: avgHours });
        }

        // Últimos 5 reportes enriquecidos para el drawer
        const { data: recent } = await supabase
            .from("reports")
            .select(`
                id, folio, category, status, priority, created_at, address, description, 
                latitude, longitude, department_id,
                departments(name, icon, color),
                report_photos(file_url)
            `)
            .order("created_at", { ascending: false })
            .limit(5);

        if (recent) setRecentReports(recent as any[]);
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Panel de Control</h2>
                    <p className="text-gov-grey font-medium">
                        Bienvenido, <span className="text-white font-bold">{userName}</span> • Resumen operativo en tiempo real
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/staff/incidents">
                        <button className="bg-gov-surface hover:bg-gov-light text-white px-4 py-2 rounded-lg text-sm font-medium border border-gov-light transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">warning</span>
                            Ver Incidentes
                        </button>
                    </Link>
                    <Link href="/staff/crews">
                        <button className="bg-gov-primary hover:bg-emerald-400 text-gov-bg px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(27,218,91,0.4)] transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">groups</span>
                            Cuadrillas
                        </button>
                    </Link>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl group hover:border-gov-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">Reportes Totales</p>
                            <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gov-primary transition-colors">
                                {loading ? "—" : kpis.total}
                            </h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-gov-primary">inbox</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-blue-400 font-bold">{loading ? "—" : kpis.nuevos}</span>
                        <span className="text-gov-grey">nuevos sin atender</span>
                    </div>
                </div>

                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl group hover:border-gov-danger/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">Alta Prioridad</p>
                            <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gov-danger transition-colors">
                                {loading ? "—" : kpis.criticos}
                            </h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-gov-danger">priority_high</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        {kpis.criticos > 0 ? (
                            <span className="bg-gov-danger/10 text-gov-danger px-2 py-0.5 rounded font-bold">REQUIEREN ATENCIÓN</span>
                        ) : (
                            <span className="text-emerald-400 font-bold">Sin emergencias</span>
                        )}
                    </div>
                </div>

                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl group hover:border-gov-accent/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">En Proceso</p>
                            <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-gov-accent transition-colors">
                                {loading ? "—" : kpis.en_proceso}
                            </h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-gov-accent">pending</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400 font-bold">{loading ? "—" : kpis.resueltos}</span>
                        <span className="text-gov-grey">resueltos en total</span>
                    </div>
                </div>

                <div className="bg-gov-surface border border-gov-light p-6 rounded-2xl group hover:border-blue-400/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">T. Respuesta Prom.</p>
                            <h3 className="text-3xl font-bold text-blue-400 mt-2">
                                {loading ? "—" : kpis.avgResponseHours !== null ? `${kpis.avgResponseHours}h` : "N/D"}
                            </h3>
                        </div>
                        <div className="p-2 bg-gov-light/50 rounded-lg">
                            <span className="material-symbols-outlined text-blue-400">speed</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gov-grey">Basado en reportes resueltos</span>
                    </div>
                </div>
            </div>

            {/* Reportes recientes + Cuadrillas acceso rápido */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Últimos Reportes */}
                <div className="lg:col-span-2 bg-gov-surface border border-gov-light rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold text-lg">Últimos Reportes Ciudadanos</h3>
                        <Link href="/staff/incidents" className="text-gov-primary text-xs font-bold hover:underline">Ver todos</Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => <div key={i} className="h-16 bg-gov-bg rounded-xl animate-pulse" />)}
                        </div>
                    ) : recentReports.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="material-symbols-outlined text-4xl text-gov-grey/30 mb-2 block">inbox</span>
                            <p className="text-gov-grey text-sm">No hay reportes aún.</p>
                            <p className="text-gov-grey/60 text-xs mt-1">Los reportes de ciudadanos aparecerán aquí.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentReports.map((rep) => {
                                const photo = rep.report_photos?.[0]?.file_url;
                                return (
                                    <div 
                                        key={rep.id} 
                                        onClick={() => setSelectedReport(rep)}
                                        className="bg-gov-bg border border-gov-light rounded-xl p-4 flex items-center gap-4 hover:border-gov-primary transition-all cursor-pointer active:scale-[0.99]"
                                    >
                                        {photo ? (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gov-light">
                                                <img src={photo} alt="foto" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gov-surface border border-gov-light flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-gov-grey">report</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-gov-primary font-mono text-xs">{rep.folio}</span>
                                                <span className="text-gov-grey text-xs">•</span>
                                                <span className="text-gov-grey text-xs">{rep.category}</span>
                                                <span className={`text-[10px] font-bold ml-auto ${PRIORITY_COLOR[rep.priority] || ""}`}>
                                                    {rep.priority?.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-white text-sm font-medium truncate">
                                                {rep.description || rep.category}
                                            </p>
                                            <p className="text-gov-grey text-xs">{timeAgo(rep.created_at)}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold shrink-0 ${
                                            rep.status === "nuevo" ? "text-blue-400" :
                                            rep.status === "resuelto" ? "text-emerald-400" :
                                            "text-amber-400"
                                        }`}>
                                            {STATUS_LABEL[rep.status] || rep.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Acceso rápido a secciones */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-white font-bold text-lg">Acceso Rápido</h3>
                        <button 
                            onClick={() => setIsInviteModalOpen(true)}
                            className="bg-gov-primary/10 border border-gov-primary/30 text-gov-primary px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-gov-primary hover:text-gov-bg transition-all flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">person_add</span>
                            INVITAR DIRECTOR
                        </button>
                    </div>

                    {[
                        { label: "Cuadrillas",     icon: "groups",      href: "/staff/crews",      color: "text-gov-primary", desc: "Estado de departamentos" },
                        { label: "Incidentes",      icon: "warning",     href: "/staff/incidents",  color: "text-amber-400",   desc: `${kpis.nuevos} sin atender` },
                        { label: "Obras Públicas",  icon: "engineering", href: "/staff/projects",   color: "text-blue-400",    desc: "Proyectos activos" },
                        { label: "Servicios",       icon: "assignment",  href: "/staff/services",   color: "text-purple-400",  desc: "Trámites ciudadanos" },
                        { label: "Usuarios",        icon: "group",       href: "/staff/users",      color: "text-gov-grey",    desc: "Gestión de usuarios" },
                    ].map((item, i) => (
                        <Link key={i} href={item.href} className="group">
                            <div className="bg-gov-surface border border-gov-light rounded-xl p-4 flex items-center gap-4 hover:border-gov-primary/30 transition-all cursor-pointer">
                                <div className="w-10 h-10 rounded-xl bg-gov-bg flex items-center justify-center border border-gov-light group-hover:border-gov-primary/30 transition-colors">
                                    <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm group-hover:text-gov-primary transition-colors">{item.label}</h4>
                                    <p className="text-gov-grey text-xs">{item.desc}</p>
                                </div>
                                <span className="material-symbols-outlined text-gov-grey ml-auto group-hover:translate-x-1 transition-transform text-sm">arrow_forward_ios</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <IncidentDrawer 
                report={selectedReport as any} 
                onClose={() => setSelectedReport(null)}
                onRefresh={loadData}
            />

            <InviteDirectorModal 
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
}
