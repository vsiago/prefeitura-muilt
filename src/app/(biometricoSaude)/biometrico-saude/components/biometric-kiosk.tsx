"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Fingerprint, Check, AlertTriangle, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Unidade } from "@/lib/api"

interface BiometricKioskProps {
    unidade: Unidade
}

export function BiometricKiosk({ unidade }: BiometricKioskProps) {
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
    const [message, setMessage] = useState<string>("")
    const [lastRegisteredUser, setLastRegisteredUser] = useState<string | null>(null)
    const [registrationType, setRegistrationType] = useState<"entrada" | "saida" | null>(null)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Atualizar o relógio a cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    const handleBiometricPonto = async () => {
        setStatus("processing")
        setMessage("Processando leitura biométrica...")
        setLastRegisteredUser(null)
        setRegistrationType(null)

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
                    setStatus("error")
                    setMessage("Usuário não identificado. Tente novamente.")
                    return
                }

                if (data.message.includes("já bateu seu ponto")) {
                    setStatus("error")
                    setMessage(data.message)
                    return
                }

                // Registro bem-sucedido
                setStatus("success")

                // Extrair nome do funcionário da mensagem
                const userName = data.message.split(":")[1]?.trim() || "funcionário"
                setLastRegisteredUser(userName)

                // Determinar se foi entrada ou saída
                if (data.registro_ponto) {
                    if (data.registro_ponto.hora_entrada && !data.registro_ponto.hora_saida) {
                        setRegistrationType("entrada")
                        setMessage(`Entrada registrada para ${userName}`)
                    } else if (data.registro_ponto.hora_saida) {
                        setRegistrationType("saida")
                        setMessage(`Saída registrada para ${userName}`)
                    }
                } else {
                    setMessage(`Ponto registrado para ${userName}`)
                }

                // Resetar o status após 5 segundos
                setTimeout(() => {
                    setStatus("idle")
                    setMessage("")
                }, 5000)
            } catch (fetchError) {
                clearTimeout(timeoutId)
                console.error("Erro na comunicação com o servidor biométrico:", fetchError)

                // Verificar se é um erro de timeout
                if (fetchError.name === "AbortError") {
                    setStatus("error")
                    setMessage("Tempo limite excedido. Verifique se o leitor está conectado.")
                } else {
                    setStatus("error")
                    setMessage("Erro de comunicação com o servidor biométrico.")
                }

                // Modo de simulação para desenvolvimento
                if (process.env.NODE_ENV === "development") {
                    console.log("Usando modo de simulação para desenvolvimento")

                    // Simular um registro aleatório (entrada ou saída)
                    const isEntrada = Math.random() > 0.5
                    const mockUserName = "João da Silva"

                    setStatus("success")
                    setLastRegisteredUser(mockUserName)

                    if (isEntrada) {
                        setRegistrationType("entrada")
                        setMessage(`Simulação: Entrada registrada para ${mockUserName}`)
                    } else {
                        setRegistrationType("saida")
                        setMessage(`Simulação: Saída registrada para ${mockUserName}`)
                    }

                    // Resetar o status após 5 segundos
                    setTimeout(() => {
                        setStatus("idle")
                        setMessage("")
                    }, 5000)
                }
            }
        } catch (error) {
            console.error("Erro ao registrar ponto biométrico:", error)
            setStatus("error")
            setMessage("Ocorreu um erro ao processar a solicitação.")
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen max-h-screen bg-gradient-to-b absolute top-0 z-50 w-full from-blue-100 to-blue-200 overflow-hidden p-0 m-0">
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 p-0 m-0">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-400 filter blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500 filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-300 filter blur-3xl"></div>
            </div>

            {/* Header com fundo azul e régua de logos */}
            <div className="w-full bg-[#0266AF] shadow-md z-10 mb-4">
                <div className="container mx-auto py-3 px-4 flex flex-col items-center justify-center">
                    <div className="w-full flex justify-center">
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/regua-logo-itaguai-xK18ZSe6KpFsvRsGLKOAnRt60GYs6e.png"
                            alt="Logos Institucionais"
                            width={600}
                            height={80}
                            className="h-16 w-auto"
                        />
                    </div>
                </div>
            </div>

            {/* Conteúdo principal sem scroll, com distribuição vertical equilibrada */}
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-between px-0 ]">
                <div className="mt-6">
                    <h2 className="text-xl text-slate-600 text-center font-medium">Unidade: {unidade.nome}</h2>
                </div>
                {/* Container para agrupar relógio e card principal com espaçamento equilibrado */}
                <div className="flex-1 flex flex-col items-center justify-center py-6 w-full">
                    {/* Relógio digital - com margem ajustada */}
                    <div className="mb-8 text-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg">
                        <div className="text-4xl font-bold text-blue-900 mb-1 font-mono tracking-wider">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-sm text-blue-700 capitalize font-medium">{formatDate(currentTime)}</div>
                    </div>

                    {/* Card principal */}
                    <Card className="w-full max-w-xl p-6 py-16 mt-10 shadow-xl bg-white/30 border-2 border-white/60 rounded-2xl relative overflow-hidden">
                        {/* Borda decorativa */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>

                        <div className="flex flex-col items-center">
                            {/* Ícone de status */}
                            <div className="relative mb-8">
                                {status === "idle" && (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-100 rounded-full scale-[1.15] animate-pulse"></div>
                                        <div className="relative">
                                            <Fingerprint className="h-40 w-40 text-blue-600" />
                                        </div>
                                    </div>
                                )}

                                {status === "processing" && (
                                    <div className="h-40 w-40 flex items-center justify-center">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin h-32 w-32 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                                        </div>
                                        <Fingerprint className="h-24 w-24 text-blue-500" />
                                    </div>
                                )}

                                {status === "success" && registrationType === "entrada" && (
                                    <div className="h-40 w-40 flex items-center justify-center text-green-500 animate-fadeIn">
                                        <div className="absolute inset-0 bg-green-100 rounded-full scale-[1.15]"></div>
                                        <div className="relative">
                                            <LogIn className="h-32 w-32" />
                                            <div className="absolute -right-4 -bottom-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
                                                <Check className="h-8 w-8" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {status === "success" && registrationType === "saida" && (
                                    <div className="h-40 w-40 flex items-center justify-center text-blue-500 animate-fadeIn">
                                        <div className="absolute inset-0 bg-blue-100 rounded-full scale-[1.15]"></div>
                                        <div className="relative">
                                            <LogOut className="h-32 w-32" />
                                            <div className="absolute -right-4 -bottom-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
                                                <Check className="h-8 w-8" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {status === "success" && !registrationType && (
                                    <div className="h-40 w-40 flex items-center justify-center text-green-500 animate-fadeIn">
                                        <div className="absolute inset-0 bg-green-100 rounded-full scale-[1.15]"></div>
                                        <div className="relative">
                                            <Check className="h-32 w-32" />
                                        </div>
                                    </div>
                                )}

                                {status === "error" && (
                                    <div className="h-40 w-40 flex items-center justify-center text-red-500 animate-fadeIn">
                                        <div className="absolute inset-0 bg-red-100 rounded-full scale-[1.15]"></div>
                                        <div className="relative">
                                            <AlertTriangle className="h-32 w-32" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mensagem de status */}
                            {message && (
                                <div
                                    className={`mb-8 p-5 rounded-xl text-center text-lg font-medium w-full shadow-md animate-fadeIn ${status === "success"
                                        ? "bg-green-50 text-green-800 border-l-4 border-green-500"
                                        : status === "error"
                                            ? "bg-red-50 text-red-800 border-l-4 border-red-500"
                                            : "bg-blue-50 text-blue-800 border-l-4 border-blue-500"
                                        }`}
                                >
                                    {message}
                                </div>
                            )}

                            {/* Instruções */}
                            <h3 className="text-2xl font-semibold mb-4 text-center text-blue-900">
                                {status === "idle"
                                    ? "Posicione seu dedo no leitor biométrico"
                                    : status === "processing"
                                        ? "Processando..."
                                        : status === "success"
                                            ? "Registro concluído!"
                                            : "Ocorreu um erro"}
                            </h3>

                            <p className="text-gray-600 mb-8 text-center text-lg max-w-md">
                                {status === "idle"
                                    ? "Aproxime seu dedo do leitor para registrar seu ponto de entrada ou saída."
                                    : status === "processing"
                                        ? "Aguarde enquanto processamos sua identificação..."
                                        : status === "success"
                                            ? "Você pode se retirar. Obrigado!"
                                            : "Por favor, tente novamente ou contate o suporte."}
                            </p>

                            {/* Botão para simular o registro (apenas para desenvolvimento) */}
                            {process.env.NODE_ENV === "development" && status !== "processing" && (
                                <Button
                                    onClick={handleBiometricPonto}
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-xl h-auto rounded-xl shadow-lg transition-all hover:scale-105"
                                >
                                    <Fingerprint className="mr-2 h-7 w-7" />
                                    Registrar de Ponto
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Último registro - ajustado para ficar mais próximo */}
                    {lastRegisteredUser && status === "success" && (
                        <div className="mt-8 text-center animate-fadeIn bg-white/80 backdrop-blur-sm px-8 py-4 rounded-xl shadow-lg">
                            <p className="text-lg text-gray-600">Último registro:</p>
                            <p className="text-2xl font-semibold text-blue-800">{lastRegisteredUser}</p>
                            <p className="text-md text-blue-600">
                                {registrationType === "entrada" ? "Entrada" : "Saída"} às {formatTime(new Date())}
                            </p>
                        </div>
                    )}
                </div>

                {/* Rodapé - ajustado para ficar mais próximo do conteúdo */}
                <footer className="py-4 text-center text-gray-600 w-full mt-6">
                    <p className="font-medium">Sistema de Ponto Biométrico - Prefeitura de Itaguaí</p>
                    <p className="text-sm mt-1">© {new Date().getFullYear()} - Todos os direitos reservados</p>
                </footer>
            </div>
        </div>
    )
}
