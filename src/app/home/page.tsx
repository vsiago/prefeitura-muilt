"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/store/slices/authSlice";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
    const user = useSelector(selectUser);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <ProtectedRoute>
            <header className="bg-primary10 px-5 w-full">
                <div className="flex items-center justify-between h-16 container mx-auto">
                    <h1 className="text-white text-xl font-bold">ItaSuit</h1>
                    <div className="flex items-center gap-2">
                        <div className="text-end">
                            <p className="text-white font-bold text-[.8rem]">{user?.name}</p>
                            <p className="text-sky-200 text-[.8rem]">{user?.role}</p>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <button>
                                    <Avatar>
                                        <AvatarImage src="https://avatars.githubusercontent.com/u/101620032?v=4" />
                                        <AvatarFallback>CN</AvatarFallback>
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
                                    <p><strong>Nome:</strong> {user?.name}</p>
                                    <p><strong>Cargo:</strong> {user?.role}</p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
            <main className="py-5 min-h-screen bg-[#E2E4EE]">
                <div className="grid p-5 md:p-0 grid-cols-2 sm:grid-cols-4 gap-3 container mx-auto">
                    {user?.apps?.length ? (
                        user.apps.map((app, index) => (
                            <div
                                key={index}
                                className="bg-white/70 border-4 border-white rounded-[10%] flex flex-col items-start p-5 lg:p-8 justify-between aspect-square hover:cursor-pointer text-primary10 hover:bg-white transition-all ease-in duration-200"
                            >
                                <img src={app.icon} alt={app.name} className="w-10 h-10" />
                                <p className="text-center text-sm lg:text-xl font-semibold">{app.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">
                            Nenhum aplicativo disponível
                        </p>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}