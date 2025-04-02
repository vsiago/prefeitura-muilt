"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { unidadeAPI, type Unidade } from "@/lib/api"
import { Home, Users, Calendar, FileText, Settings, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  // Determina qual item do menu está ativo
  const getActiveMenuItem = () => {
    if (pathname.includes("/funcionarios")) return "funcionarios"
    if (pathname.includes("/calendario")) return "calendario"
    if (pathname.includes("/relatorios")) return "relatorios"
    if (pathname.includes("/configuracoes")) return "configuracoes"
    return "overview"
  }

  const activeMenuItem = getActiveMenuItem()

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

  return (
    <div className="flex flex-col  bg-gray-100">
      {/* Header específico da unidade */}
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar específica da unidade */}
        <aside
          className={`bg-white shadow-md w-64 transition-all duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                  href={`/biometrico-saude/unidades/${slug}/relatorios`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "relatorios" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <FileText size={18} />
                  <span>Relatórios</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/biometrico-saude/unidades/${slug}/configuracoes`}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${activeMenuItem === "configuracoes" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Settings size={18} />
                  <span>Configurações</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span>Voltar para unidades</span>
            </Link>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6">
          {/* Overlay para fechar o menu em dispositivos móveis */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {children}
        </main>
      </div>
    </div>
  )
}

