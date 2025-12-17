'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, Package } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";

export default function EditarProdutoPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams(); // Pega o ID da URL
    const { id } = params;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_FORNECEDOR") {
            router.push("/"); // Manda para home se não for fornecedor
        }
        fetchProduto();
    }, [status, session, router]);

    // Buscar dados do produto para preencher o form
    async function fetchProduto() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
                headers: { 'Authorization': `Bearer ${session.user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Preencher campos
                setValue("nome", data.nome);
                setValue("descricao", data.descricao);
                setValue("preco", data.preco);
                // estes não existem no backend → defina defaults
                setValue("categoria", data.categoria ?? "");
                setValue("estoque", data.estoque ?? 0);
                setValue("imagem", data.imagem ?? "");

            } else {
                toast.error("Erro ao carregar produto.");
                router.push("/fornecedor/produtos");
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro de conexão.");
        } finally {
            setIsLoadingData(false);
        }
    }


    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                preco: parseFloat(data.preco),
                estoque: parseInt(data.estoque, 10),
            };

            const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Produto atualizado!');
                setTimeout(() => router.push('/fornecedor/produtos'), 1500);
            } else {
                toast.error('Erro ao atualizar produto.');
            }
        } catch (error) {
            toast.error("Erro de conexão.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple dark:text-purple-400" />
            </div>
        );
    }

    const inputClassName = "w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 transition-colors";

    return (
        <div className="min-h-screen bg-page-bg dark:bg-slate-900 font-sans pb-12 transition-colors duration-200">
            <Toaster position="top-right" />
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="bg-brand-purple dark:bg-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-900/20">
                            <Package className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Produto</h1>
                    </div>
                    <Link href="/fornecedor/produtos" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700 transition-colors duration-200">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                            <input type="text" className={inputClassName} {...register("nome", { required: true })} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                                <select className={inputClassName} {...register("categoria", { required: true })}>
                                    <option value="Eletrônicos">Eletrônicos</option>
                                    <option value="Moda">Moda</option>
                                    <option value="Casa">Casa e Jardim</option>
                                    <option value="Beleza">Beleza</option>
                                    <option value="Alimentos">Alimentos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço (Kz)</label>
                                <input type="number" step="0.01" className={inputClassName} {...register("preco", { required: true })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Estoque</label>
                                <input type="number" className={inputClassName} {...register("estoque", { required: true })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Imagem URL</label>
                                <input type="text" className={inputClassName} {...register("imagem")} placeholder="https://..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                            <textarea rows="4" className={inputClassName} {...register("descricao", { required: true })}></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 dark:hover:bg-purple-700 transition-all shadow-md dark:shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-5 h-5" />}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}