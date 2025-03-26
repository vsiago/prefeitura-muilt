"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2, Search, UserPlus } from "lucide-react"

interface Usuario {
  id: number
  nome: string
  email: string
  matricula: string
  cargo: string
  unidade: string
  perfil: "Administrador" | "Coordenador" | "Funcionário"
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      matricula: "12345",
      cargo: "Médico",
      unidade: "Hospital São Francisco Xavier",
      perfil: "Administrador",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      matricula: "23456",
      cargo: "Enfermeira",
      unidade: "Hospital São Francisco Xavier",
      perfil: "Coordenador",
    },
    {
      id: 3,
      nome: "Pedro Santos",
      email: "pedro.santos@email.com",
      matricula: "34567",
      cargo: "Técnico de Enfermagem",
      unidade: "Hospital São Francisco Xavier",
      perfil: "Funcionário",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({
    id: 0,
    nome: "",
    email: "",
    matricula: "",
    cargo: "",
    unidade: "",
    perfil: "Funcionário",
  })

  const { toast } = useToast()

  const handleOpenDialog = (usuario?: Usuario) => {
    if (usuario) {
      setCurrentUsuario(usuario)
      setIsEditMode(true)
    } else {
      setCurrentUsuario({
        id: 0,
        nome: "",
        email: "",
        matricula: "",
        cargo: "",
        unidade: "",
        perfil: "Funcionário",
      })
      setIsEditMode(false)
    }
    setIsDialogOpen(true)
  }

  const handleSaveUsuario = () => {
    if (
      !currentUsuario.nome ||
      !currentUsuario.email ||
      !currentUsuario.matricula ||
      !currentUsuario.cargo ||
      !currentUsuario.unidade
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    if (isEditMode) {
      setUsuarios(usuarios.map((u) => (u.id === currentUsuario.id ? currentUsuario : u)))
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      })
    } else {
      const newId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1
      setUsuarios([...usuarios, { ...currentUsuario, id: newId }])
      toast({
        title: "Sucesso",
        description: "Usuário adicionado com sucesso",
      })
    }

    setIsDialogOpen(false)
  }

  const handleDeleteUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id))
    toast({
      title: "Sucesso",
      description: "Usuário removido com sucesso",
    })
  }

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.matricula.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Input
                placeholder="Buscar usuário..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button onClick={() => handleOpenDialog()} className="bg-blue-500 hover:bg-blue-600 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.matricula}</TableCell>
                  <TableCell>{usuario.cargo}</TableCell>
                  <TableCell>{usuario.unidade}</TableCell>
                  <TableCell>{usuario.perfil}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(usuario)}
                      className="h-8 w-8 p-0 mr-2"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUsuario(usuario.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">{isEditMode ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={currentUsuario.nome}
                onChange={(e) => setCurrentUsuario({ ...currentUsuario, nome: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentUsuario.email}
                onChange={(e) => setCurrentUsuario({ ...currentUsuario, email: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="matricula" className="text-right">
                Matrícula
              </Label>
              <Input
                id="matricula"
                value={currentUsuario.matricula}
                onChange={(e) => setCurrentUsuario({ ...currentUsuario, matricula: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cargo" className="text-right">
                Cargo
              </Label>
              <Input
                id="cargo"
                value={currentUsuario.cargo}
                onChange={(e) => setCurrentUsuario({ ...currentUsuario, cargo: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unidade" className="text-right">
                Unidade
              </Label>
              <Input
                id="unidade"
                value={currentUsuario.unidade}
                onChange={(e) => setCurrentUsuario({ ...currentUsuario, unidade: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="perfil" className="text-right">
                Perfil
              </Label>
              <Select
                value={currentUsuario.perfil}
                onValueChange={(value: "Administrador" | "Coordenador" | "Funcionário") =>
                  setCurrentUsuario({ ...currentUsuario, perfil: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Coordenador">Coordenador</SelectItem>
                  <SelectItem value="Funcionário">Funcionário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUsuario} className="bg-blue-500 hover:bg-blue-600 text-white">
              {isEditMode ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

