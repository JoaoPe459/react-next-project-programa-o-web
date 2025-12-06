'use client'

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from 'react-hot-toast'
import { registerAction } from "@/app/actions/register-action"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Configuração do formulário
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      role: 'ROLE_USUARIO' // Valor padrão (Cliente)
    }
  })

  async function onSubmit(data) {
    setLoading(true)
    const result = await registerAction(data)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Conta criada com sucesso!")
      router.push("/login") // Redireciona para o login
    }
  }

  return (
    <div className="font-sans bg-header-bg flex flex-col min-h-screen justify-center items-center py-12 px-4">
      <Toaster position="top-center" />

      {/* Logo Section */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-yellow-400 p-2 rounded-md">
          <svg 
            className="w-8 h-8 text-header-bg" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
        <span className="text-3xl font-bold text-gray-800">WoMart Angolano</span>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Criar nova conta</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                id="nome" 
                placeholder="Seu nome"
                className={`w-full px-4 py-2.5 border ${errors.nome? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
                {...register("nome", { required: "Nome é obrigatório" })}
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seuemail@exemplo.com"
                className={`w-full px-4 py-2.5 border ${errors.email? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
                {...register("email", { required: "E-mail é obrigatório" })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                id="senha" 
                placeholder="Mínimo 8 caracteres"
                className={`w-full px-4 py-2.5 border ${errors.senha? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
                {...register("senha", { 
                  required: "Senha é obrigatória", 
                  minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres" } 
                })}
              />
              {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
            </div>

            {/* Seleção de Role (Usuario vs Fornecedor) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Você quer se registrar como:</label>
              <div className="flex gap-4">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    value="ROLE_USUARIO" 
                    className="focus:ring-brand-purple h-4 w-4 text-brand-purple border-gray-300 accent-purple-600" 
                    {...register("role")}
                  />
                  <span className="ml-3 text-sm text-gray-700">Cliente (Comprar)</span>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded-lg flex-1 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    value="ROLE_FORNECEDOR" 
                    className="focus:ring-brand-purple h-4 w-4 text-brand-purple border-gray-300 accent-purple-600" 
                    {...register("role")}
                  />
                  <span className="ml-3 text-sm text-gray-700">Fornecedor (Vender)</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-purple bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 disabled:bg-gray-400"
            >
              {loading? "Criando Conta..." : "Criar Conta"}
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-brand-purple text-purple-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}