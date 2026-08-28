"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { cambiarContrasena } from "@/lib/actions/auth";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormCambiarContrasena() {
  const [estado, formAction] = useActionState(cambiarContrasena, estadoInicial);

  return (
    <form action={formAction} className="card p-6">
      <div className="flex items-center gap-3">
        <KeyRound className="h-6 w-6 text-teal" />
        <h1 className="font-display text-xl font-bold text-navy">Cambiar contraseña</h1>
      </div>
      <p className="mt-2 text-sm text-navy/65">
        Si tu cuenta usa Google (sin contraseña), este cambio no está disponible.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="chg-actual" className="label">Contraseña actual</label>
          <input id="chg-actual" name="actual" type="password" required className="input" autoComplete="current-password" />
        </div>
        <div>
          <label htmlFor="chg-nueva" className="label">Nueva contraseña</label>
          <input id="chg-nueva" name="nueva" type="password" required minLength={8} className="input" autoComplete="new-password" placeholder="Mínimo 8 caracteres" />
        </div>
        <div>
          <label htmlFor="chg-confirma" className="label">Confirmar nueva contraseña</label>
          <input id="chg-confirma" name="confirma" type="password" required minLength={8} className="input" autoComplete="new-password" />
        </div>
        <FormResulto estado={estado} />
        <SubmitButton>Actualizar contraseña</SubmitButton>
      </div>
    </form>
  );
}