"use client";

const users = [
    { name: "Esther Howard", role: "Admin", email: "esther@gov.com", status: "Active", lastAccess: "Hace 5 min" },
    { name: "Cameron Williamson", role: "Editor", email: "cameron@gov.com", status: "Active", lastAccess: "Hace 2h" },
    { name: "Robert Fox", role: "Viewer", email: "robert@gov.com", status: "Inactive", lastAccess: "Hace 1 mes" },
    { name: "Jenny Wilson", role: "Editor", email: "jenny@gov.com", status: "Active", lastAccess: "Ayer" },
    { name: "Guy Hawkins", role: "Viewer", email: "guy@gov.com", status: "Active", lastAccess: "Hace 3h" },
];

export default function UsersPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Usuarios del Sistema</h2>
                    <p className="text-gov-grey">Control de accesos, roles y responsabilidades institucionales.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <button className="bg-gov-primary hover:bg-emerald-400 text-gov-bg font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(27,218,91,0.3)] transition-all">
                        <span className="material-symbols-outlined">person_add</span>
                        Invitar Usuario
                    </button>
                    <span className="text-[10px] text-gov-grey font-medium tracking-wide mr-1">Acceso controlado por rol</span>
                </div>
            </div>

            {/* KPI Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Usuarios Activos", val: "24", icon: "group", color: "text-emerald-400" },
                    { label: "Administradores", val: "3", icon: "verified_user", color: "text-amber-500" },
                    { label: "Solo Lectura", val: "15", icon: "visibility", color: "text-blue-400" },
                    { label: "Inactivos", val: "2", icon: "person_off", color: "text-gov-grey" },
                ].map((stat, i) => (
                    <div key={i} className="bg-gov-surface border border-gov-light p-4 rounded-xl flex items-center justify-between group hover:border-gov-light/80 transition-all">
                        <div>
                            <p className="text-gov-grey text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                        </div>
                        <div className={`p-2 rounded-lg bg-gov-light/20 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Table Card */}
            <div className="bg-gov-surface border border-gov-light rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gov-bg text-gov-grey text-xs uppercase font-bold tracking-wider border-b border-gov-light/50">
                        <tr>
                            <th className="p-5">Identidad</th>
                            <th className="p-5">Rol Institucional</th>
                            <th className="p-5">Estado & Acceso</th>
                            <th className="p-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gov-light/30">
                        {users.map((user, i) => {
                            // Role styling logic
                            let roleColor = "text-gov-grey";
                            let roleIcon = "visibility";
                            let roleBg = "bg-gov-light/20";

                            if (user.role === "Admin") { roleColor = "text-amber-400"; roleIcon = "shield_person"; roleBg = "bg-amber-500/10 border-amber-500/20"; }
                            if (user.role === "Editor") { roleColor = "text-white"; roleIcon = "edit_document"; roleBg = "bg-blue-500/10 border-blue-500/20"; }

                            return (
                                <tr key={i} className="group hover:bg-gov-light/20 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gov-light to-gov-surface border border-gov-light flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                                    {user.name.slice(0, 2)}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gov-surface ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gov-grey'}`}></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm group-hover:text-gov-primary transition-colors">{user.name}</p>
                                                <p className="text-gov-grey text-xs font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${roleBg}`}>
                                            <span className={`material-symbols-outlined text-xs ${roleColor}`}>{roleIcon}</span>
                                            <span className={`text-xs font-bold ${roleColor}`}>{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold leading-tight ${user.status === 'Active' ? 'text-emerald-500' : 'text-gov-grey'}`}>
                                                {user.status === 'Active' ? '● Activo' : '○ Inactivo'}
                                            </span>
                                            <span className="text-[10px] text-gov-grey mt-0.5">Último: {user.lastAccess}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right relative">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2 items-center">
                                            <button className="text-gov-grey hover:text-white text-xs font-medium hover:underline transition-all">Editar Rol</button>
                                            <button className="w-8 h-8 rounded-full hover:bg-gov-light flex items-center justify-center text-gov-grey hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-lg">more_vert</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="p-3 bg-gov-bg/30 border-t border-gov-light/30 text-center">
                    <p className="text-[10px] text-gov-grey flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">info</span>
                        Los cambios de permisos quedan registrados en la bitácora de seguridad.
                    </p>
                </div>
            </div>
        </div>
    );
}
