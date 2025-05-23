import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import HeaderHomeApplicationSaude from "../../../components/Layout/HeaderApplicationSaude";


export const metadata = {
  title: "Sistema de Biometria",
  description: "Sistema de Biometria para Unidades de Saúde",
  generator: 'Prefeitura de Itaguaí'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
        <div className="flex min-h-screen bg-slate-100">
          <div className="flex-1">
            <HeaderHomeApplicationSaude />
            <main className="pt-24">{children}</main>
          </div>
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}



import './globals.css'