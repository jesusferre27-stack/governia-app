import Link from "next/link";

export default function StaffLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gov-surface border border-gov-light p-8 rounded-3xl shadow-2xl relative overflow-hidden">

                {/* Decorative Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gov-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-gov-primary to-emerald-700 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-gov-primary/20 mb-4">
                        <span className="material-symbols-outlined text-gov-bg text-3xl font-bold">shield</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Bienvenido de nuevo</h2>
                    <p className="text-gov-grey mt-2 text-sm">Ingresa tus credenciales para acceder al panel.</p>
                </div>

                <form className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gov-grey uppercase tracking-wider ml-1">Email Corporativo</label>
                        <div className="bg-gov-bg border border-gov-light rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-gov-primary transition-colors">
                            <span className="material-symbols-outlined text-gov-grey">mail</span>
                            <input type="email" placeholder="nombre@municipio.gob.mx" className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gov-grey uppercase tracking-wider ml-1">Contraseña</label>
                        <div className="bg-gov-bg border border-gov-light rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-gov-primary transition-colors">
                            <span className="material-symbols-outlined text-gov-grey">lock</span>
                            <input type="password" placeholder="••••••••" className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600" />
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-xs text-gov-primary hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>

                    <Link href="/dashboard" className="block w-full">
                        <button type="button" className="w-full bg-gov-primary hover:bg-emerald-400 text-gov-bg font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(27,218,91,0.3)] transition-all transform active:scale-95">
                            Iniciar Sesión
                        </button>
                    </Link>
                </form>

                <div className="mt-8 text-center border-t border-gov-light pt-6">
                    <p className="text-xs text-gray-500">Sistema protegido por Governia Security.</p>
                </div>

            </div>
        </div>
    );
}
