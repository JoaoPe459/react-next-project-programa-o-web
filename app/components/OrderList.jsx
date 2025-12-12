'use client';

import { ShoppingBag, Filter, Search, User, Calendar, DollarSign, Package, ArrowRight } from 'lucide-react';

export default function OrderList({
                                      pedidos,
                                      loading,
                                      searchTerm,
                                      setSearchTerm,
                                      filtroStatus,
                                      setFiltroStatus,
                                      title = "Meus Pedidos",
                                      isFornecedor = false, // Para ajustar textos se necessário
                                      emptyStateAction = null // Componente opcional para mostrar quando vazio (ex: botão ir para loja)
                                  }) {
    const formatCurrency = (val) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'pendente') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (s === 'aprovado') return 'bg-blue-100 text-blue-800 border-blue-200';
        if (s === 'enviado') return 'bg-purple-100 text-purple-800 border-purple-200';
        if (s === 'entregue') return 'bg-green-100 text-green-800 border-green-200';
        if (s === 'cancelado') return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const filtered = pedidos.filter(p => {
        const matchSearch = p.id?.toString().includes(searchTerm) ||
            (p.clienteNome || p.cliente || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = filtroStatus === 'todos' || p.status?.toLowerCase() === filtroStatus;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mb-4"></div>
                <p>Carregando pedidos...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Cabeçalho e Filtros */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-8 h-8 text-brand-purple" />
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                </div>

                {pedidos.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple appearance-none bg-white cursor-pointer"
                            >
                                <option value="todos">Todos Status</option>
                                <option value="pendente">Pendente</option>
                                <option value="aprovado">Aprovado</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregue">Entregue</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                placeholder="Buscar ID ou Cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de Pedidos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {pedidos.length === 0 ? (
                    // Estado Vazio (Sem histórico)
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lista de pedidos vazia</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Não há registros de pedidos no momento.
                        </p>
                        {emptyStateAction}
                    </div>
                ) : filtered.length === 0 ? (
                    // Estado Vazio (Filtro sem resultados)
                    <div className="p-12 text-center text-gray-500">
                        <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-lg font-medium">Nenhum pedido encontrado com esses filtros.</p>
                        <button
                            onClick={() => {setSearchTerm(''); setFiltroStatus('todos');}}
                            className="mt-4 text-brand-purple hover:underline text-sm font-medium"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    // Tabela de Dados
                    <>
                        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-4">Cliente / Detalhes</div>
                            <div className="col-span-3">Data</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filtered.map(pedido => (
                                <div key={pedido.id} className="p-4 hover:bg-gray-50 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                                    {/* ID Mobile/Desktop */}
                                    <div className="w-full md:w-auto md:col-span-1 flex justify-between md:block">
                                        <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Pedido</span>
                                        <span className="font-mono font-bold text-gray-900">#{pedido.id}</span>
                                    </div>

                                    {/* Cliente */}
                                    <div className="w-full md:w-auto md:col-span-4 flex items-center gap-3">
                                        <div className="bg-purple-100 p-2 rounded-full hidden sm:block">
                                            <User className="w-4 h-4 text-brand-purple" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{pedido.clienteNome || pedido.cliente || "Cliente"}</p>
                                            <p className="text-xs text-gray-500">{pedido.itens ? `${pedido.itens.length} itens` : 'Ver detalhes'}</p>
                                        </div>
                                    </div>

                                    {/* Data */}
                                    <div className="w-full md:w-auto md:col-span-3 flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400 md:hidden" />
                                        {pedido.dataPedido || pedido.data || "Data N/A"}
                                    </div>

                                    {/* Status */}
                                    <div className="w-full md:w-auto md:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pedido.status)}`}>
                                            {pedido.status || "Pendente"}
                                        </span>
                                    </div>

                                    {/* Total */}
                                    <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block md:text-right">
                                        <span className="md:hidden text-sm text-gray-600">Total:</span>
                                        <div className="font-bold text-gray-900 flex items-center justify-end gap-1">
                                            <span className="md:hidden"><DollarSign className="w-4 h-4" /></span>
                                            {formatCurrency(pedido.total || 0)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}