
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/supabase";

export default function InvitationPage() {
    const { token } = useParams();
    const router = useRouter();
    const [invitation, setInvitation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        fetchInvitation();
    }, [token]);

    const fetchInvitation = async () => {
        const { data, error } = await supabase
            .from("crew_invitations")
            .select(`
                *,
                departments(name, icon, color)
            `)
            .eq("token", token)
            .single();

        if (error || !data) {
            setError("La invitación no es válida o ya expiró.");
        } else {
            setInvitation(data);
        }
        setLoading(false);
    };

    const handleAccept = async () => {
        setAccepting(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Guardar el token para después del login
            localStorage.setItem("pending_invite_token", token as string);
            router.push("/acceso-ciudadano"); // O la página de login que prefieras
            return;
        }

        // Llamar a la función RPC para aceptar
        const { data, error } = await supabase.rpc("accept_crew_invitation", {
            invite_token: token,
            user_id: user.id
        });

        if (error || !data) {
            setError("Hubo un error al aceptar la invitación.");
        } else {
            // Éxito - Redirigir al panel específico de cuadrilla
            router.push("/crew/dashboard");
        }
        setAccepting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gov-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gov-bg flex items-center justify-center p-6">
                <div className="bg-gov-surface border border-gov-light p-8 rounded-3xl max-w-md text-center">
                    <span className="material-symbols-outlined text-gov-danger text-5xl mb-4">error</span>
                    <h1 className="text-white text-2xl font-bold mb-2">Error de Invitación</h1>
                    <p className="text-gov-grey mb-6">{error}</p>
                    <button 
                        onClick={() => router.push("/")}
                        className="w-full bg-gov-light text-white font-bold py-3 rounded-xl hover:bg-gov-grey transition-all"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gov-bg flex items-center justify-center p-6">
            <div className="bg-gov-surface border border-gov-light p-10 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gov-primary"></div>
                
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gov-primary/10 flex items-center justify-center mx-auto mb-6 border border-gov-primary/20">
                        <span className="material-symbols-outlined text-4xl text-gov-primary">
                            {invitation.departments?.icon || "groups"}
                        </span>
                    </div>
                    <h1 className="text-white text-3xl font-bold">Invitación de Cuadrilla</h1>
                    <p className="text-gov-grey mt-2">Has sido invitado para dirigir el departamento de:</p>
                    <div className="mt-4 inline-block px-4 py-2 bg-gov-bg border border-gov-light rounded-xl font-bold text-gov-primary">
                        {invitation.departments?.name}
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={handleAccept}
                        disabled={accepting}
                        className="w-full bg-gov-primary text-gov-bg font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                    >
                        {accepting ? (
                            <div className="w-5 h-5 border-2 border-gov-bg border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">how_to_reg</span>
                                Aceptar y Activar Panel
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gov-grey px-6">
                        Al aceptar, tu cuenta será vinculada como responsable de esta área y recibirás notificaciones de nuevos reportes.
                    </p>
                </div>
            </div>
        </div>
    );
}
