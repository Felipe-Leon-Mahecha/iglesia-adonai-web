"use client";

import { useActionState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { restablecerContrasena } from "@/lib/actions/auth";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormRestablecer({ token }: { token: string }) {
  const [estado, formAction] = useActionState(restablecerContrasena, estadoInicial);

  return (
    <form action={formAction} className="card p-6">
      <div className="flex items-center gap-3">
        <KeyRound className="h-6 w-6 text-teal" />
        <h1 className="font-display text-xl font-bold text-navy">Nueva contraseña</h1>
      </div>
      <p className="mt-2 text-sm text-navy/65">Define tu nueva contraseña para entrar al portal.</p>
      <input type="hidden" name="token" value={token} />
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="reset-nueva" className="label">Nueva contraseña</label>
          <input id="reset-nueva" name="nueva" type="password" required minLength={8} className="input" autoComplete="new-password" placeholder="Mínimo 8 caracteres" />
        </div>
        <div>
          <label htmlFor="reset-confirma" className="label">Confirmar contraseña</label>
          <input id="reset-confirma" name="confirma" type="password" required minLength={8} className="input" autoComplete="new-password" />
        </div>
        <FormResulto estado={estado} />
        <SubmitButton>Guardar contraseña</SubmitButton>
        <p className="text-center text-xs text-navy/55">
          <Link href="/login" className="font-medium text-teal hover:underline">Ir al inicio de sesión</Link>
        </p>
      </div>
    </form>
  );
}