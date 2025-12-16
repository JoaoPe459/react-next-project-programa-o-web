'use client';

import { useSession } from "next-auth/react";
import Link from 'next/link';
import {Ticket, LayoutDashboard, Users, TrendingUp, Loader2} from 'lucide-react';
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function AdminDashboard() {
    const { data: session, status } = useSession();

    const router = useRouter();
    const [stats, setStats] = useState({ produtos: 0, pedidos: 0 });

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_ADMIN") {
            router.push("/"); // Manda para home se não for admin
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg">
                <Loader2 className="animate-spin w-8 h-8 text-brand-purple"/>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-page-bg font-sans p-8 container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <LayoutDashboard className="w-8 h-8 text-brand-purple" />
                Painel Administrativo
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card Cupons */}
                <Link href="/admin/cupons" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex items-center justify-between group cursor-pointer">
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase">Promoções</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">Gerenciar Cupons</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-full group-hover:bg-brand-purple group-hover:text-white transition">
                        <Ticket className="w-8 h-8 text-brand-purple group-hover:text-white" />
                    </div>
                </Link>

                {/* Card Usuários - ATUALIZADO */}
                <Link href="/admin/usuarios" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex items-center justify-between group cursor-pointer">
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase">Usuários</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">Gerenciar Contas</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">
                        <Users className="w-8 h-8 text-blue-600 group-hover:text-white" />
                    </div>
                </Link>

                {/* Card Vendas (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between opacity-70">
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase">Sistema</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">Relatórios</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-full">
                        <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}