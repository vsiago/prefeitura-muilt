"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Bic() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Redireciona se o usuário não tiver permissão
    useEffect(() => {
        if (!isLoading) {
            const isAuthorized = user && (
                user.role === "Coordenador" || user.role === "Técnico" && (user.specificApplications?.includes("Chamados Obra"))
            );
            if (!isAuthorized) {
                router.replace("/home");
            }
        }
    }, [user, isLoading, router]);

    // Enquanto verifica, não exibe nada
    if (isLoading || !user) return null;

    return (
        <>

            <main className=" min-h-screen flex container mx-auto flex-col items-start justify-start pt-40">
                <h1 className="text-slate-700 text-3xl">Sistema de Chamados de Obras</h1>
            </main>
        </>
    );
}
