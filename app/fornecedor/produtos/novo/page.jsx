'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, PackagePlus } from 'lucide-react';
import { API_BASE_URL } from "@/app/utils/api-config";

export default function NovoProdutoPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Configuração do formulário com React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm();

    // 1. Verificação de Segurança e Redirecionamento
    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user?.role !== "ROLE_FORNECEDOR") {
            router.push("/");
        }
    }, [status, session, router]);

    // 2. Função de Envio (Submit)
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const payload = {
                nome: data.nome,
                categoria: data.categoria,
                descricao: data.descricao,
                preco: parseFloat(data.preco),
                estoque: parseInt(data.estoque, 10),
                imagem: data.imagem || "https://placehold.co/300x300?text=Sem+Imagem"
            };

            const response = await fetch(`${API_BASE_URL}/api/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('Produto cadastrado com sucesso!');
                setTimeout(() => {
                    router.push('/fornecedor/produtos');
                }, 1500);
            } else {
                const errorData = await response.text();
                toast.error(`Erro ao cadastrar: ${errorData || 'Verifique os dados.'}`);
            }

        } catch (error) {
            console.error("Erro de conexão:", error);
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page-bg dark:bg-slate-900 transition-colors duration-200">
                <Loader2 className="w-10 h-10 animate-spin text-brand-purple dark:text-purple-400" />
            </div>
        );
    }

    if (session?.user?.role !== "ROLE_FORNECEDOR") {
        return null;
    }

    // Função auxiliar para classes de input
    const getInputClass = (hasError) => {
        const base = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple transition-all dark:text-white";
        if (hasError) {
            return `${base} border-red-500 ring-1 ring-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-500`;
        }
        return `${base} border-gray-300 bg-gray-50 focus:bg-white dark:bg-slate-900 dark:border-slate-600 dark:focus:bg-slate-900 dark:placeholder-gray-500`;
    };

    return (
        <div className="min-h-screen bg-page-bg dark:bg-slate-900 font-sans pb-12 transition-colors duration-200">
            <Toaster position="top-right" />

            {/* Header removido (está no layout.js) */}

            <main className="container mx-auto px-4 py-8 max-w-3xl">

                {/* Cabeçalho da Página */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-brand-purple dark:bg-purple-600 p-2 rounded-lg text-white shadow-lg shadow-purple-900/20">
                            <PackagePlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Novo Produto</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Adicione um novo item ao seu catálogo</p>
                        </div>
                    </div>

                    <Link
                        href="/fornecedor/produtos"
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-400 transition-colors text-sm font-medium bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Lista
                    </Link>
                </div>

                {/* Card do Formulário */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-slate-700 transition-colors duration-200">

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* 1. Nome do Produto */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nome do Produto <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Ex: Smartphone Samsung Galaxy A54"
                                className={getInputClass(errors.nome)}
                                {...register("nome", {
                                    required: "Nome do produto é obrigatório.",
                                    minLength: { value: 3, message: "Mínimo de 3 caracteres." }
                                })}
                            />
                            {errors.nome && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nome.message}</p>}
                        </div>

                        {/* 2. Categoria e Preço (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Categoria <span className="text-red-500">*</span></label>
                                <select
                                    className={getInputClass(errors.categoria)}
                                    {...register("categoria", { required: "Selecione uma categoria." })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Eletrônicos">Eletrônicos</option>
                                    <option value="Moda">Moda</option>
                                    <option value="Casa">Casa e Jardim</option>
                                    <option value="Beleza">Beleza</option>
                                    <option value="Alimentos">Alimentos</option>
                                </select>
                                {errors.categoria && <p className="text-red-500 text-xs mt-1 font-medium">{errors.categoria.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Preço (Kz) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold">Kz</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={`${getInputClass(errors.preco)} pl-10`}
                                        {...register("preco", {
                                            required: "Preço é obrigatório.",
                                            min: { value: 0.1, message: "O preço deve ser maior que zero." }
                                        })}
                                    />
                                </div>
                                {errors.preco && <p className="text-red-500 text-xs mt-1 font-medium">{errors.preco.message}</p>}
                            </div>
                        </div>

                        {/* 3. Estoque e Imagem */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Estoque Inicial <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className={getInputClass(errors.estoque)}
                                    {...register("estoque", {
                                        required: "Estoque é obrigatório.",
                                        min: { value: 0, message: "Estoque não pode ser negativo." },
                                        validate: value => Number.isInteger(parseFloat(value)) || "Deve ser um número inteiro."
                                    })}
                                />
                                {errors.estoque && <p className="text-red-500 text-xs mt-1 font-medium">{errors.estoque.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">URL da Imagem</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    className={getInputClass(false)}
                                    {...register("imagem")}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Opcional. Uma imagem padrão será usada se vazio.</p>
                            </div>
                        </div>

                        {/* 4. Descrição */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descrição Detalhada <span className="text-red-500">*</span></label>
                            <textarea
                                rows="5"
                                placeholder="Descreva as principais características do produto..."
                                className={getInputClass(errors.descricao)}
                                {...register("descricao", { required: "A descrição é obrigatória." })}
                            ></textarea>
                            {errors.descricao && <p className="text-red-500 text-xs mt-1 font-medium">{errors.descricao.message}</p>}
                        </div>

                        {/* Botão de Submit */}
                        <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-slate-700 mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="mr-4 px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center justify-center space-x-2 bg-brand-purple text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-opacity-90 dark:hover:bg-purple-700 hover:shadow-lg transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Cadastrar Produto</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}