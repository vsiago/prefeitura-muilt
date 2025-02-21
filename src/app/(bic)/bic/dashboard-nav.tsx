import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText, LogOut } from "lucide-react"

export function DashboardNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-blue-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-blue-700">BIC</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <FileText className="h-5 w-5 mr-2" />
              Cadastros
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

