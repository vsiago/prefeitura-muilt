"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/store/slices/authSlice";

export default function AuthRehydrate() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            dispatch(loginSuccess({ user: JSON.parse(savedUser), token }));
        }
    }, [dispatch]);

    return null; // Não renderiza nada na tela
}
