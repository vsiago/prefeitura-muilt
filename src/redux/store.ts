// store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cadastresReducer from "./slices/cadastresSlice";
import techniciansReducer from "./slices/techniciansSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cadastres: cadastresReducer,
    technicians: techniciansReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
