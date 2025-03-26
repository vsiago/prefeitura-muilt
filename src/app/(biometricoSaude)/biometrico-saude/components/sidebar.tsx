import Image from "next/image"
import Link from "next/link"
import { Home, Calendar, FileText, User } from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-[220px] bg-white shadow-sm flex flex-col items-center py-8 min-h-screen">
      <div className="mb-12">
        <Image
          src="/logo-municipio-itaguai2.svg"
          alt="Prefeitura de Itaguaí"
          width={180}
          height={100}
          className="mb-4"
        />
      </div>

      <nav className="flex flex-col items-center gap-10 flex-1">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 flex items-center justify-center rounded-md">
            <Home className="w-10 h-10 text-blue-600" />
          </div>
        </Link>

        <Link href="/calendario" className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 flex items-center justify-center rounded-md">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
        </Link>

        <Link href="/ferias" className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 flex items-center justify-center rounded-md">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
        </Link>
      </nav>

      <div className="mt-auto mb-8">
        <Link href="/coordenacao" className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 flex items-center justify-center rounded-md">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <span className="text-sm text-gray-400">Coordenação</span>
        </Link>
      </div>
    </div>
  )
}

