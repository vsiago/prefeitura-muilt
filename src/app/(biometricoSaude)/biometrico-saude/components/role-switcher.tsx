"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type UserRole, useAuth } from "@/lib/auth-context"
import { Shield, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RoleSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const [showPermissions, setShowPermissions] = useState(false)
    const { user, canManageEmployees, canAccessSettings, canDeleteUnits, canCreateUnits } = useAuth()

    const [currentRole, setCurrentRole] = useState<UserRole>(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("biometrico_user")
            if (storedUser) {
                return JSON.parse(storedUser).role
            }
        }
        return "Administrador"
    })

    const handleRoleChange = (role: UserRole) => {
        // Update the user in localStorage
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("biometrico_user")
            if (storedUser) {
                const user = JSON.parse(storedUser)
                user.role = role
                localStorage.setItem("biometrico_user", JSON.stringify(user))
                setCurrentRole(role)

                // Reload the page to apply the new role
                window.location.reload()
            }
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Alterar Função</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                            X
                        </Button>
                    </div>
                    <Select value={currentRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Master">Master</SelectItem>
                            <SelectItem value="Administrador">Administrador</SelectItem>
                            <SelectItem value="Coordenador">Coordenador</SelectItem>
                            <SelectItem value="Funcionário">Funcionário</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                        <span>
                            Função atual: <span className="font-medium">{currentRole}</span>
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => setShowPermissions(!showPermissions)}
                        >
                            <Info className="h-4 w-4 text-blue-500" />
                        </Button>
                    </div>

                    {showPermissions && (
                        <div className="mt-4 text-xs border rounded-md p-3 bg-gray-50">
                            <h4 className="font-medium mb-2">Permissões da função atual:</h4>
                            <ul className="space-y-1">
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${canManageEmployees() ? "bg-green-500" : "bg-red-500"}`}></div>
                                    Gerenciar funcionários: {canManageEmployees() ? "Sim" : "Não"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${canAccessSettings() ? "bg-green-500" : "bg-red-500"}`}></div>
                                    Acessar configurações: {canAccessSettings() ? "Sim" : "Não"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${canCreateUnits() ? "bg-green-500" : "bg-red-500"}`}></div>
                                    Criar unidades: {canCreateUnits() ? "Sim" : "Não"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${canDeleteUnits() ? "bg-green-500" : "bg-red-500"}`}></div>
                                    Excluir unidades: {canDeleteUnits() ? "Sim" : "Não"}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setIsOpen(true)}
                                className={`rounded-full h-12 w-12 flex items-center justify-center ${currentRole === "Master"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : currentRole === "Administrador"
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : currentRole === "Coordenador"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-gray-600 hover:bg-gray-700"
                                    }`}
                            >
                                <Shield className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Função atual: {currentRole}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    )
}

