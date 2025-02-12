import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <main className="p-10">
                <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            </main>
        </ProtectedRoute>
    );
}
