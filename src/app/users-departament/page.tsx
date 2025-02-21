"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/authSlice";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Code, Building2, Search } from "lucide-react";

const userGroups = {
    "Area Tecnica STI": [
        { username: "custom", fullName: "Custom" },
        { username: "hyago.lopes", fullName: "Hyago Barbosa Lopes" },
        { username: "wellington.costa", fullName: "Welington Viana Costa" },
        { username: "luiz.souza", fullName: "Luiz Ricardo de Souza" },
        { username: "lucas.rangel", fullName: "Lucas da Silva Rangel" },
    ],
    "Infraestrutura": [
        { username: "carlos.mendes", fullName: "Carlos Eduardo Mendes" },
        { username: "fernanda.lima", fullName: "Fernanda Santos Lima" },
        { username: "ricardo.oliveira", fullName: "Ricardo Oliveira Souza" },
    ],
};

export default function UsersDepartment() {
    const user = useSelector(selectUser);
    const [activeTab, setActiveTab] = useState(Object.keys(userGroups)[0]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = useMemo(() => {
        return userGroups[activeTab]?.filter(
            (u) =>
                u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeTab, searchQuery]);

    return (
        <ProtectedRoute>
            <main className="py-5 min-h-screen bg-gradient-to-br from-[#0266AE] to-[#083E65] pt-20">
                <div className="container mx-auto py-10">
                    <h1 className="text-3xl text-white mb-8">Usuários do Departamento</h1>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-xl shadow-lg p-4">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            {Object.keys(userGroups).map((group) => (
                                <TabsTrigger key={group} value={group} className="flex items-center justify-center py-3">
                                    {group === "Area Tecnica STI" ? <Users className="w-5 h-5 mr-2" /> : <Building2 className="w-5 h-5 mr-2" />}
                                    {group}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar usuários..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full"
                            />
                        </div>

                        {Object.keys(userGroups).map((group) => (
                            <TabsContent key={group} value={group}>
                                <Card>
                                    <CardContent className="pt-6">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nome</TableHead>
                                                    <TableHead>Username</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user, index) => (
                                                    <TableRow key={user.username || index}>
                                                        <TableCell>{user.fullName}</TableCell>
                                                        <TableCell>{user.username}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </ProtectedRoute>
    );
}