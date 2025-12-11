import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode"; // IMPORTANTE

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
          const res = await fetch("http://localhost:8080/api/auth/login", {
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

          const data = await res.json(); // { token: "..." }

          if (!data.token) return null;

          // Decode do token JWT para extrair dados do usuário
          const decoded = jwtDecode(data.token);


          return {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            token: data.token
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token; // JWT do backend
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;

      // Token JWT disponível no client
      session.accessToken = token.accessToken;

      return session;
    }
  },

  pages: {
    signIn: "/login"
  },
});

export { handler as GET, handler as POST };
