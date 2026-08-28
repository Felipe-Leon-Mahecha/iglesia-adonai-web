import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);

  if (nextUrl.pathname.startsWith("/admin") && !isLoggedIn) {
    const login = new URL("/login", nextUrl.origin);
    login.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(login);
  }

  if (nextUrl.pathname === "/login" && isLoggedIn) {
    return Response.redirect(new URL("/admin", nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};