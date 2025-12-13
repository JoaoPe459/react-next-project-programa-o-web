'use client';

import { ShoppingBag, Filter, Search, User, Calendar, DollarSign, Package } from 'lucide-react';

export default function OrderList({
                                      pedidos,
                                      loading,
                                      searchTerm,
                                      setSearchTerm,
                                      filtroStatus,
                                      setFiltroStatus,
                                      title = "Meus Pedidos",
                                      isFornecedor = false,
                                      emptyStateAction = null
                                  }) {
    const formatCurrency = (val) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

    const getStatusColor = (status) => {
        const s = status?.toString().toLowerCase(); // Garante string
        if (s === 'pendente' || s === 'processando') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (s === 'aprovado' || s === 'concluido') return 'bg-blue-100 text-blue-800 border-blue-200'; // Ajuste conforme seu Enum
        if (s === 'enviado') return 'bg-purple-100 text-purple-800 border-purple-200';
        if (s === 'entregue') return 'bg-green-100 text-green-800 border-green-200';
        if (s === 'cancelado') return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // 1. Função de Normalização: Padroniza os dados independente da origem
    const normalizeData = (p) => {
        if (isFornecedor) {
            // Estrutura do VendaFornecedorDTO
            return {
                id: p.pedidoId,
                mainInfo: p.nomeProduto, // Para fornecedor, o Produto é o destaque
                subInfo: `Qtd: ${p.quantidade} | Cliente: ${p.clienteNome || 'N/A'}`,
                data: p.dataVenda,
                status: p.status, // Precisa vir do backend
                total: p.subtotal // O fornecedor vê o quanto ELE faturou, não o total do pedido
            };
        } else {
            // Estrutura do PedidoResponseDTO (Cliente/Admin)
            return {
                id: p.id,
                mainInfo: p.clienteNome || p.cliente || "Cliente", // Cliente é o destaque
                subInfo: p.itens ? `${p.itens.length} itens` : 'Ver detalhes',
                data: p.dataPedido || p.data,
                status: p.status,
                total: p.total
            };
        }
    };

    const filtered = pedidos.filter(pRaw => {
        const p = normalizeData(pRaw); // Normaliza antes de filtrar

        const term = searchTerm.toLowerCase();

        // Busca inteligente baseada no tipo de usuário
        const matchSearch = p.id?.toString().includes(term) ||
            (p.mainInfo || '').toLowerCase().includes(term) ||
            (isFornecedor && (p.subInfo || '').toLowerCase().includes(term)); // Fornecedor pode buscar por cliente na subInfo

        const matchStatus = filtroStatus === 'todos' || p.status?.toString().toLowerCase() === filtroStatus;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mb-4"></div>
                <p>Carregando registros...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Cabeçalho e Filtros (Inalterado, apenas textos genéricos) */}
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                <div className="flex items-center space-x-3">
                    {isFornecedor ? <Package className="w-8 h-8 text-brand-purple" /> : <ShoppingBag className="w-8 h-8 text-brand-purple" />}
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
                                <option value="processando">Processando</option> {/* Ajustado para seu Enum */}
                                <option value="concluido">Concluído</option>
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
                                placeholder={isFornecedor ? "Buscar ID, Produto ou Cliente..." : "Buscar ID ou Cliente..."}
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
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lista vazia</h3>
                        <p className="text-gray-500 max-w-sm mb-6">
                            Não há registros no momento.
                        </p>
                        {emptyStateAction}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-lg font-medium">Nenhum resultado encontrado.</p>
                        <button
                            onClick={() => {setSearchTerm(''); setFiltroStatus('todos');}}
                            className="mt-4 text-brand-purple hover:underline text-sm font-medium"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header da Tabela */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-1">ID</div>
                            {/* Muda o título da coluna dinamicamente */}
                            <div className="col-span-4">{isFornecedor ? "Produto / Cliente" : "Cliente / Detalhes"}</div>
                            <div className="col-span-3">Data</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2 text-right">{isFornecedor ? "Faturamento" : "Total"}</div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {filtered.map((pRaw, index) => {
                                // Normaliza os dados dentro do map para exibição
                                const item = normalizeData(pRaw);

                                return (
                                    <div key={`${item.id}-${index}`} className="p-4 hover:bg-gray-50 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center">

                                        {/* ID */}
                                        <div className="w-full md:w-auto md:col-span-1 flex justify-between md:block">
                                            <span className="md:hidden text-xs font-bold text-gray-500 uppercase">Pedido</span>
                                            <span className="font-mono font-bold text-gray-900">#{item.id}</span>
                                        </div>

                                        {/* Info Principal (Produto ou Cliente) */}
                                        <div className="w-full md:w-auto md:col-span-4 flex items-center gap-3">
                                            <div className="bg-purple-100 p-2 rounded-full hidden sm:block">
                                                {isFornecedor ? <Package className="w-4 h-4 text-brand-purple" /> : <User className="w-4 h-4 text-brand-purple" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.mainInfo}</p>
                                                <p className="text-xs text-gray-500">{item.subInfo}</p>
                                            </div>
                                        </div>

                                        {/* Data */}
                                        <div className="w-full md:w-auto md:col-span-3 flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400 md:hidden" />
                                            {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : "Data N/A"}
                                        </div>

                                        {/* Status */}
                                        <div className="w-full md:w-auto md:col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                            {item.status || "Pendente"}
                                        </span>
                                        </div>

                                        {/* Total / Faturamento */}
                                        <div className="w-full md:w-auto md:col-span-2 flex justify-between md:block md:text-right">
                                            <span className="md:hidden text-sm text-gray-600">Valor:</span>
                                            <div className="font-bold text-gray-900 flex items-center justify-end gap-1">
                                                <span className="md:hidden"><DollarSign className="w-4 h-4" /></span>
                                                {formatCurrency(item.total || 0)}
                                            </div>
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