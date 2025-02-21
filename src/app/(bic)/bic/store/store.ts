import { configureStore } from "@reduxjs/toolkit"
import cadastreReducer from "./cadastreSlice"

export const store = configureStore({
  reducer: {
    cadastre: cadastreReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

