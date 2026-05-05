"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";
import { timeAgo } from "@/lib/date";

interface Department {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    report_count?: number;
    active_count?: number;
    resolved_count?: number;
    last_report_at?: string | null;
}



export default function CrewsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalReports, setTotalReports] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Traer todos los departamentos
        const { data: depts } = await supabase
            .from("departments")
            .select("*")
            .eq("active", true)
            .order("sort_order");

        if (!depts) { setLoading(false); return; }

        // Traer reportes con su departamento
        const { data: reports } = await supabase
            .from("reports")
            .select("department_id, status, created_at");

        // Calcular estadísticas por departamento
        const enriched = depts.map(dept => {
            const deptReports = (reports || []).filter(r => r.department_id === dept.id);
            const active = deptReports.filter(r => r.status !== "resuelto" && r.status !== "rechazado");
            const resolved = deptReports.filter(r => r.status === "resuelto");
            const sorted = [...deptReports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return {
                ...dept,
                report_count: deptReports.length,
                active_count: active.length,
                resolved_count: resolved.length,
                last_report_at: sorted[0]?.created_at || null,
            };
        });

        setDepartments(enriched);
        setTotalReports((reports || []).length);
        setLoading(false);
    };

    const totalActive = departments.reduce((sum, d) => sum + (d.active_count || 0), 0);
    const totalResolved = departments.reduce((sum, d) => sum + (d.resolved_count || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">Cuadrillas Municipales</h2>
                    <p className="text-gov-grey">Estado operativo de todos los departamentos del municipio</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 bg-gov-surface border border-gov-light px-4 py-2 rounded-lg text-gov-grey hover:text-white hover:border-gov-primary transition-all text-sm"
                >
                    <span className="material-symbols-outlined text-base">refresh</span>
                    Actualizar
                </button>
            </div>

            {/* Resumen global */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gov-surface to-gov-light border border-gov-light rounded-2xl p-6">
                    <p className="text-gov-grey text-xs uppercase tracking-wider mb-2">Total de Departamentos</p>
                    <h3 className="text-4xl font-bold text-white">{loading ? "—" : departments.length}</h3>
                    <p className="text-gov-grey text-sm mt-1">Cuadrillas activas en el municipio</p>
                </div>
                <div className="bg-gov-surface border border-amber-500/20 rounded-2xl p-6">
                    <p className="text-gov-grey text-xs uppercase tracking-wider mb-2">Reportes Activos</p>
                    <h3 className="text-4xl font-bold text-amber-400">{loading ? "—" : totalActive}</h3>
                    <p className="text-gov-grey text-sm mt-1">Requieren atención o están en proceso</p>
                </div>
                <div className="bg-gov-surface border border-emerald-500/20 rounded-2xl p-6">
                    <p className="text-gov-grey text-xs uppercase tracking-wider mb-2">Resueltos</p>
                    <h3 className="text-4xl font-bold text-emerald-400">{loading ? "—" : totalResolved}</h3>
                    <p className="text-gov-grey text-sm mt-1">de {totalReports} reportes totales ({totalReports > 0 ? Math.round(totalResolved / totalReports * 100) : 0}%)</p>
                </div>
            </div>

            {/* Grid de cuadrillas */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="bg-gov-surface border border-gov-light rounded-2xl p-6 h-52 animate-pulse" />
                    ))}
                </div>
            ) : departments.length === 0 ? (
                <div className="text-center py-20 bg-gov-surface border border-gov-light rounded-2xl">
                    <span className="material-symbols-outlined text-6xl text-gov-grey/30 mb-4 block">groups</span>
                    <h3 className="text-white font-bold text-xl mb-2">No hay departamentos configurados</h3>
                    <p className="text-gov-grey text-sm">Ejecuta la migración SQL para crear los departamentos del municipio.</p>
                    <div className="mt-4 bg-gov-light/20 rounded-xl p-4 max-w-md mx-auto text-left">
                        <p className="text-gov-grey text-xs font-mono">
                            Archivo: supabase/migrations/20260502_create_reports_and_crews.sql
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {departments.map((dept) => {
                        const resolutionRate = dept.report_count! > 0
                            ? Math.round((dept.resolved_count! / dept.report_count!) * 100)
                            : 0;
                        const hasActive = (dept.active_count || 0) > 0;

                        return (
                            <Link
                                key={dept.id}
                                href={`/staff/incidents?dept=${encodeURIComponent(dept.name)}`}
                                className="group"
                            >
                                <div className="bg-gov-surface border border-gov-light rounded-2xl p-6 hover:border-gov-primary/30 transition-all hover:shadow-[0_0_20px_rgba(27,218,91,0.08)] cursor-pointer h-full flex flex-col relative overflow-hidden">

                                    {/* Indicador de alertas activas */}
                                    {hasActive && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                            <span className="text-[10px] text-amber-400 font-bold uppercase">
                                                {dept.active_count} activo{dept.active_count !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    )}

                                    {/* Cabecera */}
                                    <div className="flex items-start gap-4 mb-5">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300"
                                            style={{ backgroundColor: dept.color + "22", border: `1.5px solid ${dept.color}44` }}
                                        >
                                            <span
                                                className="material-symbols-outlined text-2xl"
                                                style={{ color: dept.color }}
                                            >
                                                {dept.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0 pr-16">
                                            <h3 className="text-white font-bold text-base group-hover:text-gov-primary transition-colors leading-tight">
                                                {dept.name}
                                            </h3>
                                            <p className="text-gov-grey text-xs mt-1 line-clamp-2 leading-relaxed">
                                                {dept.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-white">{dept.report_count}</p>
                                            <p className="text-[10px] text-gov-grey uppercase">Total</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-amber-400">{dept.active_count}</p>
                                            <p className="text-[10px] text-gov-grey uppercase">Activos</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold text-emerald-400">{dept.resolved_count}</p>
                                            <p className="text-[10px] text-gov-grey uppercase">Resueltos</p>
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] text-gov-grey uppercase tracking-wide">Tasa de resolución</span>
                                            <span className="text-[10px] font-bold text-white">{resolutionRate}%</span>
                                        </div>
                                        <div className="w-full bg-gov-light rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${resolutionRate}%`,
                                                    backgroundColor: dept.color
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Último reporte */}
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gov-light/30">
                                        <span className="text-[10px] text-gov-grey flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                                            Último: {timeAgo(dept.last_report_at)}
                                        </span>
                                        <span className="text-[10px] text-gov-primary font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver reportes
                                            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                                        </span>
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
