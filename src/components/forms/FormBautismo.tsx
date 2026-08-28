"use client";

import { useActionState } from "react";
import { Waves } from "lucide-react";
import { inscribirseBautismo } from "@/lib/actions/inscripciones";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormBautismo({ eventoId }: { eventoId: string }) {
  const accion = inscribirseBautismo.bind(null, eventoId);
  const [estado, formAction] = useActionState(accion, estadoInicial);

  return (
    <form action={formAction} className="card">
      <h2 className="font-display text-2xl font-bold text-navy">Inscríbete al bautismo</h2>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="b-nombre" className="label">Nombre completo</label>
          <input id="b-nombre" name="nombre" required className="input" autoComplete="name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b-edad" className="label">Edad</label>
            <input id="b-edad" name="edad" type="number" min={8} max={120} required className="input" />
          </div>
          <div>
            <label htmlFor="b-contacto" className="label">WhatsApp o correo</label>
            <input id="b-contacto" name="contacto" required className="input" />
          </div>
        </div>
        <div>
          <span className="label">¿Ya tomaste la charla de preparación?</span>
          <div className="flex gap-4">
            <label className="label-inline inline-flex items-center gap-2">
              <input type="radio" name="tomoCharla" value="si" required className="accent-teal" /> Sí
            </label>
            <label className="label-inline inline-flex items-center gap-2">
              <input type="radio" name="tomoCharla" value="no" required className="accent-teal" /> No todavía
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="b-comentario" className="label">Comentario (opcional)</label>
          <textarea id="b-comentario" name="comentario" rows={3} className="input resize-y" placeholder="Preguntas, condiciones especiales, etc." />
        </div>

        <FormResulto estado={estado} />

        <SubmitButton>
          <Waves className="h-4 w-4" /> Quiero bautizarme
        </SubmitButton>
      </div>
    </form>
  );
}