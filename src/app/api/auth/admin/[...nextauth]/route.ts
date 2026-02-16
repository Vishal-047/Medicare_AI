import NextAuth, { AuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // No authentication: allow any credentials
        return {
          id: "admin-id",
          name: credentials?.emailOrPhone || "Admin",
          email: credentials?.emailOrPhone || "admin@example.com",
          role: "admin",
        }
      },
    }),
    CredentialsProvider({
      id: "admin-otp",
      name: "Admin OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        // No OTP check: allow any OTP
        return {
          id: "admin-id",
          name: credentials?.email || "Admin",
          email: credentials?.email || "admin@example.com",
          role: "admin",
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
