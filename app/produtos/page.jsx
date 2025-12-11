'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Edit, Package, Search, ShoppingCart } from 'lucide-react';

export default function ProdutosPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const isFornecedor = session?.user?.role === "ROLE_FORNECEDOR";

    useEffect(() => {
        // Se estiver carregando a sessão, aguarda.
        if (status === "loading") return;

        // Busca produtos independentemente de estar logado (Loja Pública)
        fetchProdutos();
    }, [status, session]);

    const fetchProdutos = async () => {
        try {
            const headers = { 'Content-Type': 'application/json' };

            // Adiciona o token apenas se o usuário estiver logado
            if (session?.user?.token) {
                headers['Authorization'] = `Bearer ${session.user.token}`;
            }

            const res = await fetch('http://localhost:8080/api/produtos', {
                headers: headers
            });

            if (res.ok) {
                const data = await res.json();
                setProdutos(data);
            } else {
                // ATUALIZADO: Mostra um aviso informativo em vez de um erro crítico
                console.warn(`⚠️ O servidor respondeu com status: ${res.status} (${res.statusText}). Verifique se a rota é pública no backend.`);
                setProdutos([]);
            }
        } catch (error) {
            // ATUALIZADO: Tratamento específico para falha de conexão (backend desligado)
            console.error("Erro de conexão com a API (O servidor está ligado?):", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!session?.user?.token) return;

        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                const res = await fetch(`http://localhost:8080/api/produtos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${session.user.token}`
                    }
                });

                if (res.ok) {
                    setProdutos((prev) => prev.filter((p) => p.id !== id));
                } else {
                    alert("Erro ao excluir produto.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const addToCart = () => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else {
            alert("Adicionado ao carrinho! (Simulação)");
        }
    };

    const filteredProdutos = produtos.filter((produto) =>
        produto.nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen font-sans bg-page-bg">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-purple focus:border-brand-purple sm:text-sm"
                            placeholder="Buscar por nome do produto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProdutos.length > 0 ? (
                        filteredProdutos.map((produto) => (
                            <div key={produto.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={produto.imagem || 'https://placehold.co/300x300/F0F0F0/CCC?text=Sem+Imagem'}
                                        alt={produto.nome}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Erro+Img'; }}
                                    />
                                    {isFornecedor && (
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-600 shadow-sm">
                                            ID: {produto.id}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <span className="text-xs font-semibold text-brand-purple bg-purple-50 px-2 py-0.5 rounded-full">
                                            {produto.categoria || 'Geral'}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]" title={produto.nome}>
                                        {produto.nome}
                                    </h3>

                                    <div className="mt-auto mb-4">
                                        <div className="text-xl font-bold text-gray-900">
                                            {formatCurrency(produto.preco || produto.precoNovo)}
                                        </div>
                                        {isFornecedor && (
                                            <div className="text-xs text-gray-500">
                                                Estoque: <span className={produto.estoque > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                                    {produto.estoque} un.
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        {isFornecedor ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={`/produtos/${produto.id}/editar`}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Editar
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(produto.id)}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Excluir
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-brand-purple rounded-md hover:bg-opacity-90 transition-colors"
                                                onClick={addToCart}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Adicionar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white rounded-lg border border-dashed border-gray-300">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-lg font-medium">Nenhum produto encontrado.</p>
                            {isFornecedor && (
                                <div className="mt-4">
                                    <Link href="/produtos/novo" className="inline-flex items-center px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-opacity-90 transition-colors">
                                        Cadastrar Produto
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}