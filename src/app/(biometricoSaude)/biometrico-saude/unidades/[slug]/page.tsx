"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { unidadeAPI, funcionarioAPI, type Unidade, type Funcionario } from "@/lib/api"
import { Users, Calendar, FileText, Clock, Building, MapPin } from "lucide-react"
import { useAuth } from "../../../../../hooks/useAuth"
import HeaderHomeApplicationSaude from "../../../../../components/Layout/HeaderApplicationSaude"

export default function UnidadePage() {
  const params = useParams()
  const slug = params.slug as string
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFuncionarios: 0,
    presencaHoje: 0,
    feriasAgendadas: 0,
    horasExtras: 0,
  })

  const router = useRouter();
  const { user } = useAuth();

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Buscar unidade pelo slug
        const unidadeData = await unidadeAPI.getBySlug(slug)
        if (unidadeData) {
          setUnidade(unidadeData)

          try {
            // Buscar funcionários da unidade em um bloco try/catch separado
            const funcionariosData = await funcionarioAPI.getByUnidade(unidadeData.id)
            setFuncionarios(funcionariosData)

            // Calcular estatísticas
            setStats({
              totalFuncionarios: funcionariosData.length,
              presencaHoje: Math.floor(funcionariosData.length * 0.85), // Simulação: 85% de presença
              feriasAgendadas: Math.floor(funcionariosData.length * 0.1), // Simulação: 10% em férias
              horasExtras: Math.floor(Math.random() * 100), // Simulação: horas extras aleatórias
            })
          } catch (funcionariosError) {
            console.error("Erro ao carregar funcionários:", funcionariosError)
            // Definir estatísticas padrão em caso de erro
            setStats({
              totalFuncionarios: 0,
              presencaHoje: 0,
              feriasAgendadas: 0,
              horasExtras: 0,
            })
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados da unidade:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug])

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
    <>
      <div className="space-y-6 p-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-48 relative">
            <Image src={unidade.foto || "/hospital-placeholder.jpg"} alt={unidade.nome} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold">{unidade.nome}</h1>
                <p className="text-white/80">{unidade.localizacao}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-600">Visão Geral</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFuncionarios}</div>
              <p className="text-xs text-muted-foreground">Ativos na unidade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presença Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.presencaHoje}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.presencaHoje / stats.totalFuncionarios) * 100)}% de presença
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Férias Agendadas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.feriasAgendadas}</div>
              <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Extras</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.horasExtras}h</div>
              <p className="text-xs text-muted-foreground">Acumuladas este mês</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações da Unidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                    <p className="font-medium">{unidade.nome}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                    <p>{unidade.localizacao}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coordenador</h3>
                    <p>
                      {funcionarios.find((f) => f.cargo?.toLowerCase().includes("coordenador"))?.nome || "Não definido"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Horário de Funcionamento</h3>
                    <p>Segunda a Sexta: 08:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {funcionarios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Funcionários Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funcionarios.slice(0, 5).map((funcionario) => (
                  <div key={funcionario.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{funcionario.nome.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{funcionario.nome}</p>
                        <p className="text-sm text-gray-500">{funcionario.cargo}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {funcionario.data_admissao
                        ? new Date(funcionario.data_admissao).toLocaleDateString("pt-BR")
                        : "Data não informada"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

