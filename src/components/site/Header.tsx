"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/eventos", label: "Eventos" },
  { href: "/sermones", label: "Sermones" },
  { href: "/dar", label: "Dar" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" onClick={() => setAbierto(false)} aria-label="Ir al inicio">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-navy text-white" : "text-navy/80 hover:bg-navy/5"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="ml-2 rounded-lg border border-navy/20 p-2 text-navy transition-colors hover:bg-navy/5" aria-label="Portal interno">
            <LogIn className="h-5 w-5" />
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="rounded-lg border border-navy/15 p-2 text-navy lg:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
        >
          {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {abierto && (
        <nav className="border-t border-navy/10 bg-white lg:hidden" aria-label="Menú móvil">
          <div className="container-site flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === item.href ? "bg-navy text-white" : "text-navy/80 hover:bg-navy/5"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/casas-oasis"
              onClick={() => setAbierto(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy/80 hover:bg-navy/5"
            >
              Casas Oasis
            </Link>
            <Link
              href="/bautismos"
              onClick={() => setAbierto(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy/80 hover:bg-navy/5"
            >
              Bautismos
            </Link>
            <Link
              href="/login"
              onClick={() => setAbierto(false)}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-navy/20 px-3 py-2.5 text-sm font-medium text-navy"
            >
              <LogIn className="h-4 w-4" /> Portal interno
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}