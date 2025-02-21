import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bicReducer from "./slices/bicSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bic: bicReducer, // 🔹 Confirme que não existe "cadastre" aqui
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
