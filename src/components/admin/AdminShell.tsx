"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Wallet,
  ClipboardList,
  Music,
  BookOpen,
  Home,
  Waves,
  PencilRuler,
  KeyRound,
  Menu,
  X,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { cerrarSesion } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const MODULOS = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, roles: ["ADMIN", "CONTABILIDAD", "LOGISTICA", "ALABANZA", "EDITOR"] },
  { href: "/admin/inbox", label: "Inbox de contacto", icon: Inbox, roles: ["ADMIN"] },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/contabilidad", label: "Contabilidad", icon: Wallet, roles: ["ADMIN", "CONTABILIDAD"] },
  { href: "/admin/servidores", label: "Servidores / Logística", icon: ClipboardList, roles: ["ADMIN", "LOGISTICA"] },
  { href: "/admin/alabanza", label: "Alabanza", icon: Music, roles: ["ADMIN", "ALABANZA"] },
  { href: "/admin/discipulado", label: "Discipulado", icon: BookOpen, roles: ["ADMIN"] },
  { href: "/admin/casas-oasis", label: "Casas Oasis", icon: Home, roles: ["ADMIN"] },
  { href: "/admin/bautismos", label: "Bautismos", icon: Waves, roles: ["ADMIN"] },
  { href: "/admin/contenido", label: "Contenido web", icon: PencilRuler, roles: ["ADMIN", "EDITOR"] },
];

export function AdminShell({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const modulos = MODULOS.filter((m) => m.roles.some((r) => roles.includes(r)));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
      {modulos.map((m) => {
        const activo = pathname === m.href;
        return (
          <Link
            key={m.href}
            href={m.href}
            onClick={() => setAbierto(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              activo ? "bg-beige font-semibold text-navy" : "text-white/75 hover:bg-white/10 hover:text-white"
            )}
          >
            <m.icon className="h-4 w-4 shrink-0" />
            {m.label}
          </Link>
        );
      })}
      <Link
        href="/cambiar-contrasena"
        onClick={() => setAbierto(false)}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <KeyRound className="h-4 w-4" />
        Cambiar contraseña
      </Link>
      <Link
        href="/"
        onClick={() => setAbierto(false)}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Ver sitio público
      </Link>
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 p-4">
      <form
        action={async () => {
          await cerrarSesion();
        }}
      >
        <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" /> Cerrar sesión
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      <div className="lg:hidden">
        <div className="flex h-14 items-center justify-between border-b border-navy/10 bg-white px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo conTexto={false} className="[&_img]:h-8 [&_img]:w-8" />
            <span className="text-sm font-bold text-navy">Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="rounded-lg border border-navy/15 p-2 text-navy"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          >
            {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {abierto && (
          <div className="flex max-h-[calc(100vh-3.5rem)] flex-col border-b border-navy/10 bg-navy-deep">
            {nav}
            {footer}
          </div>
        )}
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-navy-deep lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <Logo dark conTexto={false} className="[&_img]:h-9 [&_img]:w-9" />
          <div>
            <p className="text-sm font-bold text-white">Portal ADONAI</p>
            <p className="text-xs text-white/50">Staff de la iglesia</p>
          </div>
        </div>
        {nav}
        {footer}
      </aside>

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}