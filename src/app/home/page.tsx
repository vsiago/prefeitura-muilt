"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/store/slices/authSlice";

export default function Home() {
    const user = useSelector(selectUser);

    return (
        <ProtectedRoute>
            <main className="py-5 min-h-screen bg-[#E2E4EE]">
                <div className="container mx-auto p-5">
                    {user?.apps && Object.keys(user.apps).length > 0 ? (
                        Object.entries(user.apps).map(([category, apps]) => (
                            <div key={category} className="mb-8">
                                {/* Título da Categoria */}
                                <h2 className="text-xl font-bold text-gray-700 capitalize mb-3">
                                    {category}
                                </h2>

                                {/* Grid de Apps */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {apps.map((app) => (
                                        <div
                                            key={app._id}
                                            className="bg-white/70 border-4 border-white rounded-[10%] flex flex-col items-start p-5 lg:p-8 justify-between aspect-square hover:cursor-pointer text-primary10 hover:bg-white transition-all ease-in duration-200"
                                        >
                                            <img src={app.logoUrl} alt={app.name} className="w-10 h-10" />
                                            <p className="text-center text-sm lg:text-xl font-semibold">
                                                {app.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">
                            Nenhum aplicativo disponível
                        </p>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
