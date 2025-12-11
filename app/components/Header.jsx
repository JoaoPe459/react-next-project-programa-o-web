'use client';

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    UserCircle2,
    Package,
    ShoppingCart,
    LogOut,
    LayoutDashboard,
    PlusCircle,
    Store,
    Menu,
    X,
    LogIn
} from 'lucide-react';

export default function Header() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const userRole = session?.user?.role;
    // Pega o primeiro nome para não ficar muito longo no header
    const userName = session?.user?.nome?.split(' ')[0] || session?.user?.email?.split('@')[0] || "Visitante";

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    // Helper para verificar link ativo
    const isActive = (path) => pathname === path;

    // Definição dos links para facilitar a renderização (DRY)
    const renderNavLinks = (mobile = false) => {
        const baseClass = mobile
            ? "flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-200"
            : "flex items-center space-x-1.5 hover:text-brand-purple transition-colors text-sm font-medium text-gray-300 hover:text-white";

        const activeClass = mobile
            ? "bg-brand-purple/20 text-brand-purple font-semibold"
            : "text-white font-semibold";

        // Links de Fornecedor
        if (isAuthenticated && userRole === 'ROLE_FORNECEDOR') {
            return (
                <>
                    <Link href="/fornecedor" className={`${baseClass} ${isActive('/fornecedor') ? activeClass : ''}`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Painel</span>
                    </Link>
                    <Link href="/produtos" className={`${baseClass} ${isActive('/produtos') ? activeClass : ''}`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                        <Store className="w-5 h-5" />
                        <span>Meus Produtos</span>
                    </Link>
                    <Link href="/produtos/novo" className={`${baseClass} text-green-400 hover:text-green-300`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                        <PlusCircle className="w-5 h-5" />
                        <span>Novo Produto</span>
                    </Link>
                </>
            );
        }

        // Links de Usuário Comum
        if (isAuthenticated && userRole === 'ROLE_USUARIO') {
            return (
                <>
                    <Link href="/produtos" className={`${baseClass} ${isActive('/produtos') ? activeClass : ''}`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                        <Store className="w-5 h-5" />
                        <span>Loja</span>
                    </Link>
                    <Link href="/pedidos" className={`${baseClass} ${isActive('/pedidos') ? activeClass : ''}`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                        <Package className="w-5 h-5" />
                        <span>Meus Pedidos</span>
                    </Link>
                    <Link href="/carrinho" className={`${baseClass} ${isActive('/carrinho') ? activeClass : ''}`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Carrinho</span>
                    </Link>
                </>
            );
        }

        // Visitante (Não logado)
        return (
            <Link href="/produtos" className={`${baseClass} ${isActive('/produtos') ? activeClass : ''}`} onClick={() => mobile && setIsMobileMenuOpen(false)}>
                <Store className="w-5 h-5" />
                <span>Explorar Loja</span>
            </Link>
        );
    };

    return (
        <header className="bg-header-bg border-b border-white/5 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* --- LOGO --- */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-amber-400 p-2.5 rounded-lg shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-6 h-6 text-header-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white leading-tight tracking-tight">WoMart</span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Angola</span>
                        </div>
                    </Link>

                    {/* --- MENU DESKTOP (Central) --- */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {!isLoading && renderNavLinks(false)}
                    </nav>

                    {/* --- ÁREA DO USUÁRIO (Direita) --- */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isLoading ? (
                            <div className="h-8 w-8 bg-white/10 animate-pulse rounded-full"></div>
                        ) : isAuthenticated ? (
                            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                                <div className="flex flex-col items-end mr-1">
                                    <span className="text-xs text-brand-purple font-bold uppercase tracking-wider">
                                        {userRole === 'ROLE_FORNECEDOR' ? 'Fornecedor' : 'Cliente'}
                                    </span>
                                    <span className="text-sm font-medium text-white">Olá, {userName}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-all"
                                    title="Sair da conta"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-brand-purple rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20"
                                >
                                    Criar Conta
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- BOTÃO MOBILE --- */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MENU MOBILE (Dropdown) --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-header-bg border-t border-white/10 px-4 pt-2 pb-6 shadow-2xl absolute w-full left-0 animate-in slide-in-from-top-5 fade-in duration-200">

                    {/* Info do Usuário Mobile */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-3 p-4 mb-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="bg-brand-purple/20 p-2 rounded-full">
                                <UserCircle2 className="w-6 h-6 text-brand-purple" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">{userName}</p>
                                <p className="text-xs text-gray-400">{session?.user?.email}</p>
                            </div>
                        </div>
                    )}

                    <nav className="flex flex-col space-y-2">
                        {renderNavLinks(true)}
                    </nav>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sair da Conta</span>
                            </button>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center px-4 py-3 text-gray-200 bg-white/5 hover:bg-white/10 rounded-lg font-medium"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center px-4 py-3 text-white bg-brand-purple hover:bg-purple-700 rounded-lg font-medium"
                                >
                                    Cadastrar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}