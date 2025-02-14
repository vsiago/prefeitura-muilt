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