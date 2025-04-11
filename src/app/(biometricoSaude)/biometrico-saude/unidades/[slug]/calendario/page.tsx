"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CalendarIcon, Download, FileDown } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  unidadeAPI,
  funcionarioAPI,
  registroPontoAPI,
  type Unidade,
  type Funcionario,
  type RegistroPonto,
} from "@/lib/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, AlertTriangle, Fingerprint } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { generateAttendanceReport } from "@/lib/generate-pdf"

export default function CalendarioPage() {
  const params = useParams()
  const slug = params.slug as string
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [registrosPonto, setRegistrosPonto] = useState<RegistroPonto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFuncionario, setSelectedFuncionario] = useState<string>("")
  const [selectedFuncionarioData, setSelectedFuncionarioData] = useState<Funcionario | null>(null)
  const [novoRegistro, setNovoRegistro] = useState<Omit<RegistroPonto, "id">>({
    funcionario_id: "",
    unidade_id: "",
    data: new Date().toISOString().split("T")[0],
    hora_entrada: "08:00",
    hora_saida: "17:00",
  })

  const { toast } = useToast()

  const [biometricStatus, setBiometricStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [biometricMessage, setBiometricMessage] = useState<string>("")
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [reportMonth, setReportMonth] = useState(currentDate.getMonth() + 1)
  const [reportYear, setReportYear] = useState(currentDate.getFullYear())
  const [reportFuncionario, setReportFuncionario] = useState<string>("")

  const [dayDetailsOpen, setDayDetailsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [slug, currentDate])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Buscar unidade pelo slug
      const unidadeData = await unidadeAPI.getBySlug(slug)
      if (unidadeData) {
        setUnidade(unidadeData)

        // Buscar funcionários da unidade
        const funcionariosData = await funcionarioAPI.getByUnidade(unidadeData.id)
        setFuncionarios(funcionariosData)

        // Formatar a data para o endpoint
        const mes = String(currentDate.getMonth() + 1).padStart(2, "0") // +1 porque getMonth retorna 0-11
        const ano = String(currentDate.getFullYear())
        const unidade_id = unidadeData.id // Usar o ID da unidade obtido dinamicamente

        // Buscar registros de ponto do mês atual para a unidade específica
        try {
          // Primeiro, precisamos buscar todos os funcionários da unidade
          const funcionariosData = await funcionarioAPI.getByUnidade(unidadeData.id)
          setFuncionarios(funcionariosData)

          console.log("Funcionarios da unidadeeeee: funcionariosData")

          // Array para armazenar todos os registros de ponto
          let todosRegistros = []

          // Para cada funcionário, buscar seus registros de ponto
          for (const funcionario of funcionariosData) {
            try {
              const funcionario_id = funcionario.id
              const response = await fetch(
                `https://biometrico.itaguai.rj.gov.br/reg/levantamento-horas?funcionario_id=${funcionario_id}&ano=${ano}&mes=${mes}`,
              )


              if (response.ok) {
                const registrosFuncionario = await response.json()
                todosRegistros = [...todosRegistros, ...registrosFuncionario.registros]
              }
            } catch (err) {
              console.error(`Erro ao buscar registros para o funcionário ${funcionario.nome}:`, err)
            }
          }

          console.log("Dados recebidos do endpoint:", todosRegistros)

          // Mapear os registros para o formato esperado pelo componente
          const registrosMapeados = todosRegistros.map((registro) => {
            // Extrair a data da data_hora
            const dataCompleta = registro.data_hora ? new Date(registro.data_hora) : new Date()
            const dataFormatada = format(dataCompleta, "yyyy-MM-dd")

            // Determinar o status com base na presença de hora_entrada e hora_saida
            const status =
              registro.hora_entrada && registro.hora_saida
                ? "Presente"
                : registro.hora_entrada
                  ? "Entrada registrada"
                  : "Ausente"

            return {
              id: `${registro.id || registro.matricula || Date.now()}`,
              funcionario_id: `${registro.funcionario_id || ""}`,
              funcionario_nome: registro.nome,
              funcionario_matricula: registro.matricula,
              unidade_id: unidade_id,
              unidade_nome: unidadeData.nome,
              data: dataFormatada,
              hora_entrada: registro.hora_entrada || null,
              hora_saida: registro.hora_saida || null,
              hora_saida_ajustada: registro.hora_saida_ajustada || null,
              horas_normais: registro.horas_normais || null,
              hora_extra: registro.hora_extra || null,
              hora_desconto: registro.hora_desconto || null,
              total_trabalhado: registro.total_trabalhado || null,
              total_trabalhado_mes: registro.total_trabalhado_mes ? registro.total_trabalhado_mes.hours : null,
              tipo_escala: registro.tipo_escala || null,
              cargo: registro.cargo || null,
              cpf: registro.cpf || null,
              telefone: registro.telefone || null,
              data_admissao: registro.data_admissao || null,
              id_biometrico: registro.id_biometrico || null,
              status: status,
            }
          })

          console.log("Registros mapeados:", registrosMapeados)
          setRegistrosPonto(registrosMapeados)
        } catch (error) {
          console.error("Erro ao buscar registros de ponto:", error)
          toast({
            title: "Erro",
            description: "Não foi possível carregar os registros de ponto",
            variant: "destructive",
          })
          setRegistrosPonto([])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricPonto = async () => {
    setBiometricStatus("processing")
    setBiometricMessage("")

    try {
      // Configurar timeout para a requisição
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

      try {
        const response = await fetch("https://127.0.0.1:5000/register_ponto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Enviar um objeto vazio, pois o servidor identifica pelo dedo
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const data = await response.json()
        console.log("Resposta do servidor biométrico:", data)

        if (data.message.includes("não identificado")) {
          setBiometricStatus("error")
          setBiometricMessage("Usuário não identificado. Tente novamente.")
          return
        }

        if (data.message.includes("já bateu seu ponto")) {
          setBiometricStatus("error")
          setBiometricMessage(data.message)
          return
        }

        // Registro bem-sucedido
        setBiometricStatus("success")
        setBiometricMessage(`Ponto registrado para ${data.message.split(":")[1]?.trim() || "funcionário"}`)

        // Atualizar a tabela de registros
        if (data.registro_ponto) {
          // Verificar se é entrada ou saída
          const isEntrada = data.registro_ponto.hora_entrada !== null
          const isSaida = data.registro_ponto.hora_saida !== null

          // Encontrar o funcionário pelo id_biometrico ou pelo nome
          const funcionarioIndex = registrosPonto.findIndex(
            (r) =>
              (r.id_biometrico && r.id_biometrico === data.registro_ponto.id_biometrico) ||
              (r.funcionario_nome && data.message.includes(r.funcionario_nome)),
          )

          if (funcionarioIndex >= 0) {
            // Atualizar registro existente
            const updatedRegistros = [...registrosPonto]

            if (isEntrada) {
              updatedRegistros[funcionarioIndex].hora_entrada = data.registro_ponto.hora_entrada
            }

            if (isSaida) {
              updatedRegistros[funcionarioIndex].hora_saida = data.registro_ponto.hora_saida
            }

            // Atualizar status
            updatedRegistros[funcionarioIndex].status =
              updatedRegistros[funcionarioIndex].hora_entrada && updatedRegistros[funcionarioIndex].hora_saida
                ? "Presente"
                : updatedRegistros[funcionarioIndex].hora_entrada
                  ? "Entrada registrada"
                  : "Ausente"

            setRegistrosPonto(updatedRegistros)
          } else {
            // Buscar informações do funcionário pelo id_biometrico
            // Aqui você pode fazer uma chamada à API para obter os detalhes do funcionário
            // Por enquanto, vamos apenas adicionar um novo registro com as informações disponíveis
            const funcionarioNome = data.message.split(":")[1]?.trim() || "Funcionário"

            // Verificar se já existe um funcionário com o mesmo nome
            const existingFuncionarioIndex = registrosPonto.findIndex((r) => r.funcionario_nome === funcionarioNome)

            if (existingFuncionarioIndex >= 0) {
              // Atualizar o registro existente em vez de criar um novo
              const updatedRegistros = [...registrosPonto]

              if (isEntrada) {
                updatedRegistros[existingFuncionarioIndex].hora_entrada = data.registro_ponto.hora_entrada
              }

              if (isSaida) {
                updatedRegistros[existingFuncionarioIndex].hora_saida = data.registro_ponto.hora_saida
              }

              // Atualizar status
              updatedRegistros[existingFuncionarioIndex].status =
                updatedRegistros[existingFuncionarioIndex].hora_entrada &&
                  updatedRegistros[existingFuncionarioIndex].hora_saida
                  ? "Presente"
                  : updatedRegistros[existingFuncionarioIndex].hora_entrada
                    ? "Entrada registrada"
                    : "Ausente"

              updatedRegistros[existingFuncionarioIndex].id_biometrico = data.registro_ponto.id_biometrico

              setRegistrosPonto(updatedRegistros)
            } else {
              // Criar um novo registro apenas se realmente não existir
              const novoRegistro = {
                id: `temp-${Date.now()}`,
                funcionario_id: data.registro_ponto.id_biometrico,
                funcionario_nome: funcionarioNome,
                unidade_id: unidade?.id || "",
                unidade_nome: unidade?.nome || "",
                data: currentDate.toISOString().split("T")[0],
                hora_entrada: data.registro_ponto.hora_entrada,
                hora_saida: data.registro_ponto.hora_saida,
                id_biometrico: data.registro_ponto.id_biometrico,
                status: "Presente",
              }

              setRegistrosPonto([...registrosPonto, novoRegistro])
            }
          }
        }

        // Resetar o status após 3 segundos
        setTimeout(() => {
          setBiometricStatus("idle")
          setBiometricMessage("")
        }, 3000)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.error("Erro na comunicação com o servidor biométrico:", fetchError)

        // Verificar se é um erro de timeout
        if (fetchError.name === "AbortError") {
          setBiometricStatus("error")
          setBiometricMessage("Tempo limite excedido. Verifique se o leitor está conectado.")
        } else {
          setBiometricStatus("error")
          setBiometricMessage("Erro de comunicação com o servidor biométrico.")
        }

        // Modo de simulação para desenvolvimento
        if (process.env.NODE_ENV === "development") {
          console.log("Usando modo de simulação para desenvolvimento")

          // Simular um registro aleatório (entrada ou saída)
          const isEntrada = Math.random() > 0.5
          const mockRegistro = {
            data_hora: new Date().toISOString(),
            hora_entrada: isEntrada
              ? new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
              : null,
            hora_saida: !isEntrada
              ? new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
              : null,
            id_biometrico: `MOCK_${Date.now()}`,
          }

          setBiometricStatus("success")
          setBiometricMessage(`Simulação: Ponto de ${isEntrada ? "entrada" : "saída"} registrado`)

          // Verificar se já existe um usuário simulado
          const existingSimIndex = registrosPonto.findIndex((r) => r.funcionario_nome === "Usuário Simulado")

          if (existingSimIndex >= 0) {
            // Atualizar o registro existente
            const updatedRegistros = [...registrosPonto]

            if (isEntrada) {
              updatedRegistros[existingSimIndex].hora_entrada = mockRegistro.hora_entrada
            }

            if (!isEntrada) {
              updatedRegistros[existingSimIndex].hora_saida = mockRegistro.hora_saida
            }

            // Atualizar status
            updatedRegistros[existingSimIndex].status =
              updatedRegistros[existingSimIndex].hora_entrada && updatedRegistros[existingSimIndex].hora_saida
                ? "Presente"
                : updatedRegistros[existingSimIndex].hora_entrada
                  ? "Entrada registrada"
                  : "Ausente"

            setRegistrosPonto(updatedRegistros)
          } else {
            // Criar um novo registro apenas se não existir
            const novoRegistro = {
              id: `sim-${Date.now()}`,
              funcionario_id: mockRegistro.id_biometrico,
              funcionario_nome: "Usuário Simulado",
              unidade_id: unidade?.id || "",
              unidade_nome: unidade?.nome || "",
              data: currentDate.toISOString().split("T")[0],
              hora_entrada: mockRegistro.hora_entrada,
              hora_saida: mockRegistro.hora_saida,
              id_biometrico: mockRegistro.id_biometrico,
              status: "Presente",
            }

            setRegistrosPonto((prev) => [...prev, novoRegistro])
          }
        }
      }
    } catch (error) {
      console.error("Erro ao registrar ponto biométrico:", error)
      setBiometricStatus("error")
      setBiometricMessage("Ocorreu um erro ao processar a solicitação.")
    }
  }

  const handleRegistrarPonto = async () => {
    if (!selectedFuncionario) {
      toast({
        title: "Erro",
        description: "Selecione um funcionário",
        variant: "destructive",
      })
      return
    }

    try {
      const registro = {
        ...novoRegistro,
        funcionario_id: selectedFuncionario,
        unidade_id: unidade?.id || "",
        data: currentDate.toISOString().split("T")[0],
      }

      const registroCriado = await registroPontoAPI.create(registro)

      if (registroCriado) {
        // Adicionar o nome do funcionário ao registro
        const funcionario = funcionarios.find((f) => f.id === selectedFuncionario)
        const novoRegistroCompleto = {
          ...registroCriado,
          funcionario_nome: funcionario?.nome,
          status: "Presente" as const,
        }

        // Atualizar a lista de registros
        setRegistrosPonto((registros) => {
          // Remover registro existente do mesmo funcionário, se houver
          const registrosFiltrados = registros.filter((r) => r.funcionario_id !== selectedFuncionario)
          return [...registrosFiltrados, novoRegistroCompleto]
        })

        setIsDialogOpen(false)
        setSelectedFuncionario("")
        setNovoRegistro({
          funcionario_id: "",
          unidade_id: "",
          data: new Date().toISOString().split("T")[0],
          hora_entrada: "08:00",
          hora_saida: "17:00",
        })

        toast({
          title: "Sucesso",
          description: "Ponto registrado com sucesso",
        })

        // Mostrar feedback visual também no sistema biométrico
        setBiometricStatus("success")
        setBiometricMessage(`Ponto registrado manualmente para ${funcionario?.nome || "funcionário"}`)

        // Resetar o status após 3 segundos
        setTimeout(() => {
          setBiometricStatus("idle")
          setBiometricMessage("")
        }, 3000)
      }
    } catch (error) {
      console.error("Erro ao registrar ponto:", error)
      toast({
        title: "Erro",
        description: "Não foi possível registrar o ponto",
        variant: "destructive",
      })
    }
  }

  // Atualizar a função handleGenerateReport para usar o novo endpoint

  const handleGenerateReport = async () => {
    if (!reportFuncionario) {
      toast({
        title: "Erro",
        description: "Selecione um funcionário para gerar o relatório",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Usar o novo endpoint para obter os dados do relatório
      const response = await fetch(
        `https://biometrico.itaguai.rj.gov.br/relat/relatoriosempdf?funcionario_id=${reportFuncionario}&mes=${reportMonth}&ano=${reportYear}`,
      )

      if (!response.ok) {
        throw new Error(`Erro ao buscar relatório: ${response.status}`)
      }

      const reportData = await response.json()

      // Log the raw API response
      console.log("RAW API RESPONSE:", reportData)

      // Ensure hora_desconto is included in each registro
      if (reportData.registros && Array.isArray(reportData.registros)) {
        reportData.registros.forEach((registro) => {
          // Log each registro to see what properties it has
          console.log(`REGISTRO BEFORE PROCESSING: ${registro.data}`, registro)

          // If hora_desconto is missing but exists in the API response, make sure it's included
          if (registro.hora_desconto === undefined && registro.data) {
            // Try to find the corresponding registro in the registrosPonto array
            const matchingRegistro = registrosPonto.find((r) => {
              // Convert dates to comparable format
              const registroDate = r.data ? new Date(r.data.split("T")[0]) : null
              const currentDate = registro.data ? new Date(registro.data.split("T")[0]) : null
              return (
                registroDate &&
                currentDate &&
                registroDate.getDate() === currentDate.getDate() &&
                registroDate.getMonth() === currentDate.getMonth() &&
                registroDate.getFullYear() === currentDate.getFullYear() &&
                r.funcionario_id === reportFuncionario
              )
            })

            if (matchingRegistro && matchingRegistro.hora_desconto) {
              console.log(
                `Adding hora_desconto from registrosPonto for ${registro.data}:`,
                matchingRegistro.hora_desconto,
              )
              registro.hora_desconto = matchingRegistro.hora_desconto
            }
          }

          // Log the registro after processing
          console.log(`REGISTRO AFTER PROCESSING: ${registro.data}`, registro)
        })
      }

      // Gerar o PDF com os novos dados
      const pdfDataUrl = generateAttendanceReport(reportData)

      // Criar um link para download
      const link = document.createElement("a")
      link.href = pdfDataUrl
      link.download = `relatorio_ponto_${reportData.funcionario.nome.replace(/\s+/g, "_")}_${reportMonth}_${reportYear}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsReportDialogOpen(false)

      toast({
        title: "Sucesso",
        description: "Relatório gerado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRegistros = registrosPonto.filter((registro) =>
    registro.funcionario_nome?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Funções para navegação do calendário
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // Obter dias do mês atual
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obter o primeiro dia da semana (0 = domingo, 1 = segunda, etc.)
  const startDay = getDay(monthStart)

  // Criar array com dias vazios para preencher o início do calendário
  const daysBeforeMonth = Array(startDay).fill(null)

  // Formatar o mês e ano atual
  const formattedMonth = format(currentDate, "MMMM yyyy", { locale: ptBR })

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-600">Calendário de Ponto</h1>
        <div className="text-sm text-gray-500">{unidade.nome}</div>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl font-bold capitalize">{formattedMonth}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  Próximo
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsReportDialogOpen(true)}
            >
              <FileDown className="h-4 w-4 text-slate-600" />
              <p className="text-slate-600">Gerar Relatório</p>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Presente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Entrada registrada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Ausente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm">Folga</span>
                </div>
              </div>
              <div className="relative">
                <Input
                  placeholder="Buscar funcionário..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Calendário mensal */}
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div
                    key={day}
                    className="text-center font-medium text-sm py-2 rounded"
                    style={{ backgroundColor: "#0266AF", color: "white" }}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysBeforeMonth.map((_, index) => (
                  <div key={`empty-${index}`} className="h-32 bg-gray-50 rounded"></div>
                ))}
                {monthDays.map((day) => {
                  // Encontrar registros para este dia
                  const dayRegistros = registrosPonto.filter(
                    (r) => r.data && r.data.split("T")[0] === format(day, "yyyy-MM-dd"),
                  )

                  // Determinar a cor de fundo com base nos registros
                  let bgColor = "bg-white"
                  if (isToday(day)) {
                    bgColor = "bg-blue-50"
                  }

                  // Contar funcionários presentes (com entrada e saída)
                  const presentCount = dayRegistros.filter((r) => r.hora_entrada && r.hora_saida).length

                  return (
                    <div
                      key={day.toString()}
                      className={`h-32 ${bgColor} border rounded p-1 overflow-hidden hover:shadow-sm transition-shadow cursor-pointer`}
                      onClick={() => {
                        setSelectedDay(day)
                        setDayDetailsOpen(true)
                        setCurrentPage(1) // Reset para a primeira página ao abrir
                      }}
                    >
                      <div className={`text-right text-sm mb-1 ${isToday(day) ? "font-bold text-blue-600" : ""}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1 overflow-y-auto h-[calc(100%-20px)] text-xs">
                        {dayRegistros.length > 0 ? (
                          <>
                            {/* Contagem de presentes */}
                            <div className="mb-1 text-[10px] text-gray-500 flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                              <span>{presentCount} presentes</span>
                            </div>

                            <div className="grid gap-1">
                              {dayRegistros.map((registro, idx) => {
                                const isPresent = registro.hora_entrada && registro.hora_saida
                                return (
                                  <div
                                    key={`${registro.funcionario_id}-${idx}`}
                                    className={`p-1 rounded flex items-center gap-1 ${isPresent ? "bg-green-50" : ""}`}
                                    title={`${registro.funcionario_nome}: ${registro.hora_entrada || "--"} - ${registro.hora_saida || "--"}`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full flex-shrink-0 ${isPresent
                                        ? "bg-green-500"
                                        : registro.hora_entrada
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                        }`}
                                    ></div>
                                    <span className={`truncate ${isPresent ? "font-medium" : ""}`}>
                                      {registro.funcionario_nome}
                                    </span>
                                    <span className="ml-auto text-[10px] text-gray-500">
                                      {registro.hora_entrada && `${registro.hora_entrada.substring(0, 5)}`}
                                      {registro.hora_entrada && registro.hora_saida && " - "}
                                      {registro.hora_saida && `${registro.hora_saida.substring(0, 5)}`}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-400 italic">Sem registros</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lista de funcionários e registros */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Nenhum funcionário encontrado para a unidade {unidade?.nome}.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistros.map((registro, index) => (
                      <TableRow
                        key={
                          registro.funcionario_matricula
                            ? `${registro.funcionario_matricula}-${index}`
                            : `registro-${index}`
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                              <Image
                                src="/avatar-placeholder.jpg"
                                alt={registro.funcionario_nome || "Funcionário"}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{registro.funcionario_nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-blue-600">
                            {registro.funcionario_matricula ? `#${registro.funcionario_matricula}` : "--"}
                          </span>
                        </TableCell>
                        <TableCell>{registro.cargo || "--"}</TableCell>
                        <TableCell>{registro.hora_entrada || "--"}</TableCell>
                        <TableCell>{registro.hora_saida || "--"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              Normal: {registro.total_trabalhado?.substring(0, 5) || "--"}
                            </span>
                            {registro.hora_extra && (
                              <span className="text-xs text-green-600">
                                Extra: {registro.hora_extra.substring(0, 5)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${registro.hora_entrada && registro.hora_saida
                                ? "bg-green-500"
                                : registro.hora_entrada
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                                }`}
                            ></div>
                            <span>
                              {registro.hora_entrada && registro.hora_saida
                                ? "Presente"
                                : registro.hora_entrada
                                  ? "Entrada registrada"
                                  : "Ausente"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Ponto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative mb-6">
              <CalendarIcon className="h-16 w-16 text-blue-500" />
              {biometricStatus === "processing" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
              {biometricStatus === "success" && (
                <div className="absolute -right-2 -bottom-2 bg-green-500 text-white rounded-full p-1">
                  <Check className="h-6 w-6" />
                </div>
              )}
              {biometricStatus === "error" && (
                <div className="absolute -right-2 -bottom-2 bg-red-500 text-white rounded-full p-1">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-medium mb-2">Sistema de Ponto Biométrico</h3>

            {biometricMessage && (
              <div
                className={`mb-4 p-3 rounded-md text-center ${biometricStatus === "success"
                  ? "bg-green-100 text-green-800"
                  : biometricStatus === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                  }`}
              >
                {biometricMessage}
              </div>
            )}

            <p className="text-gray-500 mb-6 text-center max-w-md">
              {biometricStatus === "idle"
                ? "Utilize o leitor biométrico para registrar a entrada ou saída."
                : biometricStatus === "processing"
                  ? "Processando leitura biométrica..."
                  : biometricStatus === "success"
                    ? "Ponto registrado com sucesso!"
                    : "Ocorreu um erro na leitura biométrica. Tente novamente."}
            </p>

            <div className="flex gap-4">
              <Button
                className={`flex items-center gap-2 ${biometricStatus === "processing" ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                onClick={handleBiometricPonto}
                disabled={biometricStatus === "processing"}
              >
                <Fingerprint className="h-5 w-5" />
                {biometricStatus === "processing" ? "Processando..." : "Registrar Ponto Biométrico"}
              </Button>

              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                Registrar Ponto Manual
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para registrar ponto manualmente */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Registrar Ponto Manual</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funcionario" className="text-right">
                Funcionário
              </Label>
              <div className="col-span-3">
                <Select value={selectedFuncionario} onValueChange={setSelectedFuncionario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hora_entrada" className="text-right">
                Hora de Entrada
              </Label>
              <Input
                id="hora_entrada"
                type="time"
                value={novoRegistro.hora_entrada}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, hora_entrada: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hora_saida" className="text-right">
                Hora de Saída
              </Label>
              <Input
                id="hora_saida"
                type="time"
                value={novoRegistro.hora_saida || ""}
                onChange={(e) => setNovoRegistro({ ...novoRegistro, hora_saida: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegistrarPonto} className="bg-blue-500 hover:bg-blue-600 text-white">
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para gerar relatório */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Gerar Relatório de Ponto</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-funcionario" className="text-right">
                Funcionário
              </Label>
              <div className="col-span-3">
                <Select value={reportFuncionario} onValueChange={setReportFuncionario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((funcionario) => (
                      <SelectItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-month" className="text-right">
                Mês
              </Label>
              <div className="col-span-3">
                <Select
                  value={reportMonth.toString()}
                  onValueChange={(value) => setReportMonth(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-year" className="text-right">
                Ano
              </Label>
              <div className="col-span-3">
                <Select value={reportYear.toString()} onValueChange={(value) => setReportYear(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleGenerateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de detalhes do dia */}
      <Dialog open={dayDetailsOpen} onOpenChange={setDayDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              {selectedDay &&
                `Registros de ${format(selectedDay, "dd/MM/yyyy")} - ${format(selectedDay, "EEEE", { locale: ptBR })}`}
            </DialogTitle>
          </DialogHeader>

          {selectedDay && (
            <>
              <div className="py-4">
                {(() => {
                  const dayRegistros = registrosPonto.filter(
                    (r) => r.data && r.data.split("T")[0] === format(selectedDay, "yyyy-MM-dd"),
                  )

                  // Calcular paginação
                  const totalPages = Math.ceil(dayRegistros.length / itemsPerPage)
                  const startIndex = (currentPage - 1) * itemsPerPage
                  const paginatedRegistros = dayRegistros.slice(startIndex, startIndex + itemsPerPage)

                  return dayRegistros.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Funcionário</TableHead>
                              <TableHead>Matrícula</TableHead>
                              <TableHead>Entrada</TableHead>
                              <TableHead>Saída</TableHead>
                              <TableHead>Horas Trabalhadas</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedRegistros.map((registro, idx) => (
                              <TableRow key={`modal-${registro.funcionario_id}-${idx}`}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                      <Image
                                        src="/avatar-placeholder.jpg"
                                        alt={registro.funcionario_nome || "Funcionário"}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <span className="font-medium">{registro.funcionario_nome}</span>
                                      {registro.cargo && <div className="text-xs text-gray-500">{registro.cargo}</div>}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium text-blue-600">
                                    {registro.funcionario_matricula ? `#${registro.funcionario_matricula}` : "--"}
                                  </span>
                                </TableCell>
                                <TableCell>{registro.hora_entrada || "--"}</TableCell>
                                <TableCell>{registro.hora_saida || "--"}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span>{registro.total_trabalhado?.substring(0, 5) || "--"}</span>
                                    {registro.hora_extra && (
                                      <span className="text-xs text-green-600">
                                        Extra: {registro.hora_extra.substring(0, 5)}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${registro.hora_entrada && registro.hora_saida
                                        ? "bg-green-500"
                                        : registro.hora_entrada
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                        }`}
                                    ></div>
                                    <span>
                                      {registro.hora_entrada && registro.hora_saida
                                        ? "Presente"
                                        : registro.hora_entrada
                                          ? "Entrada registrada"
                                          : "Ausente"}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Paginação */}
                      {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500">
                            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, dayRegistros.length)} de{" "}
                            {dayRegistros.length} registros
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              Anterior
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                            >
                              Próximo
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Resumo do dia */}
                      <div className="mt-6 bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Resumo do dia</h4>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <p className="text-sm text-gray-500">Total de funcionários</p>
                            <p className="text-lg font-medium">{dayRegistros.length}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Presentes</p>
                            <p className="text-lg font-medium text-green-600">
                              {dayRegistros.filter((r) => r.hora_entrada && r.hora_saida).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Entrada registrada</p>
                            <p className="text-lg font-medium text-yellow-600">
                              {dayRegistros.filter((r) => r.hora_entrada && !r.hora_saida).length}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ausentes</p>
                            <p className="text-lg font-medium text-red-600">
                              {dayRegistros.filter((r) => !r.hora_entrada).length}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lista de funcionários presentes */}
                      {dayRegistros.filter((r) => r.hora_entrada && r.hora_saida).length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            Funcionários Presentes ({dayRegistros.filter((r) => r.hora_entrada && r.hora_saida).length})
                          </h4>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                            {dayRegistros
                              .filter((r) => r.hora_entrada && r.hora_saida)
                              .map((registro, idx) => (
                                <div
                                  key={`present-${registro.funcionario_id}-${idx}`}
                                  className="flex items-center gap-2 bg-green-50 p-2 rounded-md"
                                >
                                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <Image
                                      src="/avatar-placeholder.jpg"
                                      alt={registro.funcionario_nome || "Funcionário"}
                                      width={24}
                                      height={24}
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="font-medium text-sm truncate">{registro.funcionario_nome}</p>
                                    <p className="text-xs text-gray-500">
                                      {registro.hora_entrada && registro.hora_entrada.substring(0, 5)} -{" "}
                                      {registro.hora_saida && registro.hora_saida.substring(0, 5)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium mb-2">Nenhum registro para este dia</p>
                      <p className="text-sm">Não há registros de ponto para o dia selecionado.</p>
                    </div>
                  )
                })()}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDayDetailsOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

