"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user roles
export type UserRole = "Master" | "Administrador" | "Coordenador" | "Funcionário"

interface User {
    id: string
    name: string
    role: UserRole
    unidades?: string[] // IDs of units the user has access to
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    hasPermission: (requiredRoles: UserRole[]) => boolean
    canManageEmployees: () => boolean
    canManageUnits: () => boolean
    canAccessSettings: () => boolean
    canDeleteUnits: () => boolean
    canCreateUnits: () => boolean
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    hasPermission: () => false,
    canManageEmployees: () => false,
    canManageUnits: () => false,
    canAccessSettings: () => false,
    canDeleteUnits: () => false,
    canCreateUnits: () => false,
})

// Mock function to get the current user - in a real app, this would check cookies/localStorage/API
const getCurrentUser = (): User | null => {
    // For development, we'll use localStorage to store the user role
    // In production, this would come from a proper auth system
    if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("biometrico_user")
        if (storedUser) {
            return JSON.parse(storedUser)
        }

        // Default user if none is set
        const defaultUser = {
            id: "1",
            name: "Usuário Teste",
            role: "Administrador" as UserRole,
        }

        // Store the default user
        localStorage.setItem("biometrico_user", JSON.stringify(defaultUser))
        return defaultUser
    }

    return null
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Get the current user when the component mounts
        const user = getCurrentUser()
        setUser(user)
        setIsLoading(false)
    }, [])

    // Function to check if the user has the required role
    const hasPermission = (requiredRoles: UserRole[]): boolean => {
        if (!user) return false
        return requiredRoles.includes(user.role)
    }

    // Specific permission checks based on requirements
    const canManageEmployees = (): boolean => {
        if (!user) return false
        return ["Master", "Administrador"].includes(user.role)
    }

    const canManageUnits = (): boolean => {
        if (!user) return false
        return ["Master", "Administrador"].includes(user.role)
    }

    const canAccessSettings = (): boolean => {
        if (!user) return false
        return ["Master", "Administrador"].includes(user.role)
    }

    // Modificar a função canDeleteUnits para permitir apenas Master
    const canDeleteUnits = (): boolean => {
        if (!user) return false
        return user.role === "Master" // Apenas Master pode excluir unidades
    }

    // Modificar a função canCreateUnits para permitir apenas Master
    const canCreateUnits = (): boolean => {
        if (!user) return false
        return user.role === "Master" // Apenas Master pode criar unidades
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                hasPermission,
                canManageEmployees,
                canManageUnits,
                canAccessSettings,
                canDeleteUnits,
                canCreateUnits,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)