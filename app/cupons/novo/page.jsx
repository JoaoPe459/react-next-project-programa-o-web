'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Ticket, Save, ArrowLeft } from 'lucide-react';

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
            router.push("/");
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
            const res = await fetch('http://localhost:8080/api/cupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Cupom criado com sucesso!");
                setTimeout(() => router.push('/cupons'), 1500);
            } else {
                toast.error("Erro ao criar cupom. Verifique os dados.");
            }
        } catch (error) {
            toast.error("Erro de conexão.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-purple"/></div>;
    if (session?.user?.role !== "ROLE_ADMIN") return null;

    return (
        <div className="min-h-screen bg-page-bg font-sans py-12 px-4 flex justify-center items-start">
            <Toaster position="top-right" />

            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-brand-purple" />
                        Criar Novo Cupom
                    </h2>
                    <Link href="/cupons" className="text-gray-500 hover:text-brand-purple flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5"/> Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom</label>
                        <input
                            type="text"
                            value={formData.codigo}
                            onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                            placeholder="Ex: NATAL15"
                            required
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Desconto</label>
                            <select
                                value={formData.tipoDesconto}
                                onChange={(e) => setFormData({...formData, tipoDesconto: e.target.value})}
                                required
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none bg-white"
                            >
                                <option value="">Selecione...</option>
                                <option value="PERCENTAGEM">Porcentagem (%)</option>
                                <option value="FIXO">Valor Fixo (Kz)</option>
                            </select>
                        </div>

                        {/* Valor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.valorDesconto}
                                onChange={(e) => setFormData({...formData, valorDesconto: e.target.value})}
                                required
                                placeholder="Ex: 15"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                            />
                        </div>
                    </div>

                    {/* Validade */}
                    <div>
                        <input
                            type="date"
                            value={formData.dataValidade}
                            onChange={(e) => setFormData({...formData, dataValidade: e.target.value})}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-purple outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-opacity-90 flex justify-center items-center gap-2 mt-4"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : <Save className="w-5 h-5"/>}
                        Cadastrar Cupom
                    </button>
                </form>
            </div>
        </div>
    );
}