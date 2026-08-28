"use client";

import { useActionState } from "react";
import Link from "next/link";
import { KeyRound, Mail } from "lucide-react";
import { solicitarResetContrasena } from "@/lib/actions/auth";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormRecuperar() {
  const [estado, formAction] = useActionState(solicitarResetContrasena, estadoInicial);

  return (
    <form action={formAction} className="card p-6">
      <div className="flex items-center gap-3">
        <KeyRound className="h-6 w-6 text-teal" />
        <h1 className="font-display text-xl font-bold text-navy">Recuperar contraseña</h1>
      </div>
      <p className="mt-2 text-sm text-navy/65">
        Escribe tu correo y te enviaremos un enlace para restablecer la contraseña (válido por 30 minutos).
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="rec-email" className="label">Correo</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <input id="rec-email" name="email" type="email" required className="input !pl-9" autoComplete="email" placeholder="tucorreo@adonai.com" />
          </div>
        </div>
        <FormResulto estado={estado} />
        <SubmitButton>Enviar enlace</SubmitButton>
        <p className="text-center text-xs text-navy/55">
          <Link href="/login" className="font-medium text-teal hover:underline">Volver al inicio de sesión</Link>
        </p>
      </div>
    </form>
  );
}