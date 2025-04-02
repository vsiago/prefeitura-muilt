"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function AuthBicPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            if (!isLoading && user) {
                const specificApplications = user.specificApplications || [];
                const biometricoSaudeApp = specificApplications.find(app => app.name === "Biométrico Saúde");

                if (biometricoSaudeApp) {
                    if (user.role === "Coordenador" && biometricoSaudeApp.unit) {
                        router.replace(`/biometrico-saude/unidades/${biometricoSaudeApp.unit}`);
                    } else if (user.role === "Master" && biometricoSaudeApp.unit === "Master") {
                        router.replace("/biometrico-saude");
                    } else if (user.role === "Técnico") {
                        router.replace("/biometrico-saude");
                    } else {
                        router.replace("/home");
                    }
                } else {
                    router.replace("/home");
                }

                setLoading(false);
            }
        };

        const timer = setTimeout(checkAuth, 3000);
        return () => clearTimeout(timer);
    }, [user, isLoading, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50">
                <Image
                    src="/images/logo-prefeitura-itaguai.png"
                    alt="Logo Prefeitura Municipal de Itaguaí"
                    width={150}
                    height={150}
                    className="mb-6"
                />
                <div className="w-64 h-2 bg-gray-300 rounded overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-4 text-xl text-transparent bg-gradient-to-r from-slate-300 via-slate-500 to-slate-300 bg-[length:200%_auto] animate-[shine_2s_linear_infinite] bg-clip-text">
                    Validando e entrando no app...
                </p>
                <style jsx>{`
                    @keyframes shine {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </div>
        );
    }

    return null;
}
