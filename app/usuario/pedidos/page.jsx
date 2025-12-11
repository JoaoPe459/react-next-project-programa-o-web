'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importante para o botão "Ir para a loja"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ShoppingBag, Filter, Calendar, DollarSign, User, ArrowRight } from 'lucide-react';
import {API_BASE_URL} from "@/app/utils/api-config";

export default function PedidosPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }

        if (status === "authenticated" && session?.user?.token) {
            fetchPedidos();
        }
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
                setPedidos([])
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'aprovado': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'enviado': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'entregue': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredPedidos = pedidos.filter((pedido) => {
        const matchSearch =
            pedido.id?.toString().includes(searchTerm) ||
            (pedido.clienteNome || pedido.cliente || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = filtroStatus === 'todos' || pedido.status?.toLowerCase() === filtroStatus;

        return matchSearch && matchStatus;
    });

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen font-sans bg-page-bg">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Título e Controles */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center space-x-3">
                        <ShoppingBag className="w-8 h-8 text-brand-purple" />
                        <h1 className="text-2xl font-bold text-gray-800">Meus Pedidos</h1>
                    </div>

                    {/* Só mostra os filtros se houver pedidos na conta */}
                    {pedidos.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                    className="block w-full md:w-40 pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple sm:text-sm appearance-none bg-white cursor-pointer"
                                >
                                    <option value="todos">Todos Status</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="aprovado">Aprovado</option>
                                    <option value="enviado">Enviado</option>
                                    <option value="entregue">Entregue</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>

                            <div className="relative w-full md:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple sm:text-sm"
                                    placeholder="Buscar por ID ou Cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={pedidos.length === 0}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Lógica de Exibição da Lista */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                    {/* CASO 1: Usuário não tem nenhum pedido (Histórico vazio) */}
                    {pedidos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="bg-gray-50 p-6 rounded-full mb-4">
                                <ShoppingBag className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Você ainda não tem pedidos</h3>
                            <p className="text-gray-500 max-w-sm mb-8">
                                Parece que você ainda não fez nenhuma compra. Que tal explorar nossos produtos?
                            </p>
                            <Link
                                href="/produtos"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-brand-purple hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple"
                            >
                                Ir para a Loja
                                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        /* CASO 2: Usuário tem pedidos, verificamos o filtro */
                        <>
                            {/* Cabeçalho da Tabela */}
                            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-1">ID</div>
                                <div className="col-span-4">Cliente / Detalhes</div>
                                <div className="col-span-3">Data</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {filteredPedidos.length > 0 ? (
                                    filteredPedidos.map((pedido) => (
                                        <div key={pedido.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                                            {/* ... (O conteúdo do card/linha permanece o mesmo do original) ... */}
                                            <div className="w-full md:w-auto md:col-span-1 flex justify-between md:block">
                                                <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Pedido</span>
                                                <span className="font-mono font-bold text-gray-900">#{pedido.id}</span>
                                            </div>

                                            <div className="w-full md:w-auto md:col-span-4 flex items-center gap-3">
                                                <div className="bg-purple-100 p-2 rounded-full hidden sm:block">
                                                    <User className="w-4 h-4 text-brand-purple" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{pedido.clienteNome || pedido.cliente || "Cliente"}</p>
                                                    <p className="text-xs text-gray-500">{pedido.itens ? `${pedido.itens.length} itens` : 'Ver detalhes'}</p>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto md:col-span-3 flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400 md:hidden" />
                                                {pedido.dataPedido || pedido.data || "Data N/A"}
                                            </div>

                                            <div className="w-full md:w-auto md:col-span-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pedido.status)}`}>
                                                    {pedido.status || "Pendente"}
                                                </span>
                                            </div>

                                            <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block md:text-right">
                                                <span className="md:hidden text-sm text-gray-600">Total:</span>
                                                <div className="font-bold text-gray-900 flex items-center justify-end gap-1">
                                                    <span className="md:hidden"><DollarSign className="w-4 h-4" /></span>
                                                    {formatCurrency(pedido.total || 0)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* CASO 3: Busca/Filtro não encontrou nada (mas o usuário tem pedidos) */
                                    <div className="p-12 text-center text-gray-500">
                                        <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-lg font-medium">Nenhum pedido encontrado com esses filtros.</p>
                                        <p className="text-sm">Tente buscar por outro termo ou limpar os filtros.</p>
                                        <button
                                            onClick={() => {setSearchTerm(''); setFiltroStatus('todos');}}
                                            className="mt-4 text-brand-purple hover:underline text-sm font-medium"
                                        >
                                            Limpar filtros
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}