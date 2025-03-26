"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderHome from "@/components/Layout/HeaderHome";
import AsideHome from "@/components/Layout/AsideHome";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <ProtectedRoute>
            <HeaderHome />
            {/* <AsideHome /> */}
            <main className="w-full">{children}</main>
        </ProtectedRoute>
    );
}
