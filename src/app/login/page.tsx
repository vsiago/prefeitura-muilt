"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress"; // Importando a barra de progresso do ShadCN

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (showSplash) {
      let interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return oldProgress + 20; // Aumenta progressivamente
        });
      }, 800); // Atualiza a barra a cada 800ms

      return () => clearInterval(interval);
    }
  }, [showSplash]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3333/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ data: username, password }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas!");

      const { user, token } = await response.json();
      dispatch(loginSuccess({ user, token }));

      document.cookie = `token=${token}; path=/;`;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login realizado com sucesso!");

      // Aguarde a atualização do estado antes de redirecionar
      setTimeout(() => {
        setShowSplash(true);

        setTimeout(() => {
          if (user && user.role) {
            router.replace(user.role === "Master" || user.role === "Técnico" ? "/home" : "/home");
          }
          setLoading(false);
        }, 3000);
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };


  // Se a splash estiver ativa, exibe a tela de splash
  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <Image
          src="/images/logo-prefeitura-itaguai.png"
          alt="Logo Prefeitura Municipal de Itaguaí"
          width={150}
          height={150}
          className="mb-6"
        />
        <Progress value={progress} className="w-64 h-2 bg-gray-300">
          <div className="h-full bg-green-500" />
        </Progress>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg60 flex items-center justify-center">
      <Toaster />
      <Card className="w-full sm:max-w-[60%] md:max-w-[50%] lg:max-w-[30%] bg-white/50  border-2 border-white py-10">
        <CardHeader className="text-center">
          <Image
            width={150}
            height={150}
            alt="Logo Prefeitura Municipal de Itaguaí"
            src={"/images/logo-prefeitura-itaguai.png"}
            className="mx-auto mb-6"
          />
          <CardTitle className="font-bold text-2xl text-primary30">
            Acessar Prefeitura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              {/* Campo de Usuário */}
              <div className="relative w-full">
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  className="pl-5"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="w-5 h-5" />
                </span>
              </div>

              {/* Campo de Senha */}
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="pr-5 pl-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className={`w-full my-5 mt-20 ${loading ? "bg-green-500" : ""}`}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
