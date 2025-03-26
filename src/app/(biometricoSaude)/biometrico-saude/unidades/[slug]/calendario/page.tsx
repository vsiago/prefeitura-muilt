"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CalendarIcon } from "lucide-react"
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

export default function CalendarioPage() {
  const params = useParams()
  const slug = params.slug as string
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dataAtual, setDataAtual] = useState(new Date())
  const [registrosPonto, setRegistrosPonto] = useState<RegistroPonto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFuncionario, setSelectedFuncionario] = useState<string>("")
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

  useEffect(() => {
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
          const dataAtualFormatada = new Date()
          const mes = String(dataAtualFormatada.getMonth() + 1).padStart(2, "0") // +1 porque getMonth retorna 0-11
          const ano = String(dataAtualFormatada.getFullYear())
          const unidade_id = unidadeData.id // Usar o ID da unidade obtido dinamicamente

          // Buscar registros de ponto do mês atual para a unidade específica
          try {
            const response = await fetch(
              `https://biometrico.itaguai.rj.gov.br/reg/pontos-unidade?mes=${mes}&ano=${ano}&unidade_id=${unidade_id}`,
            )

            if (!response.ok) {
              throw new Error(`Erro ao buscar registros: ${response.status}`)
            }

            const registrosData = await response.json()
            console.log("Dados recebidos do endpoint:", registrosData)

            // Mapear os registros para o formato esperado pelo componente
            const registrosMapeados = registrosData.map((registro) => ({
              id: `${registro.funcionario_matricula}`,
              funcionario_id: `${registro.funcionario_matricula}`,
              funcionario_nome: registro.funcionario_nome,
              funcionario_matricula: registro.funcionario_matricula,
              unidade_id: unidade_id, // Usar o ID dinâmico da unidade
              unidade_nome: registro.unidade_nome || unidadeData.nome,
              data: registro.data || dataAtual.toISOString().split("T")[0],
              hora_entrada: registro.hora_entrada,
              hora_saida: registro.hora_saida,
              status:
                registro.hora_entrada && registro.hora_saida
                  ? "Presente"
                  : registro.hora_entrada
                    ? "Entrada registrada"
                    : "Ausente",
            }))

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

    fetchData()
  }, [slug, toast])

  const handleBiometricPonto = async () => {
    setBiometricStatus("processing")
    setBiometricMessage("")

    try {
      // Configurar timeout para a requisição
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

      try {
        const response = await fetch("https://27fc-45-169-84-2.ngrok-free.app/register_ponto", {
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
                data: dataAtual.toISOString().split("T")[0],
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
              data: dataAtual.toISOString().split("T")[0],
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
        data: dataAtual.toISOString().split("T")[0],
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

  const filteredRegistros = registrosPonto.filter((registro) =>
    registro.funcionario_nome?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendário de Ponto</h1>
        <div className="text-sm text-gray-500">{unidade.nome}</div>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">{formatarData(dataAtual)}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(dataAtual)
                  newDate.setDate(newDate.getDate() - 1)
                  setDataAtual(newDate)
                }}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(dataAtual)
                  newDate.setDate(newDate.getDate() + 1)
                  setDataAtual(newDate)
                }}
              >
                Próximo
              </Button>
            </div>
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
                  <span className="text-sm">Atrasado</span>
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

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
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
                        <TableCell>{registro.hora_entrada || "--"}</TableCell>
                        <TableCell>{registro.hora_saida || "--"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                registro.hora_entrada && registro.hora_saida
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
                className={`mb-4 p-3 rounded-md text-center ${
                  biometricStatus === "success"
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
                className={`flex items-center gap-2 ${
                  biometricStatus === "processing" ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
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
    </div>
  )
}

