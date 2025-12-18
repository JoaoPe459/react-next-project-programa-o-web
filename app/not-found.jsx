'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200 px-4 text-center font-sans">

            {/* Ícone Animado */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-full mb-6">
                <FileQuestion className="w-20 h-20 text-brand-purple dark:text-purple-400" />
            </div>

            {/* Título e Descrição */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
                404
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Página não encontrada
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                Ops! A página que você está a procurar não existe, foi removida ou o link está incorreto.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                </button>

                <Link
                    href="/"
                    className="px-6 py-3 rounded-lg bg-brand-purple text-white font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    Ir para o Início
                </Link>
            </div>
        </div>
    );
}