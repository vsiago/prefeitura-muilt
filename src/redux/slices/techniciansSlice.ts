// redux/slices/techniciansSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Technician {
    id: string;
    name: string;
    cpf: string;
    email: string;
    telefone: string;
    ativo: boolean;
}

interface TechniciansState {
    technicians: Technician[];
    currentTechnician: Partial<Technician>;
}

const initialState: TechniciansState = {
    technicians: [],
    currentTechnician: {},
};

export const techniciansSlice = createSlice({
    name: "technicians",
    initialState,
    reducers: {
        setTechnicians: (state, action: PayloadAction<Technician[]>) => {
            state.technicians = action.payload;
        },
        addTechnician: (state, action: PayloadAction<Technician>) => {
            state.technicians.push(action.payload);
        },
        editTechnician: (state, action: PayloadAction<Technician>) => {
            const index = state.technicians.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.technicians[index] = action.payload;
            }
        },
        deleteTechnician: (state, action: PayloadAction<string>) => {
            state.technicians = state.technicians.filter(t => t.id !== action.payload);
        },
        setCurrentTechnician: (state, action: PayloadAction<Technician>) => {
            state.currentTechnician = action.payload;
        },
    },
});

export const { setTechnicians, addTechnician, editTechnician, deleteTechnician, setCurrentTechnician } = techniciansSlice.actions;

export default techniciansSlice.reducer;
