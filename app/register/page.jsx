'use client'

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from 'react-hot-toast'
import { registerAction } from "@/app/actions/register-action"
import { User, Mail, Lock, Loader2, UserPlus, Store, ShoppingBag } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Configuração do formulário
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            role: 'ROLE_USUARIO' // Valor padrão (Cliente)
        }
    })

    // Assistir a role selecionada para mudar estilo
    const selectedRole = watch("role");

    async function onSubmit(data) {
        setLoading(true)
        const result = await registerAction(data)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Conta criada com sucesso!")
            router.push("/login")
        }
    }

    return (
        // Centraliza o card descontando a altura do header (5rem/80px)
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-page-bg dark:bg-slate-900 font-sans py-12 px-4 transition-colors duration-200">
            <Toaster position="top-right" />

            {/* Card */}
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-xl p-8 transition-colors duration-200">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Criar nova conta</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Preencha seus dados para começar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Nome Completo */}
                    <div className="space-y-1">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nome Completo</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Seu nome"
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all
                                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                                ${errors.nome ? 'border-red-500 ring-1 ring-red-500 dark:border-red-500' : 'border-gray-300'}`}
                                {...register("nome", { required: "Nome é obrigatório" })}
                            />
                        </div>
                        {errors.nome && <p className="text-red-500 text-xs ml-1">{errors.nome.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                placeholder="seuemail@exemplo.com"
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all
                                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                                ${errors.email ? 'border-red-500 ring-1 ring-red-500 dark:border-red-500' : 'border-gray-300'}`}
                                {...register("email", { required: "E-mail é obrigatório" })}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Senha */}
                    <div className="space-y-1">
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Senha</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Mínimo 8 caracteres"
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all
                                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                                ${errors.senha ? 'border-red-500 ring-1 ring-red-500 dark:border-red-500' : 'border-gray-300'}`}
                                {...register("senha", {
                                    required: "Senha é obrigatória",
                                    minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres" }
                                })}
                            />
                        </div>
                        {errors.senha && <p className="text-red-500 text-xs ml-1">{errors.senha.message}</p>}
                    </div>

                    {/* Seleção de Role */}
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 ml-1">Você quer se registrar como:</label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Opção Cliente */}
                            <label className={`relative flex flex-col items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 
                                ${selectedRole === 'ROLE_USUARIO'
                                ? 'border-brand-purple bg-purple-50 ring-1 ring-brand-purple dark:bg-purple-900/20 dark:border-brand-purple'
                                : 'border-gray-300 dark:border-slate-600'}`}>
                                <input
                                    type="radio"
                                    value="ROLE_USUARIO"
                                    className="sr-only"
                                    {...register("role")}
                                />
                                <ShoppingBag className={`w-6 h-6 mb-2 ${selectedRole === 'ROLE_USUARIO' ? 'text-brand-purple dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                <span className={`text-sm font-medium ${selectedRole === 'ROLE_USUARIO' ? 'text-brand-purple dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>Cliente</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">Quero comprar</span>
                            </label>

                            {/* Opção Fornecedor */}
                            <label className={`relative flex flex-col items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 
                                ${selectedRole === 'ROLE_FORNECEDOR'
                                ? 'border-brand-purple bg-purple-50 ring-1 ring-brand-purple dark:bg-purple-900/20 dark:border-brand-purple'
                                : 'border-gray-300 dark:border-slate-600'}`}>
                                <input
                                    type="radio"
                                    value="ROLE_FORNECEDOR"
                                    className="sr-only"
                                    {...register("role")}
                                />
                                <Store className={`w-6 h-6 mb-2 ${selectedRole === 'ROLE_FORNECEDOR' ? 'text-brand-purple dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} />
                                <span className={`text-sm font-medium ${selectedRole === 'ROLE_FORNECEDOR' ? 'text-brand-purple dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>Fornecedor</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">Quero vender</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 dark:ring-offset-slate-800"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                Criando Conta...
                            </>
                        ) : (
                            <>
                                <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                                Criar Conta
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    <p>
                        Já tem uma conta?{' '}
                        <Link href="/login" className="font-medium text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline">
                            Faça login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}