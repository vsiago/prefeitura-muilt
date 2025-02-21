"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Info,
  MapPin,
  FileText,
  Save,
  ArrowLeft,
  ArrowRight,
  MapPinIcon as MapPin2,
  Layers,
  Mountain,
  ArrowUpDown,
  Building,
  Ruler,
  Building2,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import type { RootState } from "./store/store"
import { updateCurrentCadastre, addCadastre, editCadastre } from "./store/cadastreSlice"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogTitle } from "@radix-ui/react-dialog"

interface Cadastre {
  id?: string
  inscricao?: string
  lancamento?: string
  revisao?: string
  lote?: number
  quadra?: number
  loteamento?: string
  distrito?: string
  endereco?: string
  cep?: string
  proprietario?: string
  cpf?: string
  telefone?: string
  logradouro?: string[]
  situacao?: string
  caracteristicasSolo?: string
  topografia?: string
  nivelamento?: string
  quantidadePavimentos?: number
  areaTerreno?: number
  testada?: number
  areaEdificada?: number
  tipo?: string[]
  uso?: string[]
  tipoConstrucao?: string[]
  esquadrias?: string[]
  piso?: string[]
  forro?: string[]
  cobertura?: string[]
  acabamentoInterno?: string[]
  acabamentoExterno?: string[]
}

