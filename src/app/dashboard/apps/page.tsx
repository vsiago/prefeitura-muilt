"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";


import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function Dashboard() {
    const user = useSelector(selectUser);
    const [openItem, setOpenItem] = useState<string | undefined>('item-1');

    return (
        <main className="py-5 min-h-screen bg-[#E2E4EE] md:pl-40 lg:pl-52 xl:pl-72 md:pr-8">

            <Tabs defaultValue="apps" className="w-full container mx-auto">
                <TabsList className="w-full h-14 my-5">
                    <TabsTrigger className="w-full h-full data-[state=active]:bg-white data-[state=active]:text-primary10 transition text-xl font-semibold text-slate-700/30" value="apps">
                        Aplicativos
                    </TabsTrigger>
                    <TabsTrigger className="w-full h-full data-[state=active]:bg-white data-[state=active]:text-primary10 transition text-xl font-semibold text-slate-700/30" value="register">
                        Cadastrar
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="apps">
                    <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="">
                        <AccordionItem value="item-1" className="border-b-2 border-slate-400/40 mx-5 md:mx-0">
                            <AccordionTrigger className="text-base md:text-xl font-bold text-slate-500 hover:no-underline px-0 sm:px-0">Ativos</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid  md:p-0 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-6 gap-6 container mx-auto">
                                    {user?.apps?.length ? (
                                        user.apps.map((app, index) => (
                                            <div
                                                key={index}
                                                className="bg-white/50 border-4 border-white rounded-[15%] flex flex-col items-start p-5 xl:p-8 justify-between aspect-square hover:cursor-pointer text-primary10 hover:bg-white transition-all ease-in duration-200"
                                            >
                                                <img src={app.icon} alt={app.name} className="w-10 h-10" />
                                                <p className="text-start text-sm md:text-base xl:text-xl font-semibold">{app.name}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-500 col-span-full text-center text-xl">
                                            Nenhum aplicativo disponível
                                        </p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-b-2 border-slate-400/40 mx-5 md:mx-0">
                            <AccordionTrigger className="text-base md:text-xl font-bold text-slate-500 hover:no-underline px-0 sm:px-0">Inativo</AccordionTrigger>
                            <AccordionContent>

                                <p className="text-slate-500 col-span-full text-center text-xl">
                                    Nenhum aplicativo disponível
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>
                <TabsContent value="register">
                    <div className="flex justify-between items-center">
                        <h1 className="my-10 text-2xl text-slate-500">Cadastrar um aplicativo</h1>
                        <Dialog>
                            <DialogTrigger>Open</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Button size={"lg"}>Novo aplicativo</Button>
                    </div>
                    <div className=" bg-white/50 border-2 border-white w-full min-h-44 rounded-3xl mb-10"></div>
                    <Accordion type="multiple" defaultValue={["Servidor", "Técnico", "Coordenador", "Master"]} className="flex gap-4">
                        <AccordionItem value="member" className="border-b-2 border-slate-400/40 mx-5 md:mx-0 flex-1">
                            <AccordionTrigger className="text-base md:text-xl font-bold text-slate-500 hover:no-underline px-0 sm:px-0">
                                Servidor
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-slate-500 col-span-full text-center text-xl">
                                    Aplicativos Área
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tecnico" className="border-b-2 border-slate-400/40 mx-5 md:mx-0 flex-1">
                            <AccordionTrigger className="text-base md:text-xl font-bold text-slate-500 hover:no-underline px-0 sm:px-0">
                                Técnico
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-slate-500 col-span-full text-center text-xl">
                                    Aplicativos Área
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="admin" className="border-b-2 border-slate-400/40 mx-5 md:mx-0 flex-1">
                            <AccordionTrigger className="text-base md:text-xl font-bold text-slate-500 hover:no-underline px-0 sm:px-0">
                                Administrador
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-slate-500 col-span-full text-center text-xl">
                                    Aplicativos Área
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="master" className="border-b-2 border-slate-400/40 mx-5 md:mx-0 flex-1">
                            <AccordionTrigger className="text-base md:text-xl font-bold text-slate-500 hover:no-underline px-0 sm:px-0">
                                Master
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-slate-500 col-span-full text-center text-xl">
                                    Aplicativos Área
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>
            </Tabs>

        </main>
    );
}