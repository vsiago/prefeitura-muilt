"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardBicPage from "./DashboardBicPage";

export default function Bic() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // Redireciona se o usuário não tiver permissão
    useEffect(() => {
        if (!isLoading) {
            const isAuthorized = user && (
                user.role === "Coordenador" ||
                (user.role === "Técnico" && user.specificApplications?.includes("BIC"))
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

            <main className=" min-h-screen flex flex-col items-center justify-start pt-40">
                <DashboardBicPage />
            </main>
        </>
    );
}
