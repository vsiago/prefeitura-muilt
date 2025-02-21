// hooks/useBic.ts
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setCadastres, Cadastre } from "@/redux/slices/bicSlice";

export function useBic() {
    const dispatch = useDispatch<AppDispatch>();

    // 🔹 Obtém os cadastres do estado global Redux
    const cadastres = useSelector((state: RootState) => state?.bic?.cadastres ?? []);

    return {
        cadastres,
        setCadastres: (data: Cadastre[]) => dispatch(setCadastres(data)),
    };
}
