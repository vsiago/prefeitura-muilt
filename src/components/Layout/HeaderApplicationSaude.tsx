"use client"
import { useSelector } from "react-redux";
import { selectUser, User } from "@/redux/slices/authSlice";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeaderHomeApplicationSaude() {
    const userFromRedux = useSelector(selectUser);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (userFromRedux) {
            setUser(userFromRedux);
        }
    }, [userFromRedux]);

    if (!user) return null;

    // Definindo o valor de displayRole baseado nas condições
    const displayRole = user.role === 'Coordenador' && user.specificApplications?.some(app => app.name === 'Biométrico Saúde' && app.type === 'Master')
        ? 'Master'
        : user.role;


    // Função para extrair as iniciais do nome e sobrenome
    function getInitials(name: string) {
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }

    function formatName(name: string) {
        if (!name) return "Nome Completo";

        const ignoreWords = ["da", "do", "das", "dos"];

        let words = name
            .trim()
            .split(/\s+/)
            .filter(word => !ignoreWords.includes(word.toLowerCase()))
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        if (words.length > 2) {
            return `${words[0]} ${words.slice(1, -1).map(w => w.charAt(0) + ".").join(" ")} ${words[words.length - 1]}`;
        }

        return words.join(" ");
    }

    return (
        <header className="bg-primary10 w-full z-50 fixed shadow-lg">
            <div className="flex items-center justify-between h-20 container mx-auto">
                <Link href={"/home"} className=' h-full flex items-center justify-center'>
                    <p className="text-white text-xl font-bold">Início</p>
                </Link>
                <Image
                    src={"/images/regua-logo-itaguai.png"}
                    width={400} height={90} alt="Logos grupo" />
                <div className="flex items-center gap-2">
                    <div className="text-end">
                        <p className="font-bold text-lg leading-5 text-white">{formatName(user.name)}</p>
                        <p className="text-xs md:text-base leading-5 text-sky-100">{displayRole}</p>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <button>
                                <Avatar className="h-10 sm:w-11 sm:h-11 ring-2 ring-sky-400 ml-1">
                                    <AvatarImage src={user?.photo || undefined} alt="Avatar" className="object-cover" />
                                    <AvatarFallback className="font-semibold text-base pt-[2px] text-slate-500">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </SheetTrigger>
                        <SheetContent className="bg-sky-500 text-white w-full">
                            <SheetHeader>
                                <SheetTitle className="text-white">Perfil</SheetTitle>
                                <SheetDescription className="text-white">
                                    Informações do usuário
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4">
                                <p><strong>Nome:</strong> {user.name}</p>
                                <p><strong>Cargo:</strong> {displayRole}</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
