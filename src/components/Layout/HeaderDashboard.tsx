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
import Image from 'next/image';
import { useEffect, useState } from "react";

export default function HeaderDashboard() {
    const userFromRedux = useSelector(selectUser);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (userFromRedux) {
            setUser(userFromRedux);
        }
    }, [userFromRedux]);

    if (!user) return null;

    // Função para extrair as iniciais do nome e sobrenome
    function getInitials(name: string) {
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }


    return (
        <header className="bg-primary10 w-full lg:pl-44 xl:pl-72 px-6 relative z-10">
            <div className="flex items-center justify-between h-20 container mx-auto">
                <div className="flex items-center gap-2">
                    <div className="text-end">
                        <p className="text-white font-bold text-base leading-5">{user.name}</p>
                        <p className="text-sky-200 text-xs md:text-base leading-5">{user.role}</p>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <button>
                                <Avatar className="h-10 sm:w-11 sm:h-11  ring-2 ring-sky-400 ml-1">
                                    <AvatarImage src={user?.photo || undefined} alt="Avatar" className="object-cover" />
                                    <AvatarFallback className="font-semibold text-base pt-[2px] text-slate-500">{getInitials(user.name)}</AvatarFallback>
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
                                <p><strong>Cargo:</strong> {user.role}</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
