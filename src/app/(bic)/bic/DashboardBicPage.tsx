"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CadastreList } from "./cadastre-list";
import { CadastreModal } from "./cadastre-modal";
import { RootState } from "@/redux/store";
import { Cadastre, updateCurrentCadastre, setCadastres } from "@/redux/slices/bicSlice";
import axios from "axios";

export default function DashboardBicPage() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const cadastres = useSelector((state: RootState) => state?.bic?.cadastres ?? []);

    // Buscar cadastros ao montar o componente
    useEffect(() => {
        async function fetchCadastres() {
            try {
                const response = await axios.get("/api/bic/cadastres");
                dispatch(setCadastres(response.data));
            } catch (error) {
                console.error("Erro ao buscar cadastres:", error);
            } finally {
                setIsFetching(false);
            }
        }

        if (cadastres.length === 0) {
            fetchCadastres();
        } else {
            setIsFetching(false);
        }
    }, [dispatch, cadastres.length]);

    const resetCurrentCadastre = () => {
        dispatch(updateCurrentCadastre({}));
    };

    const handleAddNew = () => {
        setIsEditing(false);
        resetCurrentCadastre();
        setIsModalOpen(true);
    };

    const handleEdit = (cadastre: Cadastre) => {
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4 w-full container mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-700">Cadastros</h1>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nova Inscrição
                </Button>
            </div>

            {isFetching ? (
                <p className="text-gray-500">Carregando cadastros...</p>
            ) : (
                <CadastreList onEdit={handleEdit} />
            )}

            <CadastreModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isEditing={isEditing}
                resetCurrentCadastre={resetCurrentCadastre}
            />
        </div>
    );
}
