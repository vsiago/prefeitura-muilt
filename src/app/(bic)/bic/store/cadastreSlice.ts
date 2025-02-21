import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CadastreState {
  cadastres: Cadastre[]
  currentCadastre: Partial<Cadastre>
}

export interface Cadastre {
  id: string
  inscricao: string
  lancamento: string
  revisao: string
  lote: string
  quadra: string
  loteamento: string
  distrito: string
  endereco: string
  cep: string
  proprietario: string
  cpf: string
  telefone: string
  logradouro: string[]
  situacao: string
  caracteristicasSolo: string
  topografia: string
  nivelamento: string
  quantidadePavimentos: number
  areaTerreno: number
  testada: number
  areaEdificada: number
  tipo: string[]
  uso: string[]
  tipoConstrucao: string[]
  esquadrias: string[]
  piso: string[]
  forro: string[]
  cobertura: string[]
  acabamentoInterno: string[]
  acabamentoExterno: string[]
}

const initialState: CadastreState = {
  cadastres: [],
  currentCadastre: {},
}

export const cadastreSlice = createSlice({
  name: "cadastre",
  initialState,
  reducers: {
    updateCurrentCadastre: (state, action: PayloadAction<Partial<Cadastre>>) => {
      state.currentCadastre = { ...state.currentCadastre, ...action.payload }
    },
    addCadastre: (state, action: PayloadAction<Cadastre>) => {
      state.cadastres.push(action.payload)
      state.currentCadastre = {}
    },
    editCadastre: (state, action: PayloadAction<Cadastre>) => {
      const index = state.cadastres.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.cadastres[index] = action.payload
      }
    },
    deleteCadastre: (state, action: PayloadAction<string>) => {
      state.cadastres = state.cadastres.filter((c) => c.id !== action.payload)
    },
    setCurrentCadastre: (state, action: PayloadAction<Cadastre>) => {
      state.currentCadastre = action.payload
    },
  },
})

export const { updateCurrentCadastre, addCadastre, editCadastre, deleteCadastre, setCurrentCadastre } =
  cadastreSlice.actions

export default cadastreSlice.reducer

