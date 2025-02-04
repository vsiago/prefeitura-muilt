"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/UserContext";
import { Toaster, toast } from "sonner";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  if (!auth) return null; // Verificação de segurança

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.login(username, password);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        // router.push("/dashboard");
      }, 2000); // Tempo de espera antes de redirecionar
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setTimeout(() => setLoading(false), 1500); // Delay para melhorar UX
    }
  };

  return (
    <main className="min-h-screen bg-bg60 flex items-center justify-center">
      <Toaster />
      <Card className="w-full sm:max-w-[60%] md:max-w-[50%] lg:max-w-[30%] bg-white/50 border-2 border-white py-10">
        <CardHeader className="text-center">
          <Image
            width={150}
            height={150}
            alt="Logo Prefeitura Municipal de Itaguaí"
            src={"/images/logo-prefeitura-itaguai.png"}
            className="mx-auto mb-6"
          />
          <CardTitle className="font-bold text-2xl text-primary30">Acessar Prefeitura</CardTitle>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
