"use client"

import { useSelector, useDispatch } from "react-redux"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { RootState } from "@/redux/store"
import { deleteCadastre, setCurrentCadastre } from "@/redux/slices/cadastresSlice"
import type { Cadastre } from "@/redux/slices/cadastresSlice"
import { useCadastres } from "@/hooks/useCadastres"
import { useEffect } from "react"

interface CadastreListProps {
  onEdit: (cadastre: Cadastre) => void
}

export function CadastreList({ onEdit }: CadastreListProps) {
  const { cadastres } = useCadastres();

  useEffect(() => {
    setTimeout(() => {
      console.log("🚀 CadastreList. Estado atual:", cadastres);
    }, 1000);
  }, [cadastres]);

  const dispatch = useDispatch()

  const handleEdit = (cadastre: Cadastre) => {
    dispatch(setCurrentCadastre(cadastre))
    onEdit(cadastre)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      dispatch(deleteCadastre(id))
    }
  }


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Inscrição Nº</TableHead>
          <TableHead>Proprietário</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Situação</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cadastres.map((cadastre) => (
          <TableRow key={cadastre.id}>
            <TableCell>{cadastre.inscricao}</TableCell>
            <TableCell>{cadastre.proprietario}</TableCell>
            <TableCell>{cadastre.endereco}</TableCell>
            <TableCell>{cadastre.situacao}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(cadastre)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cadastre.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

