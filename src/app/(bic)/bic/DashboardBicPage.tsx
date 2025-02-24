"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CadastreList } from "./cadastre-list";
import { CadastreModal } from "./cadastre-modal";
import { useCadastres } from "@/hooks/useCadastres";
import { Cadastre } from "@/redux/slices/cadastresSlice";

export default function DashboardBicPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Pegando os cadastres corretamente
    const { cadastres, setCadastres, addCadastre } = useCadastres();

    const resetCurrentCadastre = () => {
        setCadastres([]); // Se precisar resetar um cadastro específico, ajuste isso no slice
    };

    const handleAddNew = () => {
        setIsEditing(false);
        resetCurrentCadastre();
        setIsModalOpen(true);
    };

    const handleSaveCadastre = (novoCadastro: Cadastre) => {
        addCadastre(novoCadastro); // Adiciona o novo cadastro ao Redux
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4 w-full container mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary10">Cadastros</h1>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nova Inscrição
                </Button>
            </div>

            <CadastreList onEdit={() => { }} />

            <CadastreModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isEditing={isEditing}
                resetCurrentCadastre={resetCurrentCadastre}
                onSave={handleSaveCadastre} // Passa a função para o modal salvar
            />
        </div>
    );
}
