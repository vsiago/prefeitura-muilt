"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Header() {
  const [unidade, setUnidade] = useState("Vila Margarida")
  const pathname = usePathname()
  const [titulo, setTitulo] = useState("Unidades")

  useEffect(() => {
    if (pathname === "/") {
      setTitulo("Unidades")
    } else if (pathname === "/calendario") {
      setTitulo("Calendário")
    } else if (pathname === "/ferias") {
      setTitulo("Férias")
    } else if (pathname === "/coordenacao") {
      setTitulo("Coordenação")
    } else if (pathname === "/usuarios") {
      setTitulo("Usuários")
    }
  }, [pathname])

  return (
    <div className="flex justify-between items-center p-6 border-b bg-white">
      <h1 className="text-2xl text-gray-600 font-medium flex items-center gap-2">
        {pathname === "/" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        )}
        {titulo}
      </h1>
      <div className="text-right">
        <div className="text-sm text-gray-500">Administrador</div>
        <div className="text-xl font-semibold text-blue-800">Todas as unidades</div>
      </div>
    </div>
  )
}

