"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderDashboard from "@/components/Layout/HeaderDashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Users } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <ProtectedRoute>
            <HeaderDashboard />
            {/* <aside className="bg-[#E2E4EE] md:h-screen h-16 w-full md:w-32 lg:w-44 xl:w-64 fixed md:top-20 left-0 bottom-0 z-10  md:block border-t border-white/20 drop-shadow-2xl md:drop-shadow-none pointer-events-auto">
                <div className="h-full w-full md:pt-8 md:pb-32">
                    <div className="h-full w-full p-4 flex md:flex-col items-center md:justify-between justify-around border-r border-slate-400/40">
                        <Link
                            href="/dashboard/apps"
                            className={`w-10 h-10 md:w-40 md:h-40 flex flex-col items-center justify-center rounded-2xl cursor-pointer
                            ${pathname === "/dashboard/apps" ? "bg-white/0" : "bg-white/0"}`}
                        >
                            <LayoutGrid
                                size={70}
                                className={`md:w-10 lg:w-12 xl:w-32 transition-opacity duration-300 ${pathname === "/dashboard/apps" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}
                            />
                            <p className={`transition-opacity duration-300 text-xs sm:text-xs md:text-base lg:text-lg lg:-mt-1 md:-mt-3 xl:text-xl font-semibold ${pathname === "/dashboard/apps" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}>Apps</p>
                        </Link>
                        <Link
                            href="/dashboard/users"
                            className={`w-10 h-10 md:w-40 md:h-40 flex flex-col items-center justify-center rounded-2xl cursor-pointer
                            ${pathname === "/dashboard/users" ? "bg-white/0" : "bg-white/0"}`}
                        >
                            <Users
                                size={70}
                                className={`md:w-10 lg:w-12 xl:w-32 transition-opacity duration-300 ${pathname === "/dashboard/users" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}
                            />
                            <p className={`transition-opacity duration-300 text-xs sm:text-xs md:text-base lg:text-lg lg:-mt-1 md:-mt-3 xl:text-xl font-semibold ${pathname === "/dashboard/users" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"}`}>Users</p>
                        </Link>
                        <Link
                            href="/dashboard/design"
                            className={`w-12 h-12 md:w-40 md:h-40 flex flex-col items-center justify-center rounded-2xl
                            ${pathname === "/dashboard/design" ? "bg-white/0" : "bg-white/0"}`}
                        >
                            <Palette
                                size={70}
                                className={`md:w-10 lg:w-12 xl:w-32 transition-opacity duration-300 ${pathname === "/dashboard/design" ? "opacity-100 text-primary10" : "opacity-20 text-slate-700"
                                    }`}
                            />
                            <p className={`transition-opacity duration-300 text-xs sm:text-xs md:text-base lg:text-lg lg:-mt-1 md:-mt-3 xl:text-xl font-semibold ${pathname === "/dashboard/design" ? "opacity-100 text-primary10" : "opacity-20 text-slate-800"}`}>Design</p>

                        </Link>
                    </div>
                </div>
            </aside> */}
            <main className="w-full">{children}</main>
        </ProtectedRoute>
    );
}
