"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Ferias {
  id: number
  funcionario: string
  cargo: string
  dataInicio: Date
  dataFim: Date
  status: "Aprovado" | "Pendente" | "Negado"
}

export default function Ferias() {
  const [ferias, setFerias] = useState<Ferias[]>([
    {
      id: 1,
      funcionario: "Ana Silva",
      cargo: "Enfermeira",
      dataInicio: new Date(2024, 11, 15),
      dataFim: new Date(2025, 0, 15),
      status: "Aprovado",
    },
    {
      id: 2,
      funcionario: "Carlos Oliveira",
      cargo: "Médico",
      dataInicio: new Date(2024, 10, 1),
      dataFim: new Date(2024, 10, 30),
      status: "Pendente",
    },
    {
      id: 3,
      funcionario: "Mariana Costa",
      cargo: "Recepcionista",
      dataInicio: new Date(2025, 1, 10),
      dataFim: new Date(2025, 2, 10),
      status: "Negado",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined)
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined)
  const [funcionario, setFuncionario] = useState("")
  const [cargo, setCargo] = useState("")

  const handleAddFerias = () => {
    if (!funcionario || !cargo || !dataInicio || !dataFim) {
      return
    }

    const newId = ferias.length > 0 ? Math.max(...ferias.map((f) => f.id)) + 1 : 1

    setFerias([
      ...ferias,
      {
        id: newId,
        funcionario,
        cargo,
        dataInicio,
        dataFim,
        status: "Pendente",
      },
    ])

    setIsDialogOpen(false)
    setFuncionario("")
    setCargo("")
    setDataInicio(undefined)
    setDataFim(undefined)
  }

  return (
    <div className="container mx-auto py-6 p-8 mt-2">
      <h2 className="text-2xl font-bold text-slate-600 mb-6">Solicitações de Férias</h2>
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            Nova Solicitação
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ferias.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.funcionario}</TableCell>
                  <TableCell>{item.cargo}</TableCell>
                  <TableCell>{format(item.dataInicio, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{format(item.dataFim, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        item.status === "Aprovado"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Pendente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800",
                      )}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Nova Solicitação de Férias</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funcionario" className="text-right">
                Funcionário
              </Label>
              <Input
                id="funcionario"
                value={funcionario}
                onChange={(e) => setFuncionario(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cargo" className="text-right">
                Cargo
              </Label>
              <Input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataInicio" className="text-right">
                Data Início
              </Label>
              <div className="col-span-3">
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio ? format(dataInicio, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDataInicio(new Date(e.target.value))
                    } else {
                      setDataInicio(undefined)
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataFim" className="text-right">
                Data Fim
              </Label>
              <div className="col-span-3">
                <Input
                  id="dataFim"
                  type="date"
                  value={dataFim ? format(dataFim, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDataFim(new Date(e.target.value))
                    } else {
                      setDataFim(undefined)
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFerias} className="bg-blue-500 hover:bg-blue-600 text-white">
              Solicitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

