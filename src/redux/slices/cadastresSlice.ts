// redux/slices/cadastresSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface CadastresState {
    cadastres: Cadastre[];
    currentCadastre: Partial<Cadastre>;
}

const initialState: CadastresState = {
    cadastres: [],
    currentCadastre: {},
};

export const cadastresSlice = createSlice({
    name: "cadastres",
    initialState,
    reducers: {
        setCadastres: (state, action: PayloadAction<Cadastre[]>) => {
            state.cadastres = action.payload;
        },
        addCadastre: (state, action) => {
            state.cadastres = [...state.cadastres, action.payload];
        },
        editCadastre: (state, action: PayloadAction<Cadastre>) => {
            const index = state.cadastres.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.cadastres[index] = action.payload;
            }
        },
        deleteCadastre: (state, action: PayloadAction<string>) => {
            state.cadastres = state.cadastres.filter(c => c.id !== action.payload);
        },
        setCurrentCadastre: (state, action: PayloadAction<Cadastre>) => {
            state.currentCadastre = action.payload;
        },
        updateCurrentCadastre: (state, action: PayloadAction<Partial<Cadastre>>) => {
            state.currentCadastre = { ...state.currentCadastre, ...action.payload };
        },
    },
});

export const { setCadastres, addCadastre, editCadastre, deleteCadastre, setCurrentCadastre, updateCurrentCadastre } = cadastresSlice.actions;

export default cadastresSlice.reducer;
