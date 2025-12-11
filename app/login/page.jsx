'use client'

import { useForm } from "react-hook-form"
import { signIn , getSession,useSession} from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import toast, { Toaster } from 'react-hot-toast'

// Ícones SVG simples para substituir o <i> do FontAwesome
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-[20px] top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(51,51,51)] pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-[20px] top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(51,51,51)] pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2.9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2.9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3 3.1-3 1.71 0 3.1 1.29 3.1 3v2z" />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Validação manual (React Hook Form puro)
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
    } 

    const session = await getSession();

if (!session || !session.user) {
    toast.error("Erro ao carregar sessão");
    return;
  }

  console.log("Sessão carregada:", session);

  const { token, role, id, email } = session.user;
  console.log("Token:", token);
  console.log("Role:", role);
  console.log("ID:", id);
  console.log("Email:", email);

  localStorage.setItem("authToken", token);
  localStorage.setItem("authRole", role);
  localStorage.setItem("authId", id);
  localStorage.setItem("authEmail", email);

     if (role === "ROLE_ADMIN") {
    toast.success("Bem-vindo administrador!");
    router.push("/admin/dashboard");
  } else if (role === "ROLE_FORNECEDOR") {
    toast.success("Bem-vindo fornecedor!");
    router.push("/fornecedor/produtosFornecidos");
  } else if (role === "ROLE_USUARIO") {
    toast.success("Bem-vindo usuário!");
    router.push("/usuario/produtos");
  } else {
    toast("Role desconhecida");
  }

  router.refresh();
    
  }

  return (
    // Body / Main Container
    <div className="flex justify-center items-center min-h-screen font-['Poppins',sans-serif]">
      <Toaster position="top-right" />
      
      {/*.container */}
      <div className="w-[500px] bg-[rgb(244,244,244)] border-2 border-[rgba(103,102,110,0.815)] shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px] text-black py-[15px] flex flex-col justify-center items-center">
        
        {/* Titulo */}
        <h1 className="text-center text-[30px] p-0 text-[rgb(96,125,139)] font-semibold mb-2">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-[60%] text-center">
          
          {/* Input Box: Email */}
          <div className="relative w-full h-[40px] my-[25px]">
            <input 
              type="text" 
              placeholder="Username / Email"
              disabled={loading}
              className={`w-full h-full outline-none border-none text-[16px] rounded-[15px] pl-[15px] pr-[40px] placeholder-[rgb(85,85,85)] ${
                errors.email? 'ring-2 ring-[rgb(230,57,70)]' : ''
              }`}
              {...register("email", { 
                required: "Digite seu e-mail",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido"
                }
              })}
            />
            <UserIcon />
            {/* Mensagem de Erro Flutuante */}
            {errors.email && (
              <span className="absolute -bottom-5 left-2 text-[12px] text-[rgb(230,57,70)]">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Input Box: Senha */}
          <div className="relative w-full h-[40px] my-[25px]">
            <input 
              type="password" 
              placeholder="Password"
              disabled={loading}
              className={`w-full h-full outline-none border-none text-[16px] rounded-[15px] pl-[15px] pr-[40px] placeholder-[rgb(85,85,85)] ${
                errors.password? 'ring-2 ring-[rgb(230,57,70)]' : ''
              }`}
              {...register("password", { 
                required: "Digite sua senha",
                minLength: { value: 8, message: "Mínimo 8 caracteres" }
              })}
            />
            <LockIcon />
            {errors.password && (
              <span className="absolute -bottom-5 left-2 text-[12px] text-[rgb(230,57,70)]">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Lembrar e Esqueci Senha */}
          <div className="flex justify-between items-center my-[15px] text-[rgb(51,51,51)] text-sm">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" className="accent-[rgb(46,139,87)]" /> 
              Lembrar-me
            </label>
            <a href="#" className="no-underline text-[rgb(51,51,51)] hover:underline transition duration-200">
              Esqueceu a senha?
            </a>
          </div>

          {/* Botão de Login */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-[50%] h-[40px] rounded-[10px] bg-[rgb(46,139,87)] mb-[20px] text-[17px] text-white border-none shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] cursor-pointer hover:bg-[rgb(60,160,100)] transition-all duration-200 ease-linear disabled:bg-[rgb(96,125,139)] disabled:cursor-not-allowed"
          >
            {loading? "Entrando..." : "Entrar"}
          </button>

          {/* Registrar */}
          <div className="text-[14px]">
            <p>
              Não tem uma conta?{' '}
              <Link href="/register" className="text-[rgb(255,127,50)] no-underline hover:underline transition duration-200">
                Cadastre-se
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}