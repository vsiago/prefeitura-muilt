// redux/slices/bicSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BicState {
    cadastres: Cadastre[];
    currentCadastre: Partial<Cadastre>;
}

export interface Cadastre {
    id: string;
    inscricao: string;
    lancamento: string;
    revisao: string;
    lote: string;
    quadra: string;
    loteamento: string;
    distrito: string;
    endereco: string;
    cep: string;
    proprietario: string;
    cpf: string;
    telefone: string;
    logradouro: string[];
    situacao: string;
    caracteristicasSolo: string;
    topografia: string;
    nivelamento: string;
    quantidadePavimentos: number;
    areaTerreno: number;
    testada: number;
    areaEdificada: number;
    tipo: string[];
    uso: string[];
    tipoConstrucao: string[];
    esquadrias: string[];
    piso: string[];
    forro: string[];
    cobertura: string[];
    acabamentoInterno: string[];
    acabamentoExterno: string[];
}

const initialState: BicState = {
    cadastres: [],
    currentCadastre: {},
};

export const bicSlice = createSlice({
    name: "bic",
    initialState,
    reducers: {
        setCadastres: (state, action: PayloadAction<Cadastre[]>) => {
            state.cadastres = action.payload;
        },
        updateCurrentCadastre: (state, action: PayloadAction<Partial<Cadastre>>) => {
            state.currentCadastre = { ...state.currentCadastre, ...action.payload };
        },
        addCadastre: (state, action: PayloadAction<Cadastre>) => {
            state.cadastres.push(action.payload);
            state.currentCadastre = {};
        },
        editCadastre: (state, action: PayloadAction<Cadastre>) => {
            const index = state.cadastres.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.cadastres[index] = action.payload;
            }
        },
        deleteCadastre: (state, action: PayloadAction<string>) => {
            state.cadastres = state.cadastres.filter((c) => c.id !== action.payload);
        },
        setCurrentCadastre: (state, action: PayloadAction<Cadastre>) => {
            state.currentCadastre = action.payload;
        },
    },
});

export const { setCadastres, updateCurrentCadastre, addCadastre, editCadastre, deleteCadastre, setCurrentCadastre } =
    bicSlice.actions;

export default bicSlice.reducer;
