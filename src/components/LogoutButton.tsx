"use client";  // Garante que o código será executado no client-side

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { useAuth } from "../context/UserContext";


export default async function HomePage() {
  const { logout } = useAuth();

  const token = (await cookies()).get("user")?.value;

  if (!token) {
    redirect("/login"); // Impede renderização se não estiver autenticado
  }

  const handleLogout = () => {
    // Remover o cookie 'user' ao deslogar
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Redirecionar para login após logout
    redirect("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold">Bem-vindo à área privada!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Deslogar
      </button>
    </main>
  );
}
