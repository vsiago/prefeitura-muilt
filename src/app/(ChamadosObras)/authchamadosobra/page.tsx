"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth"; // Hook para obter os dados do usuário

export default function AuthBicPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    // Simula a barra de progresso
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    // Verifica a autenticação e autorização
    useEffect(() => {
        const checkAuth = async () => {
            if (!isLoading) {
                if (user && (user.role === "Coordenador" || (user.role === "Técnico" && user.specificApplications?.includes("Chamados Obra")))) {
                    router.replace("/chamados-obra");
                } else {
                    router.replace("/home");
                }
                setLoading(false);
            }
        };

        setTimeout(checkAuth, 3000); // Simulação de tempo de verificação
    }, [user, isLoading, router]);

    // Exibe a tela de carregamento enquanto verifica a autenticação
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
                {/* Efeito de farol com movimento contínuo */}
                <p className="mt-4 text-xl text-transparent bg-gradient-to-r from-slate-300 via-slate-500 to-slate-300 bg-[length:200%_auto] animate-[shine_2s_linear_infinite] bg-clip-text">
                    Validando e entrando no app...
                </p>

                {/* Definição da animação personalizada */}
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
