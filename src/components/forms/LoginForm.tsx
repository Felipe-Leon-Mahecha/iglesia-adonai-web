"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LogIn, KeyRound } from "lucide-react";
import { iniciarSesion, iniciarSesionGoogle } from "@/lib/actions/auth";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

function IconoGoogle() {
  return (
    <svg aria-hidden className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [estado, formAction] = useActionState(iniciarSesion, estadoInicial);

  return (
    <div className="space-y-4">
      <form action={iniciarSesionGoogle} className="card p-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-mist bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-[#fafafa]"
        >
          <IconoGoogle /> Continuar con Google
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-navy/40">
        <span className="h-px flex-1 bg-navy/10" />
        o con correo y contraseña
        <span className="h-px flex-1 bg-navy/10" />
      </div>

      <form action={formAction} className="card p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-teal" />
          <h1 className="font-display text-xl font-bold text-navy">Acceso del equipo</h1>
        </div>

        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="login-email" className="label">Correo</label>
            <input id="login-email" name="email" type="email" required className="input" autoComplete="email" placeholder="tucorreo@adonai.com" />
          </div>
          <div>
            <label htmlFor="login-password" className="label">Contraseña</label>
            <input id="login-password" name="password" type="password" required className="input" autoComplete="current-password" />
          </div>

          <FormResulto estado={estado} />

          <SubmitButton>
            <LogIn className="h-4 w-4" /> Entrar
          </SubmitButton>

          <p className="text-center text-xs text-navy/55">
            <Link href="/recuperar-contrasena" className="inline-flex items-center gap-1 font-medium text-teal hover:underline">
              <KeyRound className="h-3.5 w-3.5" /> ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}