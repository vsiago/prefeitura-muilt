"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../redux/slices/authSlice";
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  UserPlus,
  Trash2,
  Pencil,
  Loader2,
  Fingerprint,
  Check,
  Loader,
  User,
  CreditCard,
  Calendar,
  Briefcase,
  Clock,
  Mail,
  Phone,
  AlertCircle,
  Info,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { unidadeAPI, funcionarioAPI, type Unidade, type Funcionario } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import https from "https"

export default function FuncionariosPage() {
  const params = useParams()
  const slug = params.slug as string
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [funcionarioToDelete, setFuncionarioToDelete] = useState<string | null>(null)
  const [biometricStatus, setBiometricStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [currentStep, setCurrentStep] = useState(1)
  const [currentFuncionario, setCurrentFuncionario] = useState<Funcionario>({
    id: undefined,
    nome: "",
    cargo: "",
    unidade_id: "",
    cpf: "",
    data_admissao: "",
    matricula: 0,
    email: "",
    telefone: "",
    id_biometrico: "",
    tipo_escala: "8h",
  })
  const user = useSelector(selectUser);

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Buscar unidade pelo slug
        const unidadeData = await unidadeAPI.getBySlug(slug)
        if (unidadeData) {
          setUnidade(unidadeData)

          try {
            // Buscar funcionários da unidade diretamente da API
            const funcionariosData = await funcionarioAPI.getByUnidade(unidadeData.id)
            setFuncionarios(funcionariosData)
          } catch (funcionariosError) {
            console.error("Erro ao carregar funcionários:", funcionariosError)
            toast({
              title: "Erro",
              description: "Não foi possível carregar os funcionários. Tente novamente mais tarde.",
              variant: "destructive",
            })
            // Definir uma lista vazia em caso de erro
            setFuncionarios([])
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da unidade",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug, toast])

  const handleOpenDialog = (funcionario?: Funcionario) => {
    if (funcionario) {
      setCurrentFuncionario({
        id: funcionario.id,
        nome: funcionario.nome,
        cargo: funcionario.cargo,
        unidade_id: funcionario.unidade_id,
        cpf: funcionario.cpf || "",
        data_admissao: funcionario.data_admissao || "",
        matricula: funcionario.matricula || 0,
        email: funcionario.email || "",
        telefone: funcionario.telefone || "",
        id_biometrico: funcionario.id_biometrico || "",
        tipo_escala: funcionario.tipo_escala || "40 horas – 8h às 18h, segunda a sexta-feira.",
      })
      setIsEditMode(true)
    } else {
      setCurrentFuncionario({
        nome: "",
        cargo: "",
        unidade_id: unidade?.id || "",
        cpf: "",
        data_admissao: "",
        matricula: 0,
        email: "",
        telefone: "",
        id_biometrico: "",
        tipo_escala: "8h",
      })
      setIsEditMode(false)
    }
    setCurrentStep(1)
    setBiometricStatus("idle")
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (id: string) => {
    setFuncionarioToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleAddFuncionario = async () => {
    console.log("Data de admissão enviada:", currentFuncionario.data_admissao)

    if (!currentFuncionario.nome || !currentFuncionario.cargo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Garantir que todos os campos estejam incluídos no payload
      const funcionarioPayload = {
        ...currentFuncionario,
        unidade_id: unidade?.id || "",
      }

      console.log("[ADD_FUNCIONARIO] Payload completo enviado para API:", JSON.stringify(funcionarioPayload, null, 2))

      if (isEditMode) {
        // Atualizar funcionário existente diretamente na API
        console.log("ID do funcionário a ser atualizado:", (currentFuncionario as Funcionario).id)

        const funcionarioAtualizado = await funcionarioAPI.update(
          (currentFuncionario as Funcionario).id,
          funcionarioPayload,
        )

        console.log("[ADD_FUNCIONARIO] Resposta da API (atualização):", JSON.stringify(funcionarioAtualizado, null, 2))

        if (funcionarioAtualizado) {
          // Atualizar o funcionário na lista local
          setFuncionarios((prevFuncionarios) =>
            prevFuncionarios.map((f) =>
              f.id === (currentFuncionario as Funcionario).id ? { ...f, ...funcionarioAtualizado } : f,
            ),
          )

          toast({
            title: "Sucesso",
            description: "Funcionário atualizado com sucesso",
          })
        }
      } else {
        // Criar novo funcionário diretamente na API
        console.log("[ADD_FUNCIONARIO] Modo de criação")
        const novoFuncionario = await funcionarioAPI.create({
          ...currentFuncionario,
          unidade_id: unidade?.id || "",
        })

        console.log("[ADD_FUNCIONARIO] Resposta da API (criação):", JSON.stringify(novoFuncionario, null, 2))

        if (novoFuncionario) {
          // Adicionar o novo funcionário à lista local
          setFuncionarios((prevFuncionarios) => [...prevFuncionarios, novoFuncionario])

          toast({
            title: "Sucesso",
            description: "Funcionário adicionado com sucesso",
          })
        }
      }

      // Fechar o modal
      setIsDialogOpen(false)

      // Resetar o estado do formulário
      setCurrentFuncionario({
        nome: "",
        cargo: "",
        unidade_id: unidade?.id || "",
        cpf: "",
        data_admissao: "",
        matricula: 0,
        email: "",
        telefone: "",
        id_biometrico: "",
        tipo_escala: "8h",
      })

      // Resetar o estado do biométrico
      setBiometricStatus("idle")
      setCurrentStep(1)
    } catch (error) {
      console.error("[ADD_FUNCIONARIO] Erro ao salvar funcionário:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o funcionário. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteFuncionario = async () => {
    if (!funcionarioToDelete) return

    try {
      const success = await funcionarioAPI.delete(funcionarioToDelete)

      if (success) {
        // Remover o funcionário da lista local
        setFuncionarios((prevFuncionarios) => prevFuncionarios.filter((f) => f.id !== funcionarioToDelete))

        toast({
          title: "Sucesso",
          description: "Funcionário removido com sucesso",
        })
      }

      setIsDeleteDialogOpen(false)
      setFuncionarioToDelete(null)
    } catch (error) {
      console.error(`Erro ao deletar funcionário ${funcionarioToDelete}:`, error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o funcionário. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      })
    }
  }

  const recarregarFuncionarios = async () => {
    if (!unidade) return

    setIsLoading(true)
    try {
      const funcionariosData = await funcionarioAPI.getByUnidade(unidade.id)
      setFuncionarios(funcionariosData)

      toast({
        title: "Sucesso",
        description: "Lista de funcionários atualizada",
      })
    } catch (error) {
      console.error("Erro ao recarregar funcionários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível recarregar os funcionários. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricRegistration = async () => {
    if (!currentFuncionario.nome || !currentFuncionario.cpf) {
      toast({
        title: "Erro",
        description: "Nome e CPF são necessários para o registro biométrico",
        variant: "destructive",
      })
      return
    }

    setBiometricStatus("loading")

    try {
      // Prepare the request payload com a estrutura correta
      const payload = {
        userName: currentFuncionario.nome,
        cpf: currentFuncionario.cpf,
        cargo: currentFuncionario.cargo,
        matricula: currentFuncionario.matricula?.toString() || "",
        data_admissao: currentFuncionario.data_admissao,
        unidade_id: currentFuncionario.unidade_id,
        tipo_escala: currentFuncionario.tipo_escala || "8h",
        telefone: currentFuncionario.telefone || "",
        email: currentFuncionario.email || "",
      }

      console.log("[BIOMETRIC] Payload enviado para o servidor biométrico:", JSON.stringify(payload, null, 2))

      // Exibir toast informando sobre o processo de cadastro biométrico
      toast({
        title: "Cadastro biométrico iniciado",
        description: "Um programa local será aberto. O processo pode levar até 1 minuto para concluir.",
        duration: 10000, // Toast fica visível por 10 segundos
      })

      try {
        // Sem AbortController com timeout, pois sabemos que pode demorar até 1 minuto
        const response = await fetch("https://127.0.0.1:5000/register", {
          // Viadooo
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          agent: new https.Agent({
            rejectUnauthorized: false, // Ignora erros de certificado SSL
          }),
        });

        const data = await response.json();
        console.log("[BIOMETRIC] Resposta completa do servidor biométrico:", JSON.stringify(data, null, 2));

        if (data.user && data.user.id_biometrico) {
          // Mapear os campos da resposta para o estado do funcionário
          const updatedFuncionario = {
            ...currentFuncionario,
            id_biometrico: data.user.id_biometrico,
            nome: data.user.nome || currentFuncionario.nome,
            cpf: data.user.cpf || currentFuncionario.cpf,
            cargo: data.user.cargo || currentFuncionario.cargo,
            matricula: data.user.matricula || currentFuncionario.matricula,
            telefone: data.user.telefone || currentFuncionario.telefone,
            email: data.user.email || currentFuncionario.email,
            tipo_escala: data.user.tipo_escala || currentFuncionario.tipo_escala,
          };

          console.log("[BIOMETRIC] Funcionário atualizado após resposta:", JSON.stringify(updatedFuncionario, null, 2));
          setCurrentFuncionario(updatedFuncionario);

          setBiometricStatus("success");

          toast({
            title: "Sucesso",
            description: "Biometria registrada com sucesso",
          });
        } else {
          throw new Error(data.message || "Falha ao registrar biometria");
        }
      } catch (fetchError) {
        console.error("[BIOMETRIC] Erro na comunicação com o servidor biométrico:", fetchError)

        // Se estamos em ambiente de desenvolvimento, simular uma resposta bem-sucedida
        if (process.env.NODE_ENV === "development") {
          console.log("[BIOMETRIC] Ambiente de desenvolvimento, usando modo de simulação")

          // Gerar ID biométrico fictício para testes
          const mockBiometricId = `MOCK_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

          toast({
            title: "Modo de simulação",
            description: "Simulando resposta do servidor biométrico para fins de teste.",
            variant: "warning",
          })

          // Atualizar o funcionário com o ID simulado
          const updatedFuncionario = {
            ...currentFuncionario,
            id_biometrico: mockBiometricId,
          }

          console.log("[BIOMETRIC] Funcionário simulado:", JSON.stringify(updatedFuncionario, null, 2))
          setCurrentFuncionario(updatedFuncionario)

          setBiometricStatus("success")
        } else {
          throw fetchError
        }
      }
    } catch (error) {
      console.error("[BIOMETRIC] Erro ao registrar biometria:", error)
      setBiometricStatus("error")

      toast({
        title: "Erro",
        description: `Não foi possível registrar a biometria: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const nextStep = () => {
    // Validação para o primeiro passo
    if (currentStep === 1) {
      if (!currentFuncionario.nome || !currentFuncionario.cpf) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome e CPF são obrigatórios para continuar",
          variant: "destructive",
        })
        return
      }
    }

    // Validação para o segundo passo
    if (currentStep === 2) {
      if (!currentFuncionario.cargo) {
        toast({
          title: "Campo obrigatório",
          description: "Cargo é obrigatório para continuar",
          variant: "destructive",
        })
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    // Primeiro filtra por texto de busca
    const matchesSearch =
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (funcionario.matricula && funcionario.matricula.toString().includes(searchTerm))

    // Depois filtra por tipo de escala
    const matchesTab = activeTab === "all" || funcionario.tipo_escala === activeTab
    return matchesSearch && matchesTab
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!unidade) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Unidade não encontrada</h1>
        <p>A unidade que você está procurando não existe ou foi removida.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-600">Funcionários</h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={recarregarFuncionarios}
            className="flex items-center gap-1 text-xs sm:text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-cw"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
            Atualizar
          </Button>
          <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Total: {funcionarios.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="border-b mb-6">
          <div className="flex flex-wrap md:flex-nowrap overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab("8h")}
              className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "8h" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              8h
            </button>
            <button
              onClick={() => setActiveTab("12h")}
              className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "12h" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              12h
            </button>
            <button
              onClick={() => setActiveTab("24h")}
              className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "24h" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              24h
            </button>
            <button
              onClick={() => setActiveTab("12x36")}
              className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "12x36" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              12x36
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">


          {user?.specificApplications?.some(app =>
            app.name === "Biométrico Saúde" && app.type !== "Coordenador"
          ) && (
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Funcionário
              </Button>
            )}

          <div className="relative w-full sm:w-auto">
            <Input
              placeholder="Buscar funcionário..."
              className="pl-10 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {filteredFuncionarios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum funcionário encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">Matrícula</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Admissão</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                  {user?.specificApplications?.some(app =>
                    app.name === "Biométrico Saúde" && app.type !== "Coordenador"
                  ) && (
                      <TableHead className="text-right">Ações</TableHead>
                    )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell className="font-medium">{funcionario.nome}</TableCell>
                    <TableCell className="hidden sm:table-cell">{funcionario.matricula || "-"}</TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(funcionario.data_admissao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{funcionario.email || "-"}</TableCell>
                    <TableCell className="hidden lg:table-cell">{funcionario.telefone || "-"}</TableCell>
                    <TableCell className="text-right">

                      {user?.specificApplications?.some(app =>
                        app.name === "Biométrico Saúde" && app.type !== "Coordenador"
                      ) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(funcionario)}
                              className="h-8 w-8 p-0 mr-1"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteDialog(funcionario.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </>
                        )}

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Diálogo para adicionar/editar funcionário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              {isEditMode ? "Editar Funcionário" : "Novo Funcionário"}
            </DialogTitle>
            <DialogDescription>
              {currentStep === 1 && "Preencha as informações básicas do funcionário"}
              {currentStep === 2 && "Informe os dados profissionais"}
              {currentStep === 3 && "Adicione informações de contato"}
              {currentStep === 4 && "Cadastre a biometria do funcionário (opcional)"}
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center ${step <= currentStep ? "text-blue-600" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step < currentStep
                      ? "bg-blue-600 text-white"
                      : step === currentStep
                        ? "border-2 border-blue-600 text-blue-600"
                        : "border-2 border-gray-300 text-gray-400"
                      }`}
                  >
                    {step < currentStep ? <Check className="h-4 w-4" /> : step}
                  </div>
                  <span className="text-xs hidden sm:block">
                    {step === 1 && "Básico"}
                    {step === 2 && "Profissional"}
                    {step === 3 && "Contato"}
                    {step === 4 && "Biometria"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full">
                <div
                  className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Passo 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="nome" className="sm:text-right flex items-center gap-1">
                  Nome <span className="text-red-500">*</span>
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="nome"
                    value={currentFuncionario.nome}
                    onChange={(e) => setCurrentFuncionario({ ...currentFuncionario, nome: e.target.value })}
                    className="pl-10 sm:col-span-3"
                    placeholder="Nome completo"
                    required
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="cpf" className="sm:text-right flex items-center gap-1">
                  CPF <span className="text-red-500">*</span>
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="cpf"
                    value={currentFuncionario.cpf}
                    onChange={(e) => setCurrentFuncionario({ ...currentFuncionario, cpf: e.target.value })}
                    className="pl-10 sm:col-span-3"
                    placeholder="000.000.000-00"
                    required
                  />
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="matricula" className="sm:text-right flex items-center gap-1">
                  Matrícula
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="matricula"
                    type="number"
                    value={currentFuncionario.matricula || ""}
                    onChange={(e) =>
                      setCurrentFuncionario({ ...currentFuncionario, matricula: Number.parseInt(e.target.value) || 0 })
                    }
                    className="pl-10 sm:col-span-3"
                    placeholder="Número de matrícula"
                  />
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {/* Passo 2: Informações Profissionais */}
          {currentStep === 2 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="cargo" className="sm:text-right flex items-center gap-1">
                  Cargo <span className="text-red-500">*</span>
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="cargo"
                    value={currentFuncionario.cargo}
                    onChange={(e) => setCurrentFuncionario({ ...currentFuncionario, cargo: e.target.value })}
                    className="pl-10 sm:col-span-3"
                    placeholder="Cargo do funcionário"
                    required
                  />
                  <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="data_admissao" className="sm:text-right flex items-center gap-1">
                  Data de Admissão
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="data_admissao"
                    type="date"
                    value={currentFuncionario.data_admissao ? currentFuncionario.data_admissao.split("T")[0] : ""}
                    onChange={(e) => setCurrentFuncionario({ ...currentFuncionario, data_admissao: e.target.value })}
                    className="pl-10 sm:col-span-3"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="tipo_escala" className="sm:text-right flex items-center gap-1">
                  Tipo de escala
                </Label>
                <div className="sm:col-span-3 relative">
                  <Select
                    value={currentFuncionario.tipo_escala || "8h"}
                    onValueChange={(value) => setCurrentFuncionario({ ...currentFuncionario, tipo_escala: value })}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Selecione o tipo de escala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8h">8h</SelectItem>
                      <SelectItem value="12h">12h</SelectItem>
                      <SelectItem value="16h">16h</SelectItem>
                      <SelectItem value="24h">24h</SelectItem>
                      <SelectItem value="12x36">12x36</SelectItem>
                      <SelectItem value="24x72">24x72</SelectItem>
                      <SelectItem value="32h">32h</SelectItem>
                      <SelectItem value="20h">20h</SelectItem>
                    </SelectContent>
                  </Select>
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 z-10" />
                </div>
              </div>
            </div>
          )}

          {/* Passo 3: Informações de Contato */}
          {currentStep === 3 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="email" className="sm:text-right flex items-center gap-1">
                  Email
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="email"
                    type="email"
                    value={currentFuncionario.email || ""}
                    onChange={(e) => setCurrentFuncionario({ ...currentFuncionario, email: e.target.value })}
                    className="pl-10 sm:col-span-3"
                    placeholder="email@exemplo.com"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="telefone" className="sm:text-right flex items-center gap-1">
                  Telefone
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="telefone"
                    value={currentFuncionario.telefone || ""}
                    onChange={(e) => setCurrentFuncionario({ ...currentFuncionario, telefone: e.target.value })}
                    className="pl-10 sm:col-span-3"
                    placeholder="(00) 00000-0000"
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 mt-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    Importante: Certifique-se de preencher corretamente o email e telefone antes de prosseguir para o
                    cadastro biométrico.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Passo 4: Biometria */}
          {currentStep === 4 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="id_biometrico" className="sm:text-right flex items-center gap-1">
                  Digital Biométrica
                </Label>
                <div className="sm:col-span-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <Fingerprint
                          className={`h-16 w-16 ${biometricStatus === "success"
                            ? "text-green-500"
                            : biometricStatus === "error"
                              ? "text-red-500"
                              : "text-blue-500"
                            }`}
                        />
                        {biometricStatus === "loading" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                          </div>
                        )}
                        {biometricStatus === "idle" && !currentFuncionario.id_biometrico && (
                          <p className="text-sm text-gray-600 text-center">
                            Clique no botão abaixo para iniciar o cadastro da digital biométrica
                          </p>
                        )}

                        {biometricStatus === "loading" && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700 text-center">
                              Um programa local foi iniciado para capturar a digital. Este processo pode levar até 1
                              minuto.
                              <br />
                              Por favor, siga as instruções no programa que foi aberto.
                            </p>
                          </div>
                        )}

                        {biometricStatus === "success" && (
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <Check className="h-5 w-5" />
                            <span>Biometria cadastrada com sucesso</span>
                          </div>
                        )}

                        {biometricStatus === "error" && (
                          <div className="flex items-center gap-2 text-red-600 font-medium">
                            <AlertCircle className="h-5 w-5" />
                            <span>Erro ao cadastrar biometria</span>
                          </div>
                        )}

                        {currentFuncionario.id_biometrico && biometricStatus !== "loading" && (
                          <p className="text-xs text-gray-500 mt-1">
                            ID Biométrico: {currentFuncionario.id_biometrico}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleBiometricRegistration}
                    disabled={biometricStatus === "loading"}
                    className={`w-full flex items-center justify-center gap-2 ${biometricStatus === "success"
                      ? "bg-green-500 hover:bg-green-600"
                      : biometricStatus === "error"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    {biometricStatus === "loading" ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Processando...</span>
                      </>
                    ) : biometricStatus === "success" ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Cadastro Realizado</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-4 w-4" />
                        <span>Cadastrar Digital</span>
                      </>
                    )}
                  </Button>

                  <div className="mt-4 bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      O cadastro biométrico é opcional. Você pode finalizar o cadastro do funcionário mesmo sem
                      registrar a biometria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Voltar
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
            )}

            {currentStep < 4 ? (
              <Button onClick={nextStep} className="bg-blue-500 hover:bg-blue-600 text-white">
                Próximo
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (!isEditMode) {
                    setIsDialogOpen(false);
                  } else {
                    handleAddFuncionario();
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Atualizando..." : "Adicionando..."}
                  </>
                ) : isEditMode ? (
                  "Atualizar"
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir funcionário */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir funcionário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFuncionario} className="bg-red-500 hover:bg-red-600 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

