"use client";

import { useActionState } from "react";
import { CalendarCheck } from "lucide-react";
import { inscribirseEvento } from "@/lib/actions/inscripciones";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormInscripcionEvento({ eventoId, titulo }: { eventoId: string; titulo: string }) {
  const accion = inscribirseEvento.bind(null, eventoId, titulo);
  const [estado, formAction] = useActionState(accion, estadoInicial);

  return (
    <form action={formAction} className="card">
      <h2 className="font-display text-2xl font-bold text-navy">Inscripción al evento</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="e-nombre" className="label">Nombre</label>
          <input id="e-nombre" name="nombre" required className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="e-contacto" className="label">WhatsApp o correo</label>
          <input id="e-contacto" name="contacto" required className="input" />
        </div>
        <div>
          <label htmlFor="e-comentario" className="label">Comentario (opcional)</label>
          <textarea id="e-comentario" name="comentario" rows={3} className="input resize-y" placeholder="Personas que te acompañan, preguntas, etc." />
        </div>

        <FormResulto estado={estado} />

        <SubmitButton>
          <CalendarCheck className="h-4 w-4" /> Confirmar inscripción
        </SubmitButton>
      </div>
    </form>
  );
}