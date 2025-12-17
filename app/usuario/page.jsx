'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, User, ShoppingCart, Loader2, LayoutDashboard, Clock, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ totalPedidos: 0, ultimosPedidos: [] });
    const [loading, setLoading] = useState(true);

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_USUARIO") {
            router.push("/"); // Redireciona se não for usuário
        } else {
            fetchData();
        }
    }, [status, session, router]);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/pedidos`, {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                const pedidos = await res.json();
                if (Array.isArray(pedidos)) {
                    // Ordena por ID decrescente (ou data) para pegar os mais recentes
                    const sorted = [...pedidos].sort((a, b) => b.id - a.id);
                    setStats({
                        totalPedidos: pedidos.length,
                        ultimosPedidos: sorted.slice(0, 3) // Pegar os 3 últimos
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    // Formatador de Moeda
    const formatCurrency = (val) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val || 0);

    // Renderização de Carregamento
    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200">
                <Loader2 className="animate-spin w-8 h-8 text-brand-purple dark:text-purple-400"/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-page-bg dark:bg-slate-900 font-sans transition-colors duration-200">
            <main className="container mx-auto px-4 py-8">

                {/* Header de Boas-vindas */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="w-8 h-8 text-brand-purple dark:text-purple-400" />
                        Minha Conta
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Olá, <span className="font-semibold text-brand-purple dark:text-purple-400">{session?.user?.nome || session?.user?.email}</span>! Bem-vindo de volta.
                    </p>
                </div>

                {/* Cards de Atalho e Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                    {/* Card Loja (Ação Principal) */}
                    <Link href="/usuario/produtos" className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 flex items-center justify-between cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1 h-full bg-brand-purple group-hover:w-2 transition-all"></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Fazer Compras</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Ir para a Loja</h3>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full group-hover:bg-brand-purple group-hover:text-white dark:group-hover:bg-purple-600 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-brand-purple dark:text-purple-400 group-hover:text-white" />
                        </div>
                    </Link>

                    {/* Card Total Pedidos (Estatística) */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Histórico</p>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalPedidos} <span className="text-sm font-normal text-gray-400 dark:text-gray-500">pedidos</span></h3>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    {/* Card Carrinho (Atalho) */}
                    <Link href="/usuario/carrinho" className="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-slate-700 flex items-center justify-between cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1 h-full bg-yellow-400 group-hover:w-2 transition-all"></div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">Meu Carrinho</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Ver Itens</h3>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-full group-hover:bg-yellow-400 group-hover:text-white dark:group-hover:bg-yellow-500 transition-colors">
                            <ShoppingCart className="w-6 h-6 text-yellow-600 dark:text-yellow-400 group-hover:text-white" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Seção de Pedidos Recentes */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                Pedidos Recentes
                            </h2>
                            <Link href="/usuario/pedidos" className="text-brand-purple dark:text-purple-400 text-sm font-semibold hover:underline flex items-center group">
                                Ver todos <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"/>
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                            {stats.ultimosPedidos.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {stats.ultimosPedidos.map(pedido => (
                                        <div key={pedido.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded-full hidden sm:block">
                                                    <Package className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-white">Pedido #{pedido.id}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{pedido.dataPedido || pedido.data || "Data indisponível"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                    (pedido.status || '').toUpperCase() === 'ENTREGUE' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                                                        (pedido.status || '').toUpperCase() === 'CANCELADO' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                                                            'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                                                }`}>
                                                    {pedido.status || 'PENDENTE'}
                                                </span>
                                                <p className="font-bold text-gray-800 dark:text-white min-w-[90px] text-right">
                                                    {formatCurrency(pedido.total)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                                    <p className="text-lg font-medium">Você ainda não fez nenhum pedido.</p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Explore nossa loja e encontre os melhores produtos.</p>
                                    <Link href="/usuario/produtos" className="inline-flex items-center px-6 py-3 bg-brand-purple text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition shadow-md hover:shadow-lg dark:shadow-purple-900/20">
                                        Começar a Comprar <ArrowRight className="ml-2 w-4 h-4"/>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumo do Perfil */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            Meus Dados
                        </h2>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors duration-200">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="h-20 w-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-full flex items-center justify-center text-brand-purple dark:text-purple-300 font-bold text-3xl border-4 border-white dark:border-slate-700 shadow-sm mb-3">
                                    {session?.user?.nome?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-lg">{session?.user?.nome}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm break-all">{session?.user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link href="/usuario/perfil" className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-50 hover:bg-white hover:border-brand-purple text-gray-700 hover:text-brand-purple rounded-lg text-sm font-medium transition border border-gray-200 group dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-600 dark:hover:border-purple-400 dark:hover:text-purple-300">
                                    <User className="w-4 h-4 mr-2 text-gray-400 group-hover:text-brand-purple dark:text-gray-400 dark:group-hover:text-purple-300"/>
                                    Gerenciar Perfil
                                </Link>
                                <Link href="/usuario/pedidos" className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-50 hover:bg-white hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-lg text-sm font-medium transition border border-gray-200 group dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-600 dark:hover:border-blue-400 dark:hover:text-blue-300">
                                    <Package className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-300"/>
                                    Meus Pedidos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}