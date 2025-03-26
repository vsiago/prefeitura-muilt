"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Ou verifique via Context/API

    if (token) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, []);

  return <p>Redirecionando...</p>;
}
