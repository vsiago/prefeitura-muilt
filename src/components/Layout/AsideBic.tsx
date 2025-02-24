import { LayoutGrid, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Asidebic() {
    const pathname = usePathname();


    return (
        <aside className=" md:h-screen h-16 w-full md:w-32 lg:w-44 xl:w-28 fixed md:top-20 left-0 bottom-0 z-10  md:block border-t border-white/20 drop-shadow-2xl md:drop-shadow-none pointer-events-auto">
            <div className="h-full w-full md:pt-8 md:pb-32">
                <div className="h-full w-full p-4 flex md:flex-col items-center md:justify-between justify-around border-r border-slate-400/20">
                    <Link
                        href="/bic"
                        className={`w-10 h-10 md:w-40 md:h-40 flex flex-col items-center justify-center rounded-2xl scale-75
                            ${pathname === "/bic" ? "bg-white/0" : "bg-white/0"}`}
                    >
                        <LayoutGrid
                            size={70}
                            className={`md:w-10 lg:w-12 xl:w-32 transition-opacity duration-300 ${pathname === "/bic" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}
                        />
                        <p className={`transition-opacity duration-300 text-xs sm:text-xs md:text-base lg:text-lg lg:mt-2 md:-mt-3 xl:text-xl font-semibold ${pathname === "/bic" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}>Cadastros</p>
                    </Link>

                    <Link
                        href="/bic/users"
                        className={`w-10 h-10 md:w-40 md:h-40 flex flex-col items-center justify-center rounded-2xl scale-75
                            ${pathname === "/bic/users" ? "bg-white/0" : "bg-white/0"}`}
                    >
                        <Users
                            size={70}
                            className={`md:w-10 lg:w-12 xl:w-32 transition-opacity duration-300 ${pathname === "/bic/users" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}
                        />
                        <p className={`transition-opacity duration-300 text-xs sm:text-xs md:text-base lg:text-lg lg:mt-2 md:-mt-3 xl:text-xl font-semibold ${pathname === "/bic/users" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}>Usuários</p>
                    </Link>
                </div>
            </div>
        </aside>
    )
}