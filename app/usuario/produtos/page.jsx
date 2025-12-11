'use client';

import { useState } from 'react';
import Link from 'next/link';
// Se preferires usar a biblioteca de ícones: import { Search, Heart, UserCircle2, LayoutGrid, PackageSearch, LogOut } from 'lucide-react';

export default function GerenciarProdutos() {
    // 1. Estado Inicial (Simulando os dados que estavam no HTML)
    const [produtos, setProdutos] = useState([
        {
            id: 1,
            nome: 'Geladeira Eletrolux Frost Free Duplex 360 Litros',
            precoAntigo: 3000.99,
            precoNovo: 2859.99,
            imagem: 'https://placehold.co/300x300/F0F0F0/CCC?text=Geladeira',
            favorito: false
        },
        {
            id: 2,
            nome: 'Micro-ondas Inox 30L', // Dei um nome mais realista para o "Produto 2"
            precoAntigo: 199.99,
            precoNovo: 149.99,
            imagem: 'https://placehold.co/300x300/F0F0F0/CCC?text=Micro-ondas',
            favorito: false
        },
        // Podes adicionar mais produtos aqui para testar
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // 2. Lógica de Busca (Filtro pelo nome)
    const filteredProdutos = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Lógica de Exclusão
    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            setProdutos((prev) => prev.filter((p) => p.id !== id));
            // Aqui farias a chamada à API para apagar de verdade
        }
    };

    // Lógica extra: Alternar favorito (Coração)
    const toggleFavorite = (id) => {
        setProdutos((prev) => prev.map(p =>
            p.id === id ? { ...p, favorito: !p.favorito } : p
        ));
    };

    // Função utilitária para formatar moeda (Assumindo R$ conforme o HTML original, ou Kz se preferires)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-page-bg">

            {/* --- HEADER --- */}
            <header className="bg-header-bg text-gray-200 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="bg-yellow-400 p-2 rounded-md">
                                <svg className="w-6 h-6 text-header-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">WoMart Angolano</span>
                        </div>

                        {/* Menu Superior */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                {/* Icone User Circle */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div className="text-sm">
                                    <span>Bem-vindo, (Fornecedor)</span>
                                    <div className="font-bold text-white">Paulo Gabriel</div>
                                </div>
                            </div>

                            <Link href="/produtos" className="flex items-center space-x-2 text-white font-semibold border-b-2 border-brand-purple pb-1">
                                {/* Icone Layout Grid */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <span className="text-sm hidden sm:block">Meus Produtos</span>
                            </Link>

                            <Link href="/pedidos" className="flex items-center space-x-2 hover:text-white transition-colors">
                                {/* Icone Package Search */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> {/* Simplificado */}
                                <span className="text-sm hidden sm:block">Pedidos Recebidos</span>
                            </Link>

                            <Link href="/login" className="flex items-center space-x-2 hover:text-white transition-colors">
                                {/* Icone Log Out */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                <span className="text-sm hidden sm:block">Sair</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <nav className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <span className="text-sm text-gray-500">Painel do Fornecedor</span>
                    </div>
                </nav>
            </header>


            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-4 text-sm text-gray-600">
                    <Link href="/" className="hover:text-brand-purple">Início</Link>
                    <span className="mx-1">&gt;</span>
                    <span className="font-semibold text-gray-800">Seus Produtos</span>
                </div>

                {/* Barra de Busca e Botão Adicionar */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">

                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar Produto"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {/* Icone Search */}
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    <Link
                        href="/produtos/novo"
                        className="w-full md:w-auto bg-brand-purple text-white text-center font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200"
                    >
                        Adicionar item
                    </Link>
                </div>

                {/* Grelha de Produtos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                    {filteredProdutos.length > 0 ? (
                        filteredProdutos.map((produto) => (
                            <div key={produto.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
                                <div className="relative h-56">
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/300x300/F0F0F0/CCC?text=Img+Erro'; }}
                                    />
                                    <button
                                        onClick={() => toggleFavorite(produto.id)}
                                        className={`absolute top-3 right-3 p-1.5 rounded-full shadow-md transition-colors 
                      ${produto.favorito ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500 hover:text-red-500'}`}
                                    >
                                        {/* Icone Heart */}
                                        <svg className="w-5 h-5" fill={produto.favorito ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </button>
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-sm font-medium text-gray-700 h-10 mb-2 overflow-hidden" title={produto.nome}>
                                        {produto.nome}
                                    </h3>

                                    <div className="mb-3 mt-auto">
                                        {produto.precoAntigo && (
                                            <span className="text-sm text-gray-400 line-through block">
                        {formatCurrency(produto.precoAntigo)}
                      </span>
                                        )}
                                        <div className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(produto.precoNovo)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start space-x-4 text-sm pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => alert(`Editar produto ${produto.id} (Pendente)`)}
                                            className="text-indigo-600 hover:underline cursor-pointer"
                                        >
                                            (Editar)
                                        </button>
                                        <button
                                            onClick={() => handleDelete(produto.id)}
                                            className="text-red-600 hover:underline cursor-pointer"
                                        >
                                            (Excluir)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">Nenhum produto encontrado para "{searchTerm}"</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}