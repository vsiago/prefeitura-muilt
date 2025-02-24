import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setCadastres, addCadastre, Cadastre } from "@/redux/slices/cadastresSlice";

export function useCadastres() {
    const dispatch = useDispatch<AppDispatch>();

    const cadastres = useSelector((state: RootState) => state?.cadastres?.cadastres ?? []);

    console.log("timing Hook", cadastres);

    return {
        cadastres,
        setCadastres: (data: Cadastre[]) => dispatch(setCadastres(data)),
        addCadastre: (cadastro: Cadastre) => dispatch(addCadastre(cadastro)), // Adicionado
    };
}
