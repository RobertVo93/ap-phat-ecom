import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { AppDataSource } from "./lib/database/typeorm"
import { UserEntity } from "./lib/database/entities"
import { UserRole } from "./types"
import { compare } from "bcryptjs"
import { ensureDataSource } from '@/lib/database/ensureDataSource';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "RememberMe", type: "text" }
      },
      async authorize(credentials) {
        await ensureDataSource()
        if (!credentials?.phone || !credentials?.password) return null
        const rememberMe = credentials.rememberMe === "true";

        const phone = String(credentials.phone)
        const password = String(credentials.password)

        const repo = AppDataSource.getRepository(UserEntity)
        const user = await repo.findOne({ where: { phone: phone } })

        if (!user) return null

        const isValid = await compare(password, user.password ?? "")
        if (!isValid) return null

        user.lastLogin = new Date()
        await repo.save(user)

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
          phone: user.phone,
          rememberMe: rememberMe ? "true" : "false"
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await ensureDataSource()
        const repo = AppDataSource.getRepository(UserEntity)

        let existing = await repo.findOne({ where: { email: user.email! } })
        if (!existing) {
          existing = repo.create({
            email: user.email as string,
            username: user.name as string,
            password: "",
            passwordSalt: "",
            role: UserRole.customer,
            active: true,
            lastLogin: new Date(),
          })
          await repo.save(existing)
        } else {
          existing.lastLogin = new Date()
          await repo.save(existing)
        }

        user.id = existing.id
      }

      return true
    },

    async jwt({ token, user, trigger }) {
      if (user?.id) {
        token.id = user.id;
      }
      const rememberMe = (user as any)?.rememberMe === "true" || token.rememberMe === "true";
      token.rememberMe = rememberMe ? "true" : "false";

      if (trigger === "signIn" || trigger === "update") {
        const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
        token.maxAge = maxAge;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (token.maxAge) {
        (session as any).expires = new Date((token.iat! * 1000) + (Number(token.maxAge) * 1000)).toISOString();
      }
      return session;
    }
  }
})