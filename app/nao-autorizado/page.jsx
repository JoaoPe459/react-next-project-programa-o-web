'use client';

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function NaoAutorizadoPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="bg-red-100 p-4 rounded-full mb-6">
                <ShieldAlert className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso Negado</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                Você não tem permissão para acessar esta área. Verifique suas credenciais ou entre em contato com o suporte.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                    Ir para Início
                </Link>
                <Link
                    href="/login"
                    className="px-6 py-3 bg-brand-purple text-white rounded-lg hover:opacity-90 font-medium transition"
                >
                    Trocar de Conta
                </Link>
            </div>
        </div>
    );
}