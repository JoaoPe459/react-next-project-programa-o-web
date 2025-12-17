'use client'

import { getSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import toast, { Toaster } from 'react-hot-toast'
import { User, Lock, LogIn, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()

    async function onSubmit(data) {
        setLoading(true)
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        })
        setLoading(false)

        if (result?.error) {
            toast.error("Usuário ou senha incorretos")
            return;
        }

        const session = await getSession();

        if (!session || !session.user) {
            toast.error("Erro ao carregar sessão");
            return;
        }

        console.log("Sessão carregada:", session);

        const { token, role, id, email } = session.user;

        // Salvar no localStorage (Opcional, pois o NextAuth já gerencia a sessão)
        localStorage.setItem("authToken", token);
        localStorage.setItem("authRole", role);
        localStorage.setItem("authId", id);
        localStorage.setItem("authEmail", email);

        if (role === "ROLE_ADMIN") {
            toast.success("Bem-vindo administrador!");
            router.push("/admin");
        } else if (role === "ROLE_FORNECEDOR") {
            toast.success("Bem-vindo fornecedor!");
            router.push("/fornecedor");
        } else if (role === "ROLE_USUARIO") {
            toast.success("Bem-vindo usuário!");
            router.push("/usuario/produtos");
        } else {
            toast("Role desconhecida");
        }

        router.refresh();
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-page-bg dark:bg-slate-900 font-sans py-12 px-4 transition-colors duration-200">
            <Toaster position="top-right" />

            {/* Card com adaptação dark mode */}
            <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-xl p-8 transition-colors duration-200">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Bem-vindo</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Insira suas credenciais para acessar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="exemplo@email.com"
                                disabled={loading}
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all 
                                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                                ${errors.email ? 'border-red-500 ring-1 ring-red-500 dark:border-red-500' : 'border-gray-300'}`}
                                {...register("email", { required: "Digite seu e-mail" })}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Senha</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                disabled={loading}
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all
                                bg-white dark:bg-slate-900 dark:text-white dark:placeholder-gray-500 dark:border-slate-600
                                ${errors.password ? 'border-red-500 ring-1 ring-red-500 dark:border-red-500' : 'border-gray-300'}`}
                                {...register("password", { required: "Digite sua senha" })}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-brand-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple transition-all disabled:opacity-70 dark:ring-offset-slate-800"
                    >
                        {loading ? <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> : <LogIn className="-ml-1 mr-2 h-5 w-5" />}
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        <p>
                            Não tem uma conta?{' '}
                            <Link href="/register" className="font-medium text-brand-purple hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline">
                                Cadastre-se gratuitamente
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}