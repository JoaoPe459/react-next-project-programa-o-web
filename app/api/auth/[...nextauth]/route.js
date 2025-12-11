import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import {API_BASE_URL} from "@/app/utils/api-config";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {}
      },

      async authorize(credentials) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              senha: credentials.password
            })
          });

          if (!res.ok) return null;

          const data = await res.json();

          if (!data.token) return null;

          // Decode JWT
          const decoded = jwtDecode(data.token);

          console.log("Decoded JWT:", decoded);

          return {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            token: data.token,
          };

        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    /**
     * Salva os dados do usuário dentro do token JWT do NextAuth
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token; // nome correto
      }
      return token;
    },

    /**
     * Envia o token do NextAuth para o client
     */
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;

      // CORREÇÃO PRINCIPAL: salvar token dentro de session.user
      session.user.token = token.token;

      return session;
    }
  },

  pages: {
    signIn: "/login"
  },
});

export { handler as GET, handler as POST };
