// app/bic/layout.tsx
"use client";

import AsideObras from "./AsideChamadosObra";
import HeaderHomeApplication from "@/components/Layout/HeaderApplication";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardBicLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col">
                <HeaderHomeApplication />
                <AsideObras />
                <div className="">{children}</div>
            </div>
        </ProtectedRoute>
    );
}
