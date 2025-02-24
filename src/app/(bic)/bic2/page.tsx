"use client"

import { useEffect } from "react";
import { useCadastres } from "@/hooks/useCadastres";

export default function LoadCadastres() {
    const { setCadastres } = useCadastres();

    useEffect(() => {
        // Simula chamada de API
        setTimeout(() => {
            const fakeCadastres = [
                { id: "1", inscricao: "12345", lancamento: "2025-02-04", revisao: "2025-02-08" },
            ];
            console.log("✅ Carregando cadastres no Redux:", fakeCadastres);
            setCadastres(fakeCadastres);
        }, 2000);
    }, []);

    return null;
}
