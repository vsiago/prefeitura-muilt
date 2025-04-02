"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Trash2, Pencil, MoreVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { unidadeAPI, type Unidade } from "@/lib/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const BASE_URL = "https://biometrico.itaguai.rj.gov.br"

export default function Home() {
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUnidade, setCurrentUnidade] = useState<Unidade | null>(null)
  const [formData, setFormData] = useState<
    Omit<Unidade, "id" | "created_at" | "updated_at" | "slug"> & { foto: string | File }
  >({
    nome: "",
    localizacao: "",
    foto: "/placeholder.svg",
  })
  const [previewImage, setPreviewImage] = useState<string>("/placeholder.svg")
  const [searchTerm, setSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [totalFuncionarios, setTotalFuncionarios] = useState(0)

  const [coordenadorDialogOpen, setCoordenadorDialogOpen] = useState(false)
  const [coordenadorUsername, setCoordenadorUsername] = useState("")
  const router = useRouter();
  const { user } = useAuth();

  // Impede acesso de Coordenador à página /biometrico-saude
  useEffect(() => {
    if (user && user.role === "Coordenador") {
      const biometricoSaudeApp = user.specificApplications.find(app => app.name === "Biométrico Saúde");
      if (biometricoSaudeApp?.unit) {
        router.replace(`/biometrico-saude/unidades/${biometricoSaudeApp.unit}`);
      } else {
        router.replace("/home");
      }
    }
  }, [user, router]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     if (!isLoading && user) {
  //       const specificApplications = user.specificApplications || [];
  //       const biometricoSaudeApp = specificApplications.find(app => app.name === "Biométrico Saúde");

  //       if (biometricoSaudeApp) {
  //         if (user.role === "Coordenador" && biometricoSaudeApp.unit) {
  //           router.replace(`/biometrico-saude/unidades/${biometricoSaudeApp.unit}`);
  //           return;
  //         } else if (user.role === "Master" && biometricoSaudeApp.unit === "Master") {
  //           router.replace("/biometrico-saude");
  //         } else if (user.role === "Técnico") {
  //           router.replace("/biometrico-saude");
  //         } else {
  //           router.replace("/home");
  //         }
  //       } else {
  //         router.replace("/home");
  //       }

  //       setIsLoading(false);
  //     }
  //   };

  //   const timer = setTimeout(checkAuth, 3000);
  //   return () => clearTimeout(timer);
  // }, [user, isLoading, router]);


  useEffect(() => {
    fetchUnidades().then(() => {
      if (unidades.length > 0) {
        fetchTotalFuncionarios()
      }
    })
  }, [])



  useEffect(() => {
    if (!isLoading && user) {
      const biometricoSaudeApp = user.specificApplications?.find(app => app.name === "Biométrico Saúde");

      if (biometricoSaudeApp) {
        if (user.role === "Coordenador" && biometricoSaudeApp.unit) {
          router.replace(`/biometrico-saude/unidades/${biometricoSaudeApp.unit}`);
          return;
        } else if (user.role === "Master" && biometricoSaudeApp.unit === "Master") {
          router.replace("/biometrico-saude");
        } else if (user.role === "Técnico") {
          router.replace("/biometrico-saude");
        } else {
          router.replace("/home");
        }
      } else {
        router.replace("/home");
      }

      setIsLoading(false);
    }
  }, [user, isLoading, router]);

  // Adicione outro useEffect para atualizar o total quando as unidades mudarem
  useEffect(() => {
    if (unidades.length > 0) {
      fetchTotalFuncionarios()
    }
  }, [unidades])

  const fetchUnidades = async () => {
    setIsLoading(true)
    try {
      const data = await unidadeAPI.getAll()
      setUnidades(data)
    } catch (error) {
      console.error("Erro ao carregar unidades:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as unidades",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTotalFuncionarios = async () => {
    try {
      // Buscar funcionários de todas as unidades
      let total = 0
      for (const unidade of unidades) {
        try {
          const funcionarios = await fetch(`${BASE_URL}/func/funcionarios/${unidade.id}`).then((res) =>
            res.ok ? res.json() : [],
          )
          total += Array.isArray(funcionarios) ? funcionarios.length : 0
        } catch (error) {
          console.error(`Erro ao buscar funcionários da unidade ${unidade.id}:`, error)
        }
      }
      setTotalFuncionarios(total)
    } catch (error) {
      console.error("Erro ao calcular total de funcionários:", error)
      setTotalFuncionarios(0)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Criar URL para preview da imagem
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)

      // Armazenar o arquivo para envio posterior
      setFormData((prev) => ({ ...prev, foto: file }))

      toast({
        title: "Imagem selecionada",
        description: "A imagem será enviada quando você salvar a unidade",
      })
    }
  }

  const handleSaveUnidade = async () => {
    if (!formData.nome) {
      toast({
        title: "Erro",
        description: "O nome da unidade é obrigatório",
        variant: "destructive",
      })
      return
    }

    try {
      // Preparar os dados para envio
      const formDataToSend = new FormData()
      formDataToSend.append("nome", formData.nome)

      if (formData.localizacao) {
        formDataToSend.append("localizacao", formData.localizacao)
      }

      // Verificar se a foto é um arquivo ou uma string
      if (formData.foto) {
        if (typeof formData.foto === "object") {
          // Se for um arquivo (do input file), anexar diretamente
          formDataToSend.append("foto", formData.foto)
          console.log("Anexando arquivo de imagem:", formData.foto.name)
        } else if (
          typeof formData.foto === "string" &&
          formData.foto !== "/placeholder.svg" &&
          formData.foto !== "/hospital-placeholder.jpg" &&
          !formData.foto.startsWith("blob:") &&
          !formData.foto.includes(`${BASE_URL}/uploads/`)
        ) {
          // Se for uma string que não é um placeholder ou URL de blob, anexar como string
          formDataToSend.append("foto", formData.foto)
          console.log("Anexando string de imagem:", formData.foto)
        }
      }

      // Logs para debug
      console.log("Dados do formulário:", {
        nome: formData.nome,
        localizacao: formData.localizacao,
        foto: typeof formData.foto === "object" ? "Arquivo de imagem" : formData.foto,
      })

      // Tentar diferentes endpoints
      let endpoint = ""
      let response = null

      if (isEditing && currentUnidade) {
        // Atualizar unidade existente via API
        endpoint = `${BASE_URL}/unid/unidade/${currentUnidade.id}`
        console.log("Tentando atualizar unidade no endpoint:", endpoint)

        response = await fetch(endpoint, {
          method: "PUT",
          body: formDataToSend,
        })

        console.log("Resposta do servidor (atualização):", {
          status: response.status,
          statusText: response.statusText,
        })
      } else {
        // Tentar primeiro endpoint para criar unidade
        endpoint = `${BASE_URL}/unid/unidades`
        console.log("Tentando criar unidade no endpoint:", endpoint)

        response = await fetch(endpoint, {
          method: "POST",
          body: formDataToSend,
        })

        console.log("Resposta do servidor (criação 1):", {
          status: response.status,
          statusText: response.statusText,
        })

        // Se o primeiro endpoint falhar, tentar o segundo
        if (response.status === 404) {
          endpoint = `${BASE_URL}/unid/unidade`
          console.log("Primeiro endpoint falhou. Tentando criar unidade no endpoint alternativo:", endpoint)

          response = await fetch(endpoint, {
            method: "POST",
            body: formDataToSend,
          })

          console.log("Resposta do servidor (criação 2):", {
            status: response.status,
            statusText: response.statusText,
          })
        }
      }

      if (!response.ok) {
        // Tentar obter detalhes do erro
        try {
          const errorText = await response.text()
          console.error("Detalhes do erro:", errorText)
        } catch (e) {
          console.error("Não foi possível obter detalhes do erro")
        }

        throw new Error(
          `Falha ao ${isEditing ? "atualizar" : "criar"} unidade: ${response.status} ${response.statusText}`,
        )
      }

      const responseData = await response.json()
      console.log("Dados recebidos do servidor:", responseData)

      const unidadeProcessada = isEditing ? responseData : responseData

      // Adiciona slug e formata a URL da foto
      unidadeProcessada.slug = unidadeProcessada.nome
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      unidadeProcessada.foto = unidadeProcessada.foto
        ? `${BASE_URL}/uploads/${unidadeProcessada.foto}`
        : "/hospital-placeholder.jpg"

      if (isEditing && currentUnidade) {
        setUnidades(unidades.map((u) => (u.id === currentUnidade.id ? unidadeProcessada : u)))
      } else {
        setUnidades([...unidades, unidadeProcessada])
      }

      toast({
        title: "Sucesso",
        description: isEditing ? "Unidade atualizada com sucesso" : "Unidade adicionada com sucesso",
      })

      // Resetar formulário e fechar diálogo
      setFormData({
        nome: "",
        localizacao: "",
        foto: "/placeholder.svg",
      })
      setPreviewImage("/placeholder.svg")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar unidade:", error)
      toast({
        title: "Erro",
        description: isEditing ? "Não foi possível atualizar a unidade" : "Não foi possível adicionar a unidade",
        variant: "destructive",
      })
    }
  }

  const handleOpenDialog = (unidade?: Unidade) => {
    if (unidade) {
      // Modo de edição
      setIsEditing(true)
      setCurrentUnidade(unidade)
      setFormData({
        nome: unidade.nome,
        localizacao: unidade.localizacao || "",
        foto: unidade.foto || "/placeholder.svg",
      })
      setPreviewImage(unidade.foto || "/placeholder.svg")
    } else {
      // Modo de criação
      setIsEditing(false)
      setCurrentUnidade(null)
      setFormData({
        nome: "",
        localizacao: "",
        foto: "/placeholder.svg",
      })
      setPreviewImage("/placeholder.svg")
    }
    setIsDialogOpen(true)
  }

  // Nova abordagem para exclusão - usando Dialog padrão em vez de AlertDialog
  const openConfirmDelete = (unidade: Unidade) => {
    setCurrentUnidade(unidade)
    setConfirmDeleteDialogOpen(true)
  }

  const cancelDelete = () => {
    setConfirmDeleteDialogOpen(false)
    setTimeout(() => {
      setCurrentUnidade(null)
    }, 100)
  }

  const confirmDelete = async () => {
    if (!currentUnidade) return

    try {
      const success = await unidadeAPI.delete(currentUnidade.id)

      if (success) {
        // Atualizar o estado local removendo a unidade excluída
        setUnidades((prev) => prev.filter((u) => u.id !== currentUnidade.id))

        toast({
          title: "Sucesso",
          description: "Unidade excluída com sucesso",
        })
      }
    } catch (error) {
      console.error("Erro ao excluir unidade:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a unidade",
        variant: "destructive",
      })
    } finally {
      // Sempre fechar o diálogo e limpar o estado, independentemente do resultado
      setConfirmDeleteDialogOpen(false)
      setTimeout(() => {
        setCurrentUnidade(null)
      }, 100)
    }
  }

  const handleCadastrarCoordenador = async () => {
    if (!currentUnidade) return

    if (!coordenadorUsername || !coordenadorUsername.includes(".")) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome de usuário válido no formato user.name",
        variant: "destructive",
      })
      return
    }

    try {
      // Obter token do usuário Master logado (você precisará implementar isso conforme sua autenticação)
      const token = localStorage.getItem("token") || sessionStorage.getItem("authToken") || ""

      const payload = {
        username: coordenadorUsername,
        apps: [
          {
            name: "Biométrico Saúde",
            type: "Coordenador",
            unit:
              currentUnidade.slug ||
              currentUnidade.nome
                .toLowerCase()
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "-"),
          },
        ],
      }

      const response = await fetch("https://api.prefeitura.itaguai.rj.gov.br/api/apps/install", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Falha ao cadastrar coordenador: ${response.status} ${response.statusText} - ${errorText}`)
      }

      toast({
        title: "Sucesso",
        description: `Coordenador ${coordenadorUsername} cadastrado com sucesso para a unidade ${currentUnidade.nome}`,
      })

      setCoordenadorDialogOpen(false)
      setCoordenadorUsername("")
    } catch (error) {
      console.error("Erro ao cadastrar coordenador:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o coordenador. Verifique se você tem permissões adequadas.",
        variant: "destructive",
      })
    }
  }

  const filteredUnidades = unidades.filter(
    (unidade) =>
      unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unidade.localizacao && unidade.localizacao.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <div className="flex justify-between mb-4">
        <div className="text-lg font-medium text-gray-600">Unidades Cadastradas</div>
        <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg">Cadastro de unidades</div>
      </div>

      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gray-100 rounded-full p-8 mb-6">
          <Image src="/placeholder.svg" alt="Hospital" width={120} height={120} className="opacity-40" />
        </div>
        <h3 className="text-xl font-medium text-gray-500 mb-2">Sem unidades</h3>
        <p className="text-gray-400 mb-8">Comece adicionando uma nova unidade.</p>

        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Adicionar unidade
        </Button>
      </div>
    </div>
  )

  const renderUnidadesList = () => (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200 hover:shadow"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nova Unidade
        </Button>

        <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-end">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total de Unidades</div>
              <div className="font-semibold text-blue-700">{filteredUnidades.length}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Total de Funcionários</div>
              <div className="font-semibold text-green-700">{totalFuncionarios}</div>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Input
            placeholder="Busque uma unidade..."
            className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-300 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          {searchTerm && (
            <button
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnidades.map((unidade) => (
          <div
            key={unidade.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden border border-gray-100"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

            <Link
              href={`biometrico-saude/unidades/${unidade.slug ||
                unidade.nome
                  .toLowerCase()
                  .replace(/[^\w\s]/gi, "")
                  .replace(/\s+/g, "-")
                }`}
              className="block h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <Image
                  src={unidade.foto || "/hospital-placeholder.jpg"}
                  alt={unidade.nome}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 py-1 px-2 rounded-full z-10 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 inline mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {unidade.localizacao ? unidade.localizacao.split(",")[0] : "Localização não informada"}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-1 group-hover:text-blue-600">
                      {unidade.nome}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {unidade.localizacao || "Endereço não informado"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-600">
                    <span className="font-medium">Ver detalhes</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center justify-center w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-500">Ativa</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Menu de ações */}
            <div className="absolute top-3 right-3 z-20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleOpenDialog(unidade)} className="cursor-pointer">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar unidade
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentUnidade(unidade)
                      setCoordenadorUsername("")
                      setCoordenadorDialogOpen(true)
                    }}
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Cadastrar Coordenador
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openConfirmDelete(unidade)}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir unidade
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : unidades.length === 0 ? (
        renderEmptyState()
      ) : (
        renderUnidadesList()
      )}

      {/* Diálogo para adicionar/editar unidade */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-center mb-6">
              {isEditing ? "Editar unidade" : "Cadastro nova unidade"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="flex justify-center">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg w-full h-48 flex flex-col items-center justify-center bg-gray-50 cursor-pointer overflow-hidden relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewImage !== "/placeholder.svg" ? (
                  <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Clique para fazer upload da imagem</p>
                    <p className="text-gray-400 text-sm">PNG, JPG, GIF até 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nome">Nome da unidade</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-gray-100 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="localizacao">Endereço da unidade</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                className="bg-gray-100 mt-1"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUnidade} className="bg-blue-500 hover:bg-blue-600 text-white">
              {isEditing ? "Salvar alterações" : "Adicionar unidade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Novo diálogo de confirmação para excluir unidade */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir unidade</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir a unidade "{currentUnidade?.nome}"? Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para cadastrar coordenador */}
      <Dialog open={coordenadorDialogOpen} onOpenChange={setCoordenadorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-center mb-6">Cadastrar Coordenador</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <Label htmlFor="unidade-nome">Nome da unidade</Label>
              <Input id="unidade-nome" value={currentUnidade?.nome || ""} className="bg-gray-100 mt-1" disabled />
            </div>

            <div>
              <Label htmlFor="unidade-url">URL</Label>
              <Input
                id="unidade-url"
                value={
                  currentUnidade
                    ? currentUnidade.slug ||
                    currentUnidade.nome
                      .toLowerCase()
                      .replace(/[^\w\s]/gi, "")
                      .replace(/\s+/g, "-")
                    : ""
                }
                className="bg-gray-100 mt-1"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="funcao">Função</Label>
              <Input id="funcao" value="Coordenador" className="bg-gray-100 mt-1" disabled />
            </div>

            <div>
              <Label htmlFor="username">Username (formato user.name)</Label>
              <Input
                id="username"
                value={coordenadorUsername}
                onChange={(e) => setCoordenadorUsername(e.target.value.toLowerCase())}
                placeholder="exemplo.usuario"
                className="bg-white mt-1 border-gray-300 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o nome de usuário no formato user.name (baseado no AD)
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setCoordenadorDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCadastrarCoordenador} className="bg-blue-500 hover:bg-blue-600 text-white">
              Cadastrar Coordenador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

