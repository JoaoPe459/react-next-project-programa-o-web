import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Recupera a role do token decodificado pelo NextAuth
    const role = req.nextauth.token?.role
    const path = req.nextUrl.pathname

    console.log(`[Middleware] Acessando: ${path} | Role: ${role}`)

    // 1. Rotas de Administrador
    if (path.startsWith("/admin") && role!== "ROLE_ADMIN") {
      // Redireciona para uma página de erro ou volta para o dashboard
      return NextResponse.rewrite(new URL("/nao-autorizado", req.url))
    }

    // 2. Rotas de Fornecedor
    if (path.startsWith("/fornecedor") && role!== "ROLE_FORNECEDOR") {
      return NextResponse.rewrite(new URL("/nao-autorizado", req.url))
    }

    // 3. Rotas de Usuário Comum 
    if (path.startsWith("/usuario") && role!== "ROLE_USUARIO") {
       return NextResponse.rewrite(new URL("/nao-autorizado", req.url))
    }
  },
  {
    callbacks: {
     
      authorized: ({ token }) =>!!token,
    },
    pages: {
      signIn: "/login", // redireciona para  página login
    },
  }
)

// Define quais rotas o middleware deve "vigiar"
export const config = {
  matcher: [
    // Adicione aqui todas as rotas privadas
    "/dashboard/:path*",
    "/admin/:path*",
    "/fornecedor/:path*",
    "/usuario/:path*",
    "/perfil/:path*",
    "/produtos/novo",
      "/cupons/:path*",
  ]
}