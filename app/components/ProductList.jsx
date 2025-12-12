'use client';

import Link from 'next/link';
import { Search, Package, Edit, Trash2, ShoppingCart } from 'lucide-react';

export default function ProductList({
                                        produtos,
                                        loading,
                                        isFornecedor,
                                        onDelete,
                                        onAddToCart,
                                        searchTerm,
                                        setSearchTerm
                                    }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
    };

    const filteredProdutos = produtos.filter((produto) =>
        produto.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Carregando produtos...</div>;
    }

    return (
        <div>
            {/* Barra de Busca */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {isFornecedor ? "Gerenciar Catálogo" : "Produtos Disponíveis"}
                </h1>
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-purple focus:border-brand-purple"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProdutos.length > 0 ? (
                    filteredProdutos.map((produto) => (
                        <div key={produto.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all flex flex-col group overflow-hidden">
                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={produto.imagem || 'https://placehold.co/300x300/F0F0F0/CCC?text=Sem+Imagem'}
                                    alt={produto.nome}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Erro'; }}
                                />
                                {isFornecedor && (
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold shadow-sm">
                                        ID: {produto.id}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col flex-grow">
                                <span className="text-xs font-semibold text-brand-purple bg-purple-50 px-2 py-0.5 rounded-full w-fit mb-2">
                                    {produto.categoria || 'Geral'}
                                </span>
                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2" title={produto.nome}>
                                    {produto.nome}
                                </h3>
                                <div className="mt-auto mb-4">
                                    <div className="text-xl font-bold text-gray-900">
                                        {formatCurrency(produto.preco || produto.precoNovo)}
                                    </div>
                                    {isFornecedor && (
                                        <div className="text-xs text-gray-500">
                                            Estoque: <span className={produto.estoque > 0 ? "text-green-600" : "text-red-600"}>{produto.estoque} un.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    {isFornecedor ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link href={`/fornecedor/produtos/${produto.id}/editar`} className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                                                <Edit className="w-4 h-4" /> Editar
                                            </Link>
                                            <button onClick={() => onDelete(produto.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">
                                                <Trash2 className="w-4 h-4" /> Excluir
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => onAddToCart(produto)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-brand-purple rounded-md hover:bg-opacity-90">
                                            <ShoppingCart className="w-4 h-4" /> Adicionar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center border border-dashed rounded-lg">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Nenhum produto encontrado.</p>
                        {isFornecedor && (
                            <Link href="/fornecedor/produtos/novo" className="mt-4 inline-block px-4 py-2 bg-brand-purple text-white rounded-md">
                                Cadastrar Produto
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}