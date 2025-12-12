'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";
import OrderList from "@/app/components/OrderList";

export default function PedidosPageUsuario() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_USUARIO") {
            router.push("/"); // Manda para home se não for usuario
        }
        fetchPedidos()
    }, [status, session, router]);

    const fetchPedidos = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/pedidos`, {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPedidos(Array.isArray(data) ? data : []);
            } else {
                setPedidos([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const emptyAction = (
        <Link
            href="/usuario/produtos"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-brand-purple hover:bg-opacity-90 transition-all"
        >
            Ir para a Loja
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
        </Link>
    );

    return (
        <div className="flex flex-col min-h-screen font-sans bg-page-bg">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <OrderList
                    pedidos={pedidos}
                    loading={loading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filtroStatus={filtroStatus}
                    setFiltroStatus={setFiltroStatus}
                    title="Minhas Compras"
                    emptyStateAction={emptyAction}
                />
            </main>
        </div>
    );
}