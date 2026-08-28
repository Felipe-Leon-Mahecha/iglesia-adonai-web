import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; roles?: string[] };
        token.id = u.id;
        token.roles = u.roles ?? [];
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.roles = (token.roles as string[]) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;