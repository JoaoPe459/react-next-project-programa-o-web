'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, PlusCircle, TrendingUp, Loader2, LayoutDashboard } from 'lucide-react';

export default function FornecedorDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ produtos: 0, pedidos: 0 });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        // Verifica se é fornecedor
        if (status === "authenticated") {
            if (session?.user?.role !== "ROLE_FORNECEDOR") {
                router.push("/"); // Expulsa se não for fornecedor
            } else {
                // Simulação de busca de estatísticas (Substitua por fetch real quando tiver o endpoint)
                setStats({ produtos: 12, pedidos: 5 });
            }
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg">
                <Loader2 className="animate-spin w-8 h-8 text-brand-purple"/>
            </div>
        );
    }

    // Se não houver sessão (ou estiver redirecionando), retorna null para evitar flash de conteúdo
    if (!session) return null;

    return (
        <div className="min-h-screen bg-page-bg font-sans">

            {/* Header removido (está no layout.js) */}

            <main className="container mx-auto px-4 py-8">

                {/* Cabeçalho da Página (Substituto do Header antigo) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <LayoutDashboard className="w-8 h-8 text-brand-purple" />
                            Painel do Fornecedor
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Bem-vindo de volta, <span className="font-semibold">{session?.user?.nome || session?.user?.email}</span>
                        </p>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-brand-purple pl-3">
                    Visão Geral
                </h2>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card Produtos */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-2 h-full bg-brand-purple"></div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Meus Produtos</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.produtos}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-full group-hover:bg-purple-100 transition-colors">
                            <Package className="w-8 h-8 text-brand-purple" />
                        </div>
                    </div>

                    {/* Card Pedidos */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pedidos Recebidos</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pedidos}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-full group-hover:bg-yellow-100 transition-colors">
                            <ShoppingCart className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    {/* Card Rendimento (Mock) */}
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Vendas (Mês)</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">Kz 0,00</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-full group-hover:bg-green-100 transition-colors">
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Ações Rápidas */}
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-3">
                    Gerenciamento Rápido
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/produtos/novo" className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center cursor-pointer">
                        <div className="bg-purple-100 p-4 rounded-full group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                            <PlusCircle className="w-8 h-8 text-brand-purple group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">Cadastrar Novo Produto</span>
                        <span className="text-xs text-gray-400">Adicione itens ao seu catálogo</span>
                    </Link>

                    <Link href="/produtos" className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center cursor-pointer">
                        <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Package className="w-8 h-8 text-blue-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">Gerenciar Catálogo</span>
                        <span className="text-xs text-gray-400">Edite ou remova seus produtos</span>
                    </Link>

                    <Link href="/pedidos" className="group bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col items-center justify-center gap-3 text-center cursor-pointer">
                        <div className="bg-yellow-100 p-4 rounded-full group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                            <ShoppingCart className="w-8 h-8 text-yellow-600 group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">Ver Pedidos</span>
                        <span className="text-xs text-gray-400">Acompanhe suas vendas</span>
                    </Link>
                </div>
            </main>
        </div>
    );
}