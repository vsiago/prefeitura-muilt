"use client"

import { useState } from "react"
import ImageUploader from "./ImageUploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const BASE_URL = "https://biometrico.itaguai.rj.gov.br"

interface ModalCadastroUnidadeProps {
  controlaModal: () => void
  onUnidadeCadastrada?: () => void
  unidadeParaEditar?: {
    id: string
    nome: string
    localizacao: string
    foto?: string
  }
}

export default function ModalCadastroUnidade({
  controlaModal,
  onUnidadeCadastrada,
  unidadeParaEditar,
}: ModalCadastroUnidadeProps) {
  const [nomeUnidade, setNomeUnidade] = useState(unidadeParaEditar?.nome || "")
  const [enderecoUnidade, setEnderecoUnidade] = useState(unidadeParaEditar?.localizacao || "")
  const [foto, setFoto] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const handleImageUpload = (file: File) => {
    console.log("Imagem selecionada:", file)
    setFoto(file)
  }

  const cadastrarUnidade = async () => {
    if (!nomeUnidade || !enderecoUnidade) {
      toast({
        title: "Erro",
        description: "Preencha o nome e o endereço da unidade!",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Criar um FormData para enviar os dados com a foto
    const formData = new FormData()
    formData.append("nome", nomeUnidade)
    formData.append("localizacao", enderecoUnidade)

    if (foto) {
      formData.append("foto", foto)
    }

    try {
      const url = unidadeParaEditar ? `${BASE_URL}/unid/unidade/${unidadeParaEditar.id}` : `${BASE_URL}/unid/unidade`

      const method = unidadeParaEditar ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`)
      }

      const resultado = await response.json()
      console.log("Unidade cadastrada com sucesso:", resultado)

      toast({
        title: "Sucesso",
        description: unidadeParaEditar ? "Unidade atualizada com sucesso!" : "Unidade cadastrada com sucesso!",
      })

      if (onUnidadeCadastrada) {
        onUnidadeCadastrada()
      }

      controlaModal() // Fecha o modal após o cadastro
    } catch (error) {
      console.error("Erro ao cadastrar unidade:", error)
      toast({
        title: "Erro",
        description: "Erro ao cadastrar unidade. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg relative max-w-md w-full p-6">
        <div className="flex flex-row items-center justify-between relative">
          <h2 className="text-xl font-semibold">{unidadeParaEditar ? "Editar unidade" : "Cadastro nova unidade"}</h2>
          <button
            onClick={controlaModal}
            className="h-8 w-8 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-sm font-semibold">X</span>
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <ImageUploader onImageUpload={handleImageUpload} initialImage={unidadeParaEditar?.foto} />

          <div className="w-full mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da unidade</label>
              <Input
                type="text"
                value={nomeUnidade}
                onChange={(e) => setNomeUnidade(e.target.value)}
                placeholder="Digite nome da unidade"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço da unidade</label>
              <Input
                type="text"
                value={enderecoUnidade}
                onChange={(e) => setEnderecoUnidade(e.target.value)}
                placeholder="Digite endereço da unidade"
                className="w-full"
              />
            </div>
          </div>

          <Button onClick={cadastrarUnidade} disabled={isLoading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processando...
              </span>
            ) : unidadeParaEditar ? (
              "Atualizar unidade"
            ) : (
              "Adicionar unidade"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

