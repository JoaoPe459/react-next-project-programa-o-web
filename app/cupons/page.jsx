'use client';

import { useState } from 'react';
import Link from 'next/link';
// Se tiveres a biblioteca lucide-react instalada, podes descomentar os imports abaixo.
// Caso contrário, usei SVGs inline para garantir que o código funciona imediatamente.
// import { Search, ShieldCheck, Users, Ticket, LogOut, Edit, Trash2 } from 'lucide-react';

export default function GerenciarCupons() {
    // 1. Estado Inicial (Simulando a base de dados que estava no HTML)
    const [cupons, setCupons] = useState([
        { id: 1, codigo: 'NATAL15', tipo: 'PERCENTAGEM', valor: '15%', validade: '25/12/2025', status: 'ATIVO' },
        { id: 2, codigo: 'BEMVINDO', tipo: 'FIXO', valor: 'Kz 500,00', validade: '01/01/2026', status: 'ATIVO' }, // Ajustei a moeda para Kz conforme o contexto "Angolano"
        { id: 3, codigo: 'BLACKFRIDAY', tipo: 'PERCENTAGEM', valor: '50%', validade: '29/11/2024', status: 'INATIVO' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // 2. Lógica de Busca (Filtragem)
    const filteredCupons = cupons.filter((cupom) =>
        cupom.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cupom.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cupom.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Lógica de Exclusão
    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este cupom?')) {
            setCupons((prevCupons) => prevCupons.filter((c) => c.id !== id));
            // Em uma aplicação real, aqui você faria uma chamada à API (ex: DELETE /api/cupons/1)
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-page-bg">

            {/* --- HEADER ---
          Nota: Em Next.js, idealmente este Header estaria no arquivo layout.js
          para ser compartilhado entre páginas. Mantive aqui para ser fiel ao HTML fornecido.
      */}
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
                            <span className="text-xl font-bold text-white">WoMart (Admin)</span>
                        </div>

                        {/* Menu Superior */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                {/* Icone Shield Check */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                <div className="text-sm">
                                    <span>Admin,</span>
                                    <div className="font-bold text-white">Administrador</div>
                                </div>
                            </div>

                            <Link href="/usuarios" className="flex items-center space-x-2 hover:text-white transition-colors">
                                {/* Icone Users */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                <span className="text-sm hidden sm:block">Usuários</span>
                            </Link>

                            <Link href="/cupons" className="flex items-center space-x-2 text-white font-semibold border-b-2 border-brand-purple pb-1">
                                {/* Icone Ticket */}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                                <span className="text-sm hidden sm:block">Cupons</span>
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
                        <span className="text-sm text-gray-500">Painel Administrativo</span>
                    </div>
                </nav>
            </header>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-4 text-sm text-gray-600">
                    <span>Início</span>
                    <span className="mx-1">&gt;</span>
                    <span className="font-semibold text-gray-800">Gerenciar Cupons</span>
                </div>

                {/* Barra de Busca e Botão Adicionar */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">

                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar Cupom (ex: DESCONTO10)"
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
                        href="/cupons/novo"
                        className="w-full md:w-auto bg-brand-purple text-white text-center font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200"
                    >
                        Adicionar Cupom
                    </Link>
                </div>

                {/* Tabela de Cupons */}
                <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Validade</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredCupons.length > 0 ? (
                            filteredCupons.map((cupom) => (
                                <tr key={cupom.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {cupom.codigo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cupom.tipo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cupom.valor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {cupom.validade}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full 
                          ${cupom.status === 'ATIVO'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'}`
                          }
                      >
                        {cupom.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                                        <button className="text-indigo-600 hover:underline">Editar</button>
                                        <button
                                            onClick={() => handleDelete(cupom.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Nenhum cupom encontrado para "{searchTerm}"
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}