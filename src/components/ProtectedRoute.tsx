"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isDashboard = pathname.startsWith("/dashboard");
    const isHome = pathname.startsWith("/home");

    useEffect(() => {
        if (isLoading) return; // Aguarda o carregamento antes de redirecionar

        if (!isAuthenticated) {
            router.replace("/login");
        } else if (isDashboard && !["master", "tecnico"].includes(user?.role || "")) {
            router.replace("/home");
        } else if (isHome && !["user", "member"].includes(user?.role || "")) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, isLoading, user, pathname, router]);

    if (isLoading) {
        return <p className="text-center text-lg">Carregando...</p>;
    }

    return isAuthenticated ? children : null;
}
