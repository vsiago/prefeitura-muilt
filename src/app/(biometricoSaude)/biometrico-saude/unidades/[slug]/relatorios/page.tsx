"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FileText, Download, Calendar, Users, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { unidadeAPI, type Unidade } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RelatoriosPage() {
  const params = useParams()
  const slug = params.slug as string
  const [unidade, setUnidade] = useState<Unidade | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Buscar unidade pelo slug
        const unidadeData = await unidadeAPI.getBySlug(slug)
        if (unidadeData) {
          setUnidade(unidadeData)
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

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Gerando relatório",
      description: `O relatório de ${reportType} está sendo gerado.`,
    })

    // Simulação de geração de relatório
    setTimeout(() => {
      toast({
        title: "Relatório gerado",
        description: `O relatório de ${reportType} foi gerado com sucesso.`,
      })
    }, 2000)
  }

  const months = [
    { value: "0", label: "Janeiro" },
    { value: "1", label: "Fevereiro" },
    { value: "2", label: "Março" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Maio" },
    { value: "5", label: "Junho" },
    { value: "6", label: "Julho" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Setembro" },
    { value: "9", label: "Outubro" },
    { value: "10", label: "Novembro" },
    { value: "11", label: "Dezembro" },
  ]

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i
    return { value: year.toString(), label: year.toString() }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-600">Relatórios</h1>
        <div className="text-sm text-gray-500">{unidade.nome}</div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Relatório de Presença</CardTitle>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Relatório detalhado de presença dos funcionários por período.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Período:</span>
                <span>
                  {months.find((m) => m.value === selectedMonth)?.label} / {selectedYear}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formato:</span>
                <span>PDF, Excel</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => handleGenerateReport("presença")}>
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Relatório de Funcionários</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Lista completa de funcionários com detalhes e status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unidade:</span>
                <span>{unidade.nome}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formato:</span>
                <span>PDF, Excel</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => handleGenerateReport("funcionários")}>
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Relatório de Horas Extras</CardTitle>
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Detalhamento de horas extras trabalhadas por funcionário.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Período:</span>
                <span>
                  {months.find((m) => m.value === selectedMonth)?.label} / {selectedYear}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formato:</span>
                <span>PDF, Excel</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => handleGenerateReport("horas extras")}>
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Relatório de Férias</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Programação de férias dos funcionários.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Período:</span>
                <span>Anual - {selectedYear}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formato:</span>
                <span>PDF, Excel</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => handleGenerateReport("férias")}>
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Relatório de Faltas</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Registro de faltas e justificativas dos funcionários.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Período:</span>
                <span>
                  {months.find((m) => m.value === selectedMonth)?.label} / {selectedYear}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formato:</span>
                <span>PDF, Excel</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => handleGenerateReport("faltas")}>
              <Download className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Relatório Personalizado</CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Crie relatórios personalizados com os dados que você precisa.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Opções:</span>
                <span>Múltiplas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Filtros:</span>
                <span>Personalizáveis</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formato:</span>
                <span>PDF, Excel, CSV</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2" onClick={() => handleGenerateReport("personalizado")}>
              <FileText className="h-4 w-4" />
              Criar Relatório
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

