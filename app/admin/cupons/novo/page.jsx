'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Ticket, Save, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";

export default function CadastroCupom() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        codigo: '',
        tipoDesconto: '',
        valorDesconto: '',
        dataValidade: ''
    });

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_ADMIN") {
            router.push("/"); // Manda para home se não for admin
        }
    }, [status, session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validação simples
        if (!formData.tipoDesconto) {
            toast.error("Selecione o tipo de desconto.");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/cupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Cupom criado com sucesso!");
                setTimeout(() => router.push('/admin/cupons'), 1500);
            } else {
                const erro = await res.json();
                toast.error(JSON.stringify(erro));
            }
        } catch (error) {
            toast.error("Erro de conexão.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") return (
        <div className="flex justify-center items-center min-h-screen bg-page-bg dark:bg-slate-900 transition-colors duration-200">
            <Loader2 className="animate-spin text-brand-purple dark:text-purple-400 w-10 h-10"/>
        </div>
    );

    if (session?.user?.role !== "ROLE_ADMIN") return null;

    return (
        <div className="min-h-screen bg-page-bg dark:bg-slate-900 font-sans py-12 px-4 flex justify-center items-start transition-colors duration-200">
            <Toaster position="top-right" />

            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700 transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-brand-purple dark:text-purple-400" />
                        Criar Novo Cupom
                    </h2>
                    <Link href="/admin/cupons" className="text-gray-500 dark:text-gray-400 hover:text-brand-purple dark:hover:text-purple-400 flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-5 h-5"/> Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código do Cupom</label>
                        <input
                            type="text"
                            value={formData.codigo}
                            onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                            placeholder="Ex: NATAL15"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none uppercase bg-white dark:bg-slate-900 text-gray-900 dark:text-white dark:placeholder-gray-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Desconto</label>
                            <select
                                value={formData.tipoDesconto}
                                onChange={(e) => setFormData({...formData, tipoDesconto: e.target.value})}
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors"
                            >
                                <option value="">Selecione...</option>
                                <option value="PERCENTAGEM">Porcentagem (%)</option>
                                <option value="FIXO">Valor Fixo (Kz)</option>
                            </select>
                        </div>

                        {/* Valor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.valorDesconto}
                                onChange={(e) => setFormData({...formData, valorDesconto: e.target.value})}
                                required
                                placeholder="Ex: 15"
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white dark:placeholder-gray-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Validade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Validade (Opcional)</label>
                        <input
                            type="date"
                            value={formData.dataValidade}
                            onChange={(e) => setFormData({...formData, dataValidade: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90 dark:hover:bg-purple-700 flex justify-center items-center gap-2 mt-4 transition-colors shadow-md dark:shadow-purple-900/20"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
                        Cadastrar Cupom
                    </button>
                </form>
            </div>
        </div>
    );
}