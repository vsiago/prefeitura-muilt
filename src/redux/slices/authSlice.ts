import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface App {
  map(arg0: (app: any) => import("react").JSX.Element): import("react").ReactNode;
  id: string;
  name: string;
  icon: string;
  description: string;
  status: string;
  updatedAt: string;
  url: string;
  category: string; // Adicionado para evitar erros ao acessar app.category
}

export interface User {
  usersByGroup(usersByGroup: any): unknown;
  specificApplications: any;
  usersByGroups: any;
  id: string;
  name: string;
  role: "Master" | "Cidadão" | "Servidor" | "Técnico" | "Servidor";
  apps: App[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
}


const initialState: AuthState = {
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
