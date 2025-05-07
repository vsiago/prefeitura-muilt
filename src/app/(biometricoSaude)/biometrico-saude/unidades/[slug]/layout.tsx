"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { unidadeAPI, type Unidade } from "@/lib/api"
import { Home, Users, Calendar, FileText, Settings, Menu, X, ChevronRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { BiometricKiosk } from "@/components/biometric-kiosk"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function UnidadeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const slug = params.slug as string
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { canAccessSettings } = useAuth()

  // Primeiro, adicione um novo estado para controlar o modo quiosque
  const [isKioskMode, setIsKioskMode] = useState(false)

  // 2. Adicione os estados para o modal de senha
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const passwordInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchUnidade = async () => {
      setIsLoading(true)
      try {
        const data = await unidadeAPI.getBySlug(slug)
        setUnidade(data)
      } catch (error) {
        console.error("Erro ao carregar unidade:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnidade()
  }, [slug])

  // Primeiro, vamos atualizar a função getActiveMenuItem para incluir a opção de férias
  const getActiveMenuItem = () => {
    if (pathname.includes("/funcionarios")) return "funcionarios"
    if (pathname.includes("/calendario")) return "calendario"
    if (pathname.includes("/relatorios")) return "relatorios"
    if (pathname.includes("/configuracoes")) return "configuracoes"
    if (pathname.includes("/ferias")) return "ferias"
    return "overview"
  }

  const activeMenuItem = getActiveMenuItem()

  // 3. Substitua a função toggleKioskMode por estas duas funções
  const enterKioskMode = () => {
    setIsKioskMode(true)
    setIsSidebarOpen(false)
  }

  const exitKioskMode = () => {
    // Abrir o modal de senha em vez de sair diretamente
    setIsPasswordModalOpen(true)
    // Focar no input de senha quando o modal abrir
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus()
      }
    }, 100)
  }

  // 4. Adicione esta função para verificar a senha
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Senha padrão: admin123
    if (password === "Admin@123") {
      setIsKioskMode(false)
      setIsPasswordModalOpen(false)
      setPassword("")
      setPasswordError("")
      // Garantir que a sidebar esteja aberta ao sair do modo quiosque
      setIsSidebarOpen(true)
    } else {
      setPasswordError("Senha incorreta. Tente novamente.")
      setPassword("")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!unidade) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <h1 className="text-2xl font-bold mb-4">Unidade não encontrada</h1>
        <p className="mb-6">A unidade que você está procurando não existe ou foi removida.</p>
        <Link href="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    )
  }

  // Modifique a estrutura do return para incluir o modo quiosque
  return (
    <div className="flex flex-col bg-gray-100">
      {/* Header específico da unidade - escondido no modo quiosque */}
      {!isKioskMode && (
        <header className="bg-white border-b shadow-sm">
          <div className="px-4 py-3 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 md:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>

                <div className="hidden md:flex items-center">
                  <Link href="/biometrico-saude" className="text-gray-500 hover:text-gray-700">
                    Unidades
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span className="font-medium text-blue-600">{unidade.nome}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Unidade de saúde</div>
                  <div className="text-lg font-semibold text-blue-800">{unidade.nome}</div>
                </div>

                {/* canAccessSettings() Botão para alternar o modo quiosque - apenas para coordenadores e acima */}
                {true && (
                  <Button variant="outline" size="sm" onClick={enterKioskMode} className="ml-2">
                    Modo Quiosque
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1">
        {/* Sidebar específica da unidade - escondida no modo quiosque */}
        {!isKioskMode && (
          <aside
            className={`bg-white shadow-md w-64 min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } fixed md:static z-10`}
          >
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/biometrico-saude/unidades/${slug}`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "overview" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Home size={18} />
                    <span>Visão Geral</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/biometrico-saude/unidades/${slug}/funcionarios`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "funcionarios" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Users size={18} />
                    <span>Funcionários</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/biometrico-saude/unidades/${slug}/calendario`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "calendario" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                    <span>Calendário</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/biometrico-saude/unidades/${slug}/ferias`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "ferias" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                    <span>Férias</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/biometrico-saude/unidades/${slug}/relatorios`}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "relatorios" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <FileText size={18} />
                    <span>Relatórios</span>
                  </Link>
                </li>
                {canAccessSettings() && (
                  <li>
                    <Link
                      href={`/biometrico-saude/unidades/${slug}/configuracoes`}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "configuracoes"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <Settings size={18} />
                      <span>Configurações</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Voltar para unidades</span>
              </Link>
            </div>
          </aside>
        )}

        {/* Conteúdo principal */}
        <main className={`flex-1 ${isKioskMode ? "" : "p-0"}`}>
          {/* Overlay para fechar o menu em dispositivos móveis */}
          {isSidebarOpen && !isKioskMode && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Barra de controle do modo quiosque */}
          {isKioskMode && (
            <div className="fixed top-0 right-0 z-[60] opacity-0 hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={exitKioskMode} className="bg-transparent border-none">
                <Lock size={16} className="text-gray-400" />
              </Button>
            </div>
          )}

          {/* Renderiza o componente de quiosque no modo quiosque, ou o conteúdo normal */}
          {isKioskMode ? <BiometricKiosk unidade={unidade} /> : children}
        </main>
      </div>
      {isPasswordModalOpen && (
        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sair do Modo Quiosque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Digite a senha para sair do modo quiosque:
                  </label>
                  <Input
                    id="password"
                    type="password"
                    ref={passwordInputRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                    placeholder="Digite a senha..."
                  />
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Confirmar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