export function CadastreModal({ isOpen, onClose, isEditing, resetCurrentCadastre }: {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  resetCurrentCadastre: () => void
}) {

  const dispatch = useDispatch()
  const cadastres = useSelector((state: RootState) => state?.bic?.cadastres ?? []);

  useEffect(() => {
    console.log("Cadastres: " + cadastres)
  }, [cadastres])

  // Garante que pegamos pelo menos um item da lista
  const currentCadastre = cadastres.length > 0 ? cadastres[0] : { inscricao: "", lancamento: "" };

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
    }
  }, [isOpen])

  const steps = [
    { name: "Informações Básicas", icon: Info },
    { name: "Endereço e Contato", icon: MapPin },
    { name: "Informações sobre o logradouro", icon: FileText },
    { name: "Informações sobre o terreno", icon: MapPin2 },
    { name: "Metragens", icon: Ruler },
    { name: "Informações sobre a construção", icon: Building2 },
  ]




  // Evita erro caso currentCadastre seja null
  if (!currentCadastre) {
    return <p>Nenhum cadastro encontrado.</p>
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(updateCurrentCadastre({ [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean, field: string, item: string) => {
    const currentItems = (currentCadastre[field as keyof Cadastre] as string[]) || []
    const updatedItems = checked ? [...currentItems, item] : currentItems.filter((i) => i !== item)
    dispatch(updateCurrentCadastre({ [field]: updatedItems }))
  }

  const handleRadioChange = (name: string, value: string) => {
    dispatch(updateCurrentCadastre({ [name]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    dispatch(updateCurrentCadastre({ quantidadePavimentos: value[0] }))
  }

  const handleSave = () => {
    if (isEditing) {
      dispatch(editCadastre(currentCadastre as Cadastre))
    } else {
      dispatch(addCadastre({ ...currentCadastre, id: uuidv4() } as Cadastre))
    }
    dispatch(updateCurrentCadastre({})) // Clear the current cadastre
    resetCurrentCadastre() // Reset the current cadastre in the parent component
    setCurrentStep(0) // Reset to the first tab
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTitle>Informações do Cadastro</DialogTitle>
      <DialogContent className="flex flex-col max-h-[90vh] max-w-3xl ">
        <div className="flex-grow overflow-y-auto">
          <Card className="border-sky-100 shadow-md ">
            <CardHeader className="border-b border-sky-50 bg-sky-50">
              <CardTitle className="text-2xl font-bold text-sky-900">
                {isEditing ? "Editar Cadastro" : "Nova Inscrição de Propriedade Imobiliária"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 w-full">
              <Tabs value={steps[currentStep].name} className=" ">
                <div className="relative border-b overflow-auto">
                  <TabsList className="inline-flex h-10 items-center justify-start rounded-none bg-transparent p-0 min-w-full">
                    {steps.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <TabsTrigger
                          key={index}
                          value={step.name}
                          disabled={index !== currentStep}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-3 py-1.5 text-sm font-medium ring-offset-white transition-all hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:border-sky-600 data-[state=active]:text-sky-600"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{step.name}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>

                {steps.map((step, index) => (
                  <TabsContent key={index} value={step.name} className="space-y-4">
                    {index === 0 && (
                      <>
                        <div className="flex items-center space-x-2 text-sky-700">
                          <Info className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Informações Básicas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="inscricao">Inscrição Nº</Label>
                            <Input
                              id="inscricao"
                              name="inscricao"
                              value={currentCadastre.inscricao || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lancamento">Lançamento novo em</Label>
                            <Input
                              id="lancamento"
                              name="lancamento"
                              type="date"
                              value={currentCadastre.lancamento || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="revisao">Revisão em</Label>
                            <Input
                              id="revisao"
                              name="revisao"
                              type="date"
                              value={currentCadastre.revisao || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lote">Lote</Label>
                            <Input
                              id="lote"
                              name="lote"
                              type="number"
                              value={currentCadastre.lote || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quadra">Quadra</Label>
                            <Input
                              id="quadra"
                              name="quadra"
                              type="number"
                              value={currentCadastre.quadra || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="loteamento">Loteamento</Label>
                            <Input
                              id="loteamento"
                              name="loteamento"
                              value={currentCadastre.loteamento || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="distrito">Distrito</Label>
                            <Input
                              id="distrito"
                              name="distrito"
                              value={currentCadastre.distrito || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {index === 1 && (
                      <>
                        <div className="flex items-center space-x-2 text-sky-700">
                          <MapPin className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Endereço e Contato</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input
                              id="endereco"
                              name="endereco"
                              value={currentCadastre.endereco || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cep">CEP</Label>
                            <Input id="cep" name="cep" value={currentCadastre.cep || ""} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="proprietario">Proprietário (Compromissário)</Label>
                            <Input
                              id="proprietario"
                              name="proprietario"
                              value={currentCadastre.proprietario || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input id="cpf" name="cpf" value={currentCadastre.cpf || ""} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                              id="telefone"
                              name="telefone"
                              type="tel"
                              value={currentCadastre.telefone || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {index === 2 && (
                      <>
                        <div className="flex items-center space-x-2 text-sky-700">
                          <FileText className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Informações sobre o logradouro</h3>
                        </div>
                        <div className="space-y-4">
                          {[
                            "Pavimentação",
                            "Iluminação Pública",
                            "Rede de Esgoto",
                            "Rede de Água",
                            "Coleta de Lixo",
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                id={`item-${index}`}
                                checked={currentCadastre.logradouro?.includes(item) || false}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange(checked as boolean, "logradouro", item)
                                }
                              />
                              <Label htmlFor={`item-${index}`}>{item}</Label>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {index === 3 && (
                      <>
                        <div className="flex items-center space-x-2 text-sky-700">
                          <MapPin2 className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Informações sobre o terreno</h3>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin2 className="h-5 w-5 text-sky-700" />
                              <Label>Situação</Label>
                            </div>
                            <RadioGroup
                              onValueChange={(value) => handleRadioChange("situacao", value)}
                              value={currentCadastre.situacao}
                            >
                              {[
                                "Encravado",
                                "Vila",
                                "Meio de Quadra",
                                "Esquina",
                                "Com Três Frentes",
                                "Toda a Quadra",
                              ].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <RadioGroupItem value={item} id={`situacao-${item}`} />
                                  <Label htmlFor={`situacao-${item}`}>{item}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Layers className="h-5 w-5 text-sky-700" />
                              <Label>Características do Solo</Label>
                            </div>
                            <RadioGroup
                              onValueChange={(value) => handleRadioChange("caracteristicasSolo", value)}
                              value={currentCadastre.caracteristicasSolo}
                            >
                              {["Alagadiço", "Arenoso", "Rochoso", "Normal"].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <RadioGroupItem value={item} id={`solo-${item}`} />
                                  <Label htmlFor={`solo-${item}`}>{item}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Mountain className="h-5 w-5 text-sky-700" />
                              <Label>Topografia</Label>
                            </div>
                            <RadioGroup
                              onValueChange={(value) => handleRadioChange("topografia", value)}
                              value={currentCadastre.topografia}
                            >
                              {["Aclive", "Declive", "Encosta", "Horizontal"].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <RadioGroupItem value={item} id={`topografia-${item}`} />
                                  <Label htmlFor={`topografia-${item}`}>{item}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <ArrowUpDown className="h-5 w-5 text-sky-700" />
                              <Label>Nivelamento</Label>
                            </div>
                            <RadioGroup
                              onValueChange={(value) => handleRadioChange("nivelamento", value)}
                              value={currentCadastre.nivelamento}
                            >
                              {["Abaixo do Nível", "Ao Nível", "Acima do Nível"].map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <RadioGroupItem value={item} id={`nivelamento-${item}`} />
                                  <Label htmlFor={`nivelamento-${item}`}>{item}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building className="h-5 w-5 text-sky-700" />
                              <Label>Quantidade de Pavimentos</Label>
                            </div>
                            <Slider
                              min={1}
                              max={10}
                              step={1}
                              value={[currentCadastre.quantidadePavimentos || 1]}
                              onValueChange={handleSliderChange}
                            />
                            <div className="text-center">{currentCadastre.quantidadePavimentos || 1}</div>
                          </div>
                        </div>
                      </>
                    )}

                    {index === 4 && (
                      <>
                        <div className="flex items-center space-x-2 text-sky-700">
                          <Ruler className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Metragens</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="areaTerreno">Área do Terreno (m²)</Label>
                            <Input
                              id="areaTerreno"
                              name="areaTerreno"
                              type="number"
                              value={currentCadastre.areaTerreno || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testada">Testada (m)</Label>
                            <Input
                              id="testada"
                              name="testada"
                              type="number"
                              value={currentCadastre.testada || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="areaEdificada">Área Edificada (m²)</Label>
                            <Input
                              id="areaEdificada"
                              name="areaEdificada"
                              type="number"
                              value={currentCadastre.areaEdificada || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {index === 5 && (
                      <>
                        <div className="flex items-center space-x-2 text-sky-700">
                          <Building2 className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Informações sobre a construção</h3>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Casa", "Apartamento", "Sala", "Loja", "Galpão", "Templo"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`tipo-${idx + 1}`}
                                    checked={currentCadastre.tipo?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "tipo", item)}
                                  />
                                  <Label htmlFor={`tipo-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Uso</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Residencial", "Comercial", "Serviço", "Industrial", "Religioso"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`uso-${idx + 1}`}
                                    checked={currentCadastre.uso?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "uso", item)}
                                  />
                                  <Label htmlFor={`uso-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Tipo de Construção</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Madeira", "Alvenaria", "Metálica", "Concreto", "Misto"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`tipoConstrucao-${idx + 1}`}
                                    checked={currentCadastre.tipoConstrucao?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "tipoConstrucao", item)}
                                  />
                                  <Label htmlFor={`tipoConstrucao-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Esquadrias</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Rústica", "Madeira", "Ferro", "Alumínio", "Especial"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`esquadrias-${idx + 1}`}
                                    checked={currentCadastre.esquadrias?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "esquadrias", item)}
                                  />
                                  <Label htmlFor={`esquadrias-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Piso</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Tijolo", "Cimento", "Tábua", "Taco", "Cerâmica", "Especial"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`piso-${idx + 1}`}
                                    checked={currentCadastre.piso?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "piso", item)}
                                  />
                                  <Label htmlFor={`piso-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Forro</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Estuque", "Placas", "Madeira", "Laje", "Gesso", "Especial", "Sem"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`forro-${idx + 1}`}
                                    checked={currentCadastre.forro?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "forro", item)}
                                  />
                                  <Label htmlFor={`forro-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Cobertura</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Zinco", "Alumínio", "Telha", "Amianto", "Especial", "Sem"].map((item, idx) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`cobertura-${idx + 1}`}
                                    checked={currentCadastre.cobertura?.includes(item) || false}
                                    onCheckedChange={(checked) => handleCheckboxChange(checked, "cobertura", item)}
                                  />
                                  <Label htmlFor={`cobertura-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Acabamento Interno</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Caiação", "Pintura Simples", "Pintura Lavável", "Papel", "Reboco", "Sem"].map(
                                (item, idx) => (
                                  <div key={item} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`acabamentoInterno-${idx + 1}`}
                                      checked={currentCadastre.acabamentoInterno?.includes(item) || false}
                                      onCheckedChange={(checked) =>
                                        handleCheckboxChange(checked, "acabamentoInterno", item)
                                      }
                                    />
                                    <Label htmlFor={`acabamentoInterno-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Acabamento Externo</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Caiação", "Pintura Simples", "Pintura Lavável", "Papel", "Reboco", "Sem"].map(
                                (item, idx) => (
                                  <div key={item} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`acabamentoExterno-${idx + 1}`}
                                      checked={currentCadastre.acabamentoExterno?.includes(item) || false}
                                      onCheckedChange={(checked) =>
                                        handleCheckboxChange(checked, "acabamentoExterno", item)
                                      }
                                    />
                                    <Label htmlFor={`acabamentoExterno-${idx + 1}`}>{`${idx + 1} - ${item}`}</Label>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSave} className="bg-sky-600 hover:bg-sky-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-sky-600 hover:bg-sky-700 text-white">
              Avançar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

