'use client'

import { useForm } from "react-hook-form"
import { registerUserAction } from "@/app/actions/auth-actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Removido o 'resolver: zodResolver'
  const { register, handleSubmit, formState: { errors } } = useForm()

  async function onSubmit(data) {
    setLoading(true)
    const result = await registerUserAction(data)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
      // Se o servidor retornar erros específicos de campo (validação manual)
      if (result.validationErrors) {
        console.error(result.validationErrors) 
      }
    } else {
      toast.success("Conta criada! Redirecionando...")
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crie sua conta</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Campo Nome */}
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input 
              {...register("nome", { 
                required: "Nome é obrigatório",
                minLength: { value: 3, message: "Mínimo de 3 letras" }
              })}
              type="text" 
              className="w-full border p-2 rounded"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input 
              {...register("email", { 
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de e-mail inválido"
                }
              })}
              type="email" 
              className="w-full border p-2 rounded"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              {...register("senha", { 
                required: "Senha é obrigatória",
                minLength: { value: 6, message: "Mínimo de 6 caracteres" }
              })}
              type="password" 
              className="w-full border p-2 rounded"
            />
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading? "Cadastrando..." : "Registrar"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Já tem conta? <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
        </p>
      </div>
    </div>
  )
}