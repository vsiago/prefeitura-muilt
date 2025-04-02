"use client"
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout, User } from "@/redux/slices/authSlice";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DialogTitle } from "../ui/dialog";
import { X } from "lucide-react";

export default function HeaderHome() {
    const dispatch = useDispatch();
    const router = useRouter();
    const userFromRedux = useSelector(selectUser);
    const [user, setUser] = useState<User | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        if (userFromRedux) {
            setUser(userFromRedux);
            const savedImage = localStorage.getItem("profileImage");
            if (savedImage) setProfileImage(savedImage);
        }
    }, [userFromRedux]);

    function handleLogout() {
        localStorage.removeItem("token");
        dispatch(logout());
        router.push("/login");
    }

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setProfileImage(imageData);
                localStorage.setItem("profileImage", imageData);
            };
            reader.readAsDataURL(file);
        }
    }

    function getInitials(name: string) {
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }

    // Lógica para mudar o cargo para "Secretário" se as condições forem atendidas
    function getUserRole() {
        if (user?.role === "Coordenador" && user?.specificApplications?.includes("Biométrico Saúde")) {
            return "Master";
        }
        return user?.role;
    }

    if (!user) return null;

    return (
        <header className="bg-[#E2E4EE] w-full px-6 z-10 fixed drop-shadow-2xl shadow-xl">
            <div className="flex items-center justify-between h-20 container mx-auto">
                <div className='w-32 md:w-44 h-full flex items-center justify-center'>
                    <Image width={200} height={100} alt='logo' src="/logo-prefeitura-horizontal-azul.svg" className='object-contain' />
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-end">
                        <p className="font-bold text-lg leading-5 text-[#375582]">{user?.name.split(" ")[0]}</p>
                        <p className="text-xs md:text-base leading-5 text-[#0266AF]">{getUserRole()}</p>
                    </div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <button>
                                <Avatar className="h-11 w-11 ring-2 ring-sky-400 ml-1">
                                    <AvatarImage src={profileImage || user?.photo || undefined} alt="Avatar" className="object-cover" />
                                    <AvatarFallback className="font-semibold text-base pt-[2px] text-slate-500">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </SheetTrigger>
                        <SheetContent className="bg-white w-full p-6 flex flex-col">
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Perfil do Usuário
                            </DialogTitle>
                            <div className="flex flex-col items-center mt-4 relative">
                                <label htmlFor="imageUpload" className="cursor-pointer relative">
                                    <Avatar className="h-20 w-20 ring-4 ring-sky-400">
                                        <AvatarImage src={profileImage || user?.photo || undefined} alt="Avatar" className="object-cover" />
                                        <AvatarFallback className="text-lg font-semibold text-slate-500">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>

                                {/* Ícone para remover a foto */}
                                {profileImage && (
                                    <button
                                        onClick={() => {
                                            setProfileImage(null);
                                            localStorage.removeItem("profileImage");
                                        }}
                                        className="absolute top-0 right-[102] bg-white p-1 rounded-full shadow-sm hover:bg-gray-200 transition"
                                        aria-label="Remover foto de perfil"
                                    >
                                        <X className="h-4 w-4 text-gray-600" />
                                    </button>
                                )}

                                <h2 className="text-xl font-semibold text-gray-900 mt-3">{user.name}</h2>
                                <p className="text-sm text-gray-500">{getUserRole()}</p>
                            </div>

                            <div className="mt-6 space-y-2 text-gray-700 text-sm">
                                <p><strong>Nome:</strong> {user.name}</p>
                                <p><strong>Cargo:</strong> {getUserRole()}</p>
                            </div>

                            <div className="flex-grow"></div>
                            <button onClick={handleLogout} className="text-red-400 text-sm hover:text-gray-600 self-end">Sair</button>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
