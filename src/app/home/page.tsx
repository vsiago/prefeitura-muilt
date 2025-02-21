"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import { LucideIcon, Mail, FileText, Landmark, Warehouse, Users, Newspaper, Eye, DollarSign, FileCheck2, HousePlug } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const iconMap: Record<string, LucideIcon> = {
    "Reurb": Landmark,
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
    "Emissão da 2ª via de IPTU": FileCheck2
};

export default function Home() {
    const user = useSelector(selectUser);
    const [openItem, setOpenItem] = useState(
        user?.apps ? Object.keys(user.apps)[0] : ""
    );
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const router = useRouter()


    return (
        <ProtectedRoute>
            <main className="py-5 min-h-screen bg-gradient-to-br from-[#0266AE] to-[#083E65] pt-20">
                <div className="container mx-auto p-5">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-600 text-transparent bg-clip-text my-10">
                        Olá {user.name.split(" ")[0]},
                    </h1>

                    <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
                        {user?.apps && Object.keys(user.apps).length > 0 ? (
                            Object.entries(user.apps).map(([category, apps]) => {
                                const isCoordinator = user.role === "Coordenador";
                                const specificApplications = isCoordinator && Array.isArray(user.specificApplications) ? user.specificApplications : [];

                                // Criando os aplicativos específicos
                                const specificApps = specificApplications.map((appName) => ({
                                    _id: appName,
                                    name: appName,
                                    url: `/${appName.toLowerCase()}`
                                }));

                                // Adicionando os aplicativos específicos à categoria "Coordenador"
                                const validApps = Array.isArray(apps) ? apps : [];

                                const allApps = category.toLowerCase() === "coordenador"
                                    ? [...validApps, ...specificApps] // Junta os apps gerais e específicos
                                    : validApps; // Mantém só os gerais nas outras categorias

                                console.log("Final Apps for Category:", category, allApps);
                                return (
                                    <AccordionItem key={category} value={category} className="border-b-2 border-slate-400/40 mx-5 md:mx-0">
                                        <AccordionTrigger className="md:text-xl text-xl font-bold capitalize mb-3 text-[#BDD7FF] hover:no-underline px-0 sm:px-0">
                                            {category}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid md:p-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-6 container mx-auto">
                                                {allApps && allApps.length > 0 ? (
                                                    allApps.map((app) => {
                                                        const Icon = iconMap[app.name] || FileText;
                                                        const isCoordinatorApp = user.role === "Coordenador" && user.specificApplications.includes(app.name);

                                                        return (
                                                            <div
                                                                key={app._id}
                                                                className="cursor-pointer"
                                                                onClick={() => {
                                                                    if (isCoordinatorApp) {
                                                                        router.push(`/auth${app.url.replace(/^\/+/, "")}`);

                                                                    } else {
                                                                        window.open(app.url, "_blank", "noopener,noreferrer"); // Nova aba
                                                                    }
                                                                }}
                                                            >
                                                                <div className="bg-white/80 border-2 border-white/20 shadow-sm rounded-[15%] flex flex-col items-center p-5 lg:p-5 justify-center aspect-square hover:cursor-pointer text-primary10 hover:bg-white transition-all ease-in duration-200">
                                                                    <Icon className="w-14 h-14 text-[#0266AE]" />
                                                                </div>
                                                                <p className="text-center text-sm lg:text-lg font-semibold text-white mt-2">
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

                    {/* Área do iframe */}
                    {selectedApp && (
                        <div className="mt-10">
                            <h2 className="text-2xl font-semibold text-white mb-5">Visualização:</h2>
                            <iframe
                                src={selectedApp}
                                width="100%"
                                height="600px"
                                className="border rounded-lg"
                            ></iframe>
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
