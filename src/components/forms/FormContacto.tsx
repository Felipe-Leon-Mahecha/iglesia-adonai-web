"use client";

import { useActionState } from "react";
import { Lock, MessageCircle } from "lucide-react";
import { guardarMensajeContacto } from "@/lib/actions/contacto";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormContacto({
  categoria,
  titulo,
  placeholders,
  confidencial,
}: {
  categoria: string;
  titulo: string;
  placeholders: { nombre: string; contacto: string; mensaje: string };
  confidencial: boolean;
}) {
  const accion = guardarMensajeContacto.bind(null, categoria);
  const [estado, formAction] = useActionState(accion, estadoInicial);

  return (
    <form action={formAction} className="card">
      {confidencial && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-beige bg-beige-soft px-4 py-3">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
          <p className="text-sm leading-relaxed text-navy">
            <strong>Confidencial.</strong> Lo que compartas aquí solo lo verá el equipo pastoral de la iglesia. Nunca se
            publica ni se comparte con terceros.
          </p>
        </div>
      )}

      <h2 className="font-display text-2xl font-bold text-navy">{titulo}</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={`${categoria}-nombre`} className="label">Nombre</label>
          <input id={`${categoria}-nombre`} name="nombre" required placeholder={placeholders.nombre} className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor={`${categoria}-contacto`} className="label">Contacto</label>
          <input id={`${categoria}-contacto`} name="contacto" required placeholder={placeholders.contacto} className="input" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor={`${categoria}-mensaje`} className="label">Mensaje</label>
          <textarea id={`${categoria}-mensaje`} name="mensaje" required rows={4} placeholder={placeholders.mensaje} className="input resize-y" />
        </div>

        <FormResulto estado={estado} />

        <SubmitButton>
          <MessageCircle className="h-4 w-4" /> Enviar mensaje
        </SubmitButton>
      </div>
    </form>
  );
}