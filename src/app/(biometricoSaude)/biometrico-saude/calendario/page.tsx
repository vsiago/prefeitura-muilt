"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"

interface Funcionario {
  id: number
  nome: string
  cargo: string
  foto: string
  admissao: string
  referencia: string
}

interface RegistroPonto {
  data: string
  tipo: string
  entrada: string
  saida: string
  justificativa: string
}

export default function Calendario() {
  const [funcionarioEncontrado, setFuncionarioEncontrado] = useState<Funcionario | null>(null)
  const [registros, setRegistros] = useState<RegistroPonto[]>([])
  const [matricula, setMatricula] = useState("")

  const buscarFuncionario = () => {
    if (matricula.trim() === "") return

    // Simulando busca de funcionário
    const funcionario: Funcionario = {
      id: 1,
      nome: "Ronny Silva",
      cargo: "Neurologista",
      foto: "/avatar-placeholder.jpg",
      admissao: "05/10/2024",
      referencia: "01/12/2024 ATÉ 31/12/2024",
    }

    setFuncionarioEncontrado(funcionario)

    // Simulando registros de ponto
    const registrosSimulados: RegistroPonto[] = [
      { data: "Dom 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Seg 01/12/2024", tipo: "Folga", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Terça 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Qua 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Qui 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Sex 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Sáb 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Dom 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Seg 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Ter 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Qua 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Qui 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
      { data: "Sex 01/12/2024", tipo: "NORMAL", entrada: "8:01", saida: "17:01", justificativa: "--" },
    ]

    setRegistros(registrosSimulados)
  }

  return (
    <div className="container mx-auto py-6">
      {!funcionarioEncontrado ? (
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <Image src="/search-employee.png" alt="Buscar funcionário" width={300} height={200} className="mb-6" />
            <h3 className="text-2xl font-medium text-gray-600 mb-6">Encontrar um Funcionário</h3>

            <div className="flex w-full max-w-md">
              <Input
                placeholder="Digite a matrícula do funcionário"
                className="rounded-r-none bg-gray-100"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
              <Button onClick={buscarFuncionario} className="bg-gray-200 hover:bg-gray-300 rounded-l-none">
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-start gap-6 mb-8 p-4 bg-blue-50 rounded-lg">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={funcionarioEncontrado.foto || "/placeholder.svg"}
                  alt={funcionarioEncontrado.nome}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="text-sm text-blue-600 font-medium">FUNCIONÁRIO</div>
              <h2 className="text-2xl font-bold text-gray-800">{funcionarioEncontrado.nome}</h2>
              <div className="text-gray-500">{funcionarioEncontrado.cargo}</div>
            </div>

            <div className="ml-12">
              <div className="text-sm text-blue-600 font-medium">ADMISSÃO</div>
              <div className="text-gray-700">{funcionarioEncontrado.admissao}</div>
            </div>

            <div className="ml-12">
              <div className="text-sm text-blue-600 font-medium">REFERÊNCIA</div>
              <div className="text-gray-700">{funcionarioEncontrado.referencia}</div>
            </div>
          </div>

          <div className="bg-blue-700 text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-4">
              <Image src="/logo-itaguai.png" alt="Prefeitura de Itaguaí" width={80} height={40} className="invert" />
              <div>
                <div className="text-sm">Unidade de saúde</div>
                <div className="font-medium">Vila Margarida</div>
              </div>
            </div>
            <div className="text-center text-xl font-bold mt-2">CALENDÁRIO DE PONTO</div>
            <div className="text-sm mt-2">R. Alzira Santiago, 410-460 - Vila Margarida, Itaguaí - RJ, 23821-030</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border p-2 text-left">DATA</th>
                  <th className="border p-2 text-left">TIPO</th>
                  <th className="border p-2 text-left">ENTRADA</th>
                  <th className="border p-2 text-left">SAÍDA</th>
                  <th className="border p-2 text-left">JUSTIFICATIVA</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="border p-2">{registro.data}</td>
                    <td className="border p-2">{registro.tipo}</td>
                    <td className="border p-2">{registro.entrada}</td>
                    <td className="border p-2">{registro.saida}</td>
                    <td className="border p-2">{registro.justificativa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                setFuncionarioEncontrado(null)
                setRegistros([])
                setMatricula("")
              }}
              variant="outline"
              className="mr-2"
            >
              Voltar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Registrar ponto</Button>
          </div>
        </div>
      )}
    </div>
  )
}

