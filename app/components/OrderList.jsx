'use client';

import { ShoppingBag, Filter, Search, User, Calendar, DollarSign, Package, XCircle, Ban } from 'lucide-react';

export default function OrderList({
                                      pedidos,
                                      loading,
                                      searchTerm,
                                      setSearchTerm,
                                      filtroStatus,
                                      setFiltroStatus,
                                      title = "Meus Pedidos",
                                      isFornecedor = false,
                                      emptyStateAction = null,
                                      onCancel
                                  }) {
    const formatCurrency = (val) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

    const getStatusColor = (status) => {
        const s = status?.toString().toLowerCase();
        if (s === 'pendente' || s === 'processando')
            return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50';

        if (s === 'aprovado' || s === 'concluido')
            return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';

        if (s === 'enviado')
            return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';

        if (s === 'entregue')
            return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';

        if (s === 'cancelado')
            return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';

        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600';
    };

    const canCancel = (status) => {
        const s = status?.toString().toUpperCase();
        return s === 'PENDENTE' || s === 'PROCESSANDO';
    };

    const normalizeData = (p) => {
        if (isFornecedor) {
            return {
                id: p.pedidoId || p.id,
                mainInfo: p.nomeProduto || "Vários Itens",
                subInfo: `Qtd: ${p.quantidade || '-'} | Cliente: ${p.clienteNome || 'N/A'}`,
                data: p.dataVenda || p.dataPedido,
                status: p.status,
                total: p.subtotal || p.total
            };
        } else {
            return {
                id: p.id,
                mainInfo: p.clienteNome || p.cliente || "WartMart Shop",
                subInfo: p.itens ? `${p.itens.length} itens` : 'Ver detalhes',
                data: p.dataPedido || p.data,
                status: p.status,
                total: p.total
            };
        }
    };

    const filtered = pedidos.filter(pRaw => {
        const p = normalizeData(pRaw);
        const term = searchTerm.toLowerCase();
        const matchSearch = p.id?.toString().includes(term) ||
            (p.mainInfo || '').toLowerCase().includes(term) ||
            (isFornecedor && (p.subInfo || '').toLowerCase().includes(term));
        const matchStatus = filtroStatus === 'todos' || p.status?.toString().toLowerCase() === filtroStatus;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mb-4"></div>
                <p>Carregando registros...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Cabeçalho e Filtros */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    {isFornecedor ?
                        <Package className="w-8 h-8 text-brand-purple dark:text-purple-400" /> :
                        <ShoppingBag className="w-8 h-8 text-brand-purple dark:text-purple-400" />
                    }
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">{title}</h1>
                </div>

                {pedidos.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                            </div>
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple appearance-none bg-white cursor-pointer dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100 dark:focus:ring-purple-500"
                            >
                                <option value="todos">Todos Status</option>
                                <option value="pendente">Pendente</option>
                                <option value="processando">Processando</option>
                                <option value="concluido">Concluído</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-purple dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100 dark:placeholder-slate-500 dark:focus:ring-purple-500"
                                placeholder={isFornecedor ? "Buscar ID, Produto ou Cliente..." : "Buscar ID..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de Pedidos */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
                {pedidos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-full mb-4">
                            <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lista vazia</h3>
                        <p className="text-gray-500 dark:text-slate-400 max-w-sm mb-6">
                            Não há registros no momento.
                        </p>
                        {emptyStateAction}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-slate-400">
                        <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-700 mb-3" />
                        <p className="text-lg font-medium">Nenhum resultado encontrado.</p>
                        <button
                            onClick={() => {setSearchTerm(''); setFiltroStatus('todos');}}
                            className="mt-4 text-brand-purple dark:text-purple-400 hover:underline text-sm font-medium"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header da Tabela */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-slate-900/40 border-b border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">{isFornecedor ? "Produto / Cliente" : "Loja / Detalhes"}</div>
                            <div className="col-span-2">Data</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">{isFornecedor ? "Faturamento" : "Total"}</div>
                            <div className="col-span-2 text-center">Ações</div>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filtered.map((pRaw, index) => {
                                const item = normalizeData(pRaw);
                                const isCancellable = canCancel(item.status);

                                return (
                                    <div key={`${item.id}-${index}`} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                                        {/* ID */}
                                        <div className="w-full md:w-auto md:col-span-1 flex justify-between md:block">
                                            <span className="md:hidden text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Pedido</span>
                                            <span className="font-mono font-bold text-gray-900 dark:text-slate-100">#{item.id}</span>
                                        </div>

                                        {/* Info Principal */}
                                        <div className="w-full md:w-auto md:col-span-3 flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-full hidden sm:block">
                                                {isFornecedor ?
                                                    <Package className="w-4 h-4 text-brand-purple dark:text-purple-400" /> :
                                                    <User className="w-4 h-4 text-brand-purple dark:text-purple-400" />
                                                }
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-medium text-gray-900 dark:text-slate-100 truncate" title={item.mainInfo}>{item.mainInfo}</p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400 truncate" title={item.subInfo}>{item.subInfo}</p>
                                            </div>
                                        </div>

                                        {/* Data */}
                                        <div className="w-full md:w-auto md:col-span-2 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                            <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-500 md:hidden" />
                                            {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : "N/A"}
                                        </div>

                                        {/* Status */}
                                        <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block">
                                            <span className="md:hidden text-sm text-gray-500 dark:text-slate-400">Status:</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(item.status)}`}>
                                                {item.status || "Pendente"}
                                            </span>
                                        </div>

                                        {/* Total */}
                                        <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block md:text-right">
                                            <span className="md:hidden text-sm text-gray-500 dark:text-slate-400">Valor:</span>
                                            <div className="font-bold text-gray-900 dark:text-white flex items-center justify-end gap-1">
                                                <span className="md:hidden"><DollarSign className="w-4 h-4 text-slate-400" /></span>
                                                {formatCurrency(item.total || 0)}
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        <div className="w-full md:w-auto md:col-span-2 flex justify-center mt-2 md:mt-0">
                                            {onCancel && isCancellable ? (
                                                <button
                                                    onClick={() => onCancel(item.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-all w-full md:w-auto justify-center dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/50"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Cancelar
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 dark:text-slate-500 italic flex items-center gap-1">
                                                     {item.status === 'CANCELADO' ? <Ban className="w-3 h-3 text-red-400/50"/> : ''}
                                                    {item.status === 'CANCELADO' ? 'Cancelado' : '-'}
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                )})}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}