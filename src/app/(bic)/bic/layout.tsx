// app/bic/layout.tsx
"use client";

import { DashboardNav } from "./dashboard-nav";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardBicLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col">
                {/* <DashboardNav /> */}
                <div className="">{children}</div>
            </div>
        </ProtectedRoute>
    );
}
