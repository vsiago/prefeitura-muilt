"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";

export default function Bic() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!isLoading) {
            const isAuthorized = user && (
                user.role === "Coordenador" ||
                (user.role === "Tecnico" && user.specificApplications?.includes("BIC"))
            );
            if (!isAuthorized) {
                router.replace("/home");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return null;

    const groupNames = Object.keys(user.usersByGroup);
    const filteredUsers = (users) => users.filter(({ fullName, username }) =>
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const promoteUser = async (username) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token não encontrado");
            return;
        }
        try {
            await axios.post("http://localhost:3333/api/apps/instal-tecnico", {
                username,
                apps: ["BIC"]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Usuário ${username} promovido com sucesso!`);
        } catch (error) {
            console.error("Erro ao promover usuário", error);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-start pt-20 bg-gray-100">
            <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg w-full my-20">
                <Tabs defaultValue={groupNames[0]} className="w-full">
                    <div className="flex justify-between border-b mb-6">
                        <h1 className="text-3xl font-bold mb-4 text-start text-gray-800">Usuários</h1>
                        <TabsList className="flex justify-between bg-slate-200 rounded-lg mb-4">
                            {groupNames.map((groupName) => (
                                <TabsTrigger key={groupName} value={groupName} className="text-md rounded-lg text-slate-400 font-medium">
                                    <p className="text-slate-700">{groupName}</p>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar usuários..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg"
                        />
                    </div>
                    {groupNames.map((groupName) => (
                        <TabsContent key={groupName} value={groupName} className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredUsers(user.usersByGroup[groupName]).map((user) => {
                                    const isPromoted = user.specificApplications?.includes("BIC");
                                    return (
                                        <div
                                            key={user.username}
                                            className={`flex items-center p-4 rounded-lg shadow-sm transition cursor-pointer ${isPromoted ? "bg-green-100" : "bg-gray-50 hover:bg-gray-100"}`}
                                        >
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white font-semibold text-lg mr-4">
                                                {user.fullName.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">@{user.username}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <Select onValueChange={() => promoteUser(user.username)} defaultValue={isPromoted ? "promovido" : ""}>
                                                <SelectTrigger className="w-48">
                                                    <span>{isPromoted ? "Promovido como Técnico" : "Ação"}</span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="promover">Promover para Técnico</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </main>
    );
}
