"use client"

import { useState, useEffect } from "react"
import { Search, Menu, Send, Paperclip, Smile, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import HeaderHome from "@/components/Layout/HeaderHome"
import AsideHome from "@/components/Layout/AsideHome"

// Simulação de API que retorna funcionários do Active Directory
const fetchEmployees = async () => {
    return [
        { id: 1, name: "Carlos Silva", department: "TI", avatar: "https://i.pravatar.cc/32?img=3" },
        { id: 2, name: "Mariana Souza", department: "RH", avatar: "https://i.pravatar.cc/32?img=5" },
        { id: 3, name: "Ricardo Lima", department: "Financeiro", avatar: "https://i.pravatar.cc/32?img=7" },
    ]
}

export default function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [employees, setEmployees] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")

    useEffect(() => {
        // Busca os funcionários do Active Directory
        fetchEmployees().then(setEmployees)
    }, [])

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    const handleSelectChat = (employee) => {
        setSelectedChat(employee)
        setSidebarOpen(false) // Close sidebar on mobile when a chat is selected
        // Simula mensagens carregadas da API
        setMessages([
            { id: 1, role: "system", content: `Bem-vindo ao chat com ${employee.name}.` },
            { id: 2, role: "user", content: "Oi, tudo bem?" },
            { id: 3, role: "system", content: "Olá! Como posso ajudar?" },
        ])
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const newMessage = { id: Date.now(), role: "user", content: input }
        setMessages((prev) => [...prev, newMessage])
        setInput("")
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-[#0266AE] to-[#083E65]  overflow-hidden">
            <HeaderHome />
            <AsideHome />
            <div className="flex flex-col md:flex-row h-full  pt-20 pb-14 md:p-40 xl:px-56 ">
                {/* Sidebar */}
                <div
                    className={`bg-white/80 w-full  md:w-80 flex-shrink-0 rounded-l-lg ${sidebarOpen ? "block" : "hidden"} md:block`}
                >
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-xl font-semibold">Chat do departamento</h1>
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Pesquisar pessoa..." className="pl-8" />
                        </div>
                    </div>
                    <ScrollArea className="h-[calc(100vh-10rem)]">
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="flex items-center gap-3 p-4 hover:bg-white/50 cursor-pointer translate-all duration-150 ease-in-out"
                                onClick={() => handleSelectChat(employee)}
                            >
                                <Avatar>
                                    <AvatarImage src={employee.avatar} />
                                    <AvatarFallback>{employee.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{employee.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{employee.department}</p>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* Main Chat Area */}
                <div className={`flex-1 h-full flex pb-40  flex-col  ${!sidebarOpen ? "block" : "hidden"} md:block`}>
                    {/* Chat Header */}
                    {selectedChat ? (
                        <>
                            <div className="bg-white/90 border-b-2 p-4 flex items-center rounded-tr-lg justify-between">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <Avatar>
                                        <AvatarImage src={selectedChat.avatar} />
                                        <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold">{selectedChat.name}</h2>
                                        <p className="text-sm text-gray-500">{selectedChat.department}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 h-full p-4 bg-sky-950/50 ">
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${m.role === "user" ? "bg-blue-500 text-white" : "bg-white"
                                                }`}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="bg-white/80 border-t-2 border-white/20 p-4 rounded-br-lg">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <Button type="button" variant="ghost" size="icon">
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a message"
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="ghost" size="icon">
                                        <Smile className="h-5 w-5" />
                                    </Button>
                                    <Button type="submit" size="icon">
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 h-full flex items-center text-xl justify-center text-white">
                            Selecione um funcionário para iniciar o chat.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

