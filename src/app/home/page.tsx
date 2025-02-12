import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
    return (
        <ProtectedRoute>
            <main className="p-10">
                <h1 className="text-3xl font-bold">Página Inicial</h1>
            </main>
        </ProtectedRoute>
    );
}
