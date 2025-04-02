"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import { LucideIcon, Mail, FileText, Landmark, Warehouse, Users, Newspaper, Eye, DollarSign, FileCheck2, HousePlug, Hammer, HeartPulse } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const iconMap: Record<string, LucideIcon> = {
    "Reurb": Landmark,
    "Chamados Obra": Hammer,
    "ItaMail": Mail,
    "Itadesk": FileText,
    "Protocolo": FileCheck2,
    "Licitação": DollarSign,
    "Patrimônio": Warehouse,
    "Almoxarifado": HousePlug,
    "Cidadão": Users,
    "Jornal Oficial": Newspaper,
    "Transparência": Eye,
    "ISS": DollarSign,
    "Emissão da 2ª via de IPTU": FileCheck2,
    "Biométrico Saúde": HeartPulse
};

export default function Home() {
    const user = useSelector(selectUser);
    const [openItem, setOpenItem] = useState(
        user?.apps ? Object.keys(user.apps)[0] : ""
    );
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const router = useRouter()


    return (
        <main className="py-5 min-h-screen bg-gradient-to-br from-[#0266AE] to-[#083E65] pt-20">
            <div className="container mx-auto p-5">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-600 text-transparent bg-clip-text my-5 md:my-10">
                    Olá {user?.name.split(" ")[0]},
                </h1>

                <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
                    {user?.apps && Object.keys(user.apps).length > 0 ? (
                        Object.entries(user.apps).map(([category, apps]) => {
                            const isCoordinator = user.role === "Coordenador" || user.role === "Técnico" || user.role === "Master";

                            // Verifica se o usuário tem aplicativos específicos
                            const specificApplications = isCoordinator && Array.isArray(user.specificApplications)
                                ? user.specificApplications
                                : [];


                            // Criação dos aplicativos específicos com base no novo formato de objetos
                            const specificApps = specificApplications.map((app) => ({
                                _id: app._id,
                                name: app.name,
                                url: `/${app.name.toLowerCase().replace(/\s+/g, "-")}` // Melhor formatação para URL
                            }));



                            // Adicionando os aplicativos específicos à categoria "Coordenador"
                            const validApps = Array.isArray(apps) ? apps : [];

                            const allApps =
                                (category.toLowerCase() === "coordenador" || category.toLowerCase() === "técnico" ||
                                    (category.toLowerCase() === "master" || user.role === "Master"))
                                    ? [...validApps, ...specificApps]
                                    : validApps.filter(app =>
                                        !specificApplications.some(specApp => specApp.name === app.name)
                                    );


                            // Renomear para "Master" se o usuário for Coordenador e tiver o app "Biométrico Saúde"
                            const accordionTitle =
                                user?.role === "Coordenador" &&
                                    specificApplications.some(app => app.name === "Biométrico Saúde") &&
                                    category.toLowerCase() === "coordenador"
                                    ? category
                                    : category;

                            return (
                                <AccordionItem key={category} value={category} className="border-b border-slate-400/40 md:mx-0">
                                    <AccordionTrigger className="md:text-xl text-xl font-bold capitalize text-[#BDD7FF] hover:no-underline px-0 sm:px-0">
                                        {accordionTitle}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid md:p-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-6 container mx-auto">
                                            {allApps.length > 0 ? (
                                                allApps.map((app) => {
                                                    const Icon = iconMap[app.name] || FileText;

                                                    const isCoordinatorApp = isCoordinator &&
                                                        specificApplications.some(specApp => specApp.name === app.name);

                                                    return (
                                                        <div
                                                            key={app._id}
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                if (isCoordinatorApp) {
                                                                    router.push(`/auth${app.url
                                                                        .replace(/\s+/g, "")
                                                                        .replace(/^\/+/, "")
                                                                        .normalize("NFD")
                                                                        .replace(/[\u0300-\u036f]/g, "")
                                                                        }`);
                                                                } else {
                                                                    window.open(app.url, "_blank", "noopener, noreferrer");
                                                                    setSelectedApp(app.url);
                                                                }
                                                            }}
                                                        >
                                                            <div className="bg-white/80 border-2 border-white/20 shadow-sm rounded-[15%] flex flex-col items-center p-5 lg:p-5 justify-center aspect-square hover:cursor-pointer text-primary10 hover:bg-white transition-all ease-in duration-200">
                                                                <Icon className="w-14 h-14 text-[#0266AE]" />
                                                            </div>
                                                            <p className="text-center text-sm lg:text-lg font-semibold text-white mt-2 leading-5">
                                                                {app.name}
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-slate-500 col-span-full text-center text-xl">
                                                    Nenhum aplicativo disponível
                                                </p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-center">Nenhum aplicativo disponível</p>
                    )}
                </Accordion>
            </div>
        </main>
    );
}
