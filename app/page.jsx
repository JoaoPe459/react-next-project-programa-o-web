'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ShoppingCart, Search, Menu } from 'lucide-react';

export default function HomePage() {
    const { data: session, status } = useSession();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Busca produtos da API (Backend Java)
    useEffect(() => {
        if (status === "loading") return;

        async function fetchProdutos() {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                };

                // SE houver sessão e token, adiciona ao cabeçalho
                if (session?.user?.token) {
                    headers['Authorization'] = `Bearer ${session.user.token}`;
                }

                // Tenta buscar do backend enviando o token
                const res = await fetch('http://localhost:8080/api/produtos', {
                    method: 'GET',
                    headers: headers
                });

                if (res.ok) {
                    const data = await res.json();
                    setProdutos(data);
                }

            } finally {
                setLoading(false);
            }
        }

        fetchProdutos();
    }, [session, status]);

    // Formatador de Moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-page-bg">

            {/* HEADER REMOVIDO: Já está no layout.js */}

            {/* Barra de Busca e Categorias (Mantida como sub-header da Home) */}
            <nav className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
                    <div className="flex-grow max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Pesquisar produtos, lojas ou categorias..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all"
                            />
                        </div>
                    </div>

                    <button className="hidden md:flex bg-brand-purple text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition items-center space-x-2 font-medium shadow-sm">
                        <Menu className="w-5 h-5" />
                        <span>Categorias</span>
                    </button>
                </div>
            </nav>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-6 text-sm text-gray-500">
                    <span className="hover:text-brand-purple cursor-pointer">Início</span>
                    <span className="mx-2">/</span>
                    <span className="font-semibold text-gray-800">Destaques</span>
                </div>

                {/* Banner */}
                <div className="bg-brand-purple h-40 md:h-64 rounded-xl shadow-lg mb-10 p-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-600 opacity-90"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
                            WoMart Angolano
                        </h1>
                        <p className="text-purple-100 text-lg sm:text-xl font-medium">
                            Ofertas exclusivas para você!
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-yellow-400 pl-3">
                        Produtos em Destaque
                    </h2>
                </div>

                {/* Grid de Produtos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {loading ? (
                        <p className="col-span-full text-center py-10 text-gray-500">Carregando produtos...</p>
                    ) : (
                        produtos.length > 0 ? (
                            produtos.map((produto) => (
                                <div key={produto.id} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                                    <div className="relative h-48 overflow-hidden bg-gray-50">
                                        <img
                                            src={produto.imagem || "https://placehold.co/400x300?text=Sem+Imagem"}
                                            alt={produto.nome}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=Erro+Img'; }}
                                        />
                                        {produto.novo && (
                                            <span className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                NOVO
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
                                        <div className="mb-1">
                                            <span className="text-[10px] uppercase font-bold text-brand-purple bg-purple-50 px-2 py-0.5 rounded-full">
                                                {produto.categoria || "Geral"}
                                            </span>
                                        </div>

                                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[40px]" title={produto.nome}>
                                            {produto.nome}
                                        </h3>

                                        <div className="mt-auto pt-2">
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatCurrency(produto.precoNovo || produto.preco)}
                                            </p>

                                            <button
                                                className="w-full mt-3 bg-brand-purple text-white py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2 active:scale-95"
                                                onClick={() => alert("Adicionado ao carrinho!")}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span>Adicionar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center py-10 text-gray-500">Nenhum produto em destaque no momento.</p>
                        )
                    )}
                </div>

            </main>

            <footer className="bg-gray-800 text-gray-400 py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">&copy; 2025 WoMart Angolano. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}