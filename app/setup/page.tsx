"use client";

import { useState } from "react";
import { supabase } from "@/app/supabase";

export default function SetupPage() {
    const [status, setStatus] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const createUsers = async () => {
        setLoading(true);
        setStatus("Iniciando creación de usuarios...");

        try {
            // 1. Crear Funcionario
            const { data: staffData, error: staffError } = await supabase.auth.signUp({
                email: "funcionario@demo.com",
                password: "password123",
                options: {
                    data: {
                        role: "staff",
                        full_name: "Funcionario Demo"
                    }
                }
            });

            if (staffError) {
                console.error("Error creating staff:", staffError);
                setStatus((prev) => prev + `\nError Funcionario: ${staffError.message}`);
            } else if (staffData.user) {
                setStatus((prev) => prev + `\nUsuario Funcionario creado: ${staffData.user.email}`);
            } else {
                setStatus((prev) => prev + `\nUsuario Funcionario ya existe o requiere confirmación.`);
            }

            // 2. Crear Ciudadano
            const { data: citizenData, error: citizenError } = await supabase.auth.signUp({
                email: "ciudadano@demo.com",
                password: "password123",
                options: {
                    data: {
                        role: "citizen",
                        full_name: "Ciudadano Demo"
                    }
                }
            });

            if (citizenError) {
                console.error("Error creating citizen:", citizenError);
                setStatus((prev) => prev + `\nError Ciudadano: ${citizenError.message}`);
            } else if (citizenData.user) {
                setStatus((prev) => prev + `\nUsuario Ciudadano creado: ${citizenData.user.email}`);
            } else {
                setStatus((prev) => prev + `\nUsuario Ciudadano ya existe o requiere confirmación.`);
            }

        } catch (err: any) {
            setStatus("Error general: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-green-400">Configuración Inicial</h1>

            <div className="bg-white/10 p-8 rounded-xl max-w-md w-full backdrop-blur-sm border border-white/5">
                <p className="mb-6 text-gray-300">
                    Utiliza este botón para generar los usuarios genéricos necesarios para probar la plataforma.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="p-3 bg-black/30 rounded border border-white/10">
                        <p className="text-xs text-gray-400 uppercase font-bold">Funcionario</p>
                        <p className="font-mono text-sm">funcionario@demo.com</p>
                        <p className="font-mono text-xs text-gray-500">password123</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-white/10">
                        <p className="text-xs text-gray-400 uppercase font-bold">Ciudadano</p>
                        <p className="font-mono text-sm">ciudadano@demo.com</p>
                        <p className="font-mono text-xs text-gray-500">password123</p>
                    </div>
                    <div className="p-3 bg-black/30 rounded border border-white/10">
                        <p className="text-xs text-gray-400 uppercase font-bold">NOTA IMPORTANTE</p>
                        <p className="font-mono text-xs text-yellow-500">
                            Si el registro público está desactivado en Supabase, esto podría fallar.
                            Revisa el Dashboard de Supabase &gt; Authentication &gt; User Creation.
                        </p>
                    </div>
                </div>

                <button
                    onClick={createUsers}
                    disabled={loading}
                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-all disabled:opacity-50"
                >
                    {loading ? "Creando..." : "Crear Usuarios Genéricos"}
                </button>

                {status && (
                    <pre className="mt-6 p-4 bg-black/50 rounded text-xs whitespace-pre-wrap font-mono text-green-300 border border-green-500/30">
                        {status}
                    </pre>
                )}
            </div>
        </div>
    );
}
