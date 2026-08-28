"use client";

import { useActionState } from "react";
import { Home } from "lucide-react";
import { inscribirseCasasOasis } from "@/lib/actions/inscripciones";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export function FormCasasOasis({
  cohortes,
}: {
  cohortes: Array<{ id: string; fechaInicio: Date; fechaFin: Date; cupo: number; _count: { inscripciones: number } }>;
}) {
  const accion = inscribirseCasasOasis;
  const [estado, formAction] = useActionState(accion, estadoInicial);

  if (cohortes.length === 0) {
    return (
      <div className="card">
        <p className="text-sm text-navy/70">
          No hay una cohorte abierta por ahora. Déjanos tu contacto y te avisamos cuando se abra la próxima.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card">
      <h2 className="font-display text-2xl font-bold text-navy">Inscripción a Casas Oasis</h2>

      <div className="mt-5 space-y-4">
        <div>
          <span className="label">¿A qué cohorte te inscribes?</span>
          <div className="space-y-2">
            {cohortes.map((c) => {
              const disponibles = c.cupo - c._count.inscripciones;
              const lleno = disponibles <= 0;
              return (
                <label
                  key={c.id}
                  className={
                    lleno
                      ? "flex items-start gap-2 rounded-lg border border-mist bg-mist/30 px-3 py-2.5 text-sm text-navy/50"
                      : "flex items-start gap-2 rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm"
                  }
                >
                  <input type="radio" name="cohorteId" value={c.id} required disabled={lleno} className="mt-1 accent-teal" />
                  <span>
                    <strong>Inicia {formatFecha(c.fechaInicio)}</strong> · termina {formatFecha(c.fechaFin)}
                    <span className="ml-1 text-navy/60">
                      {lleno ? "(cupo lleno)" : `· ${disponibles} cupos libres`}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="co-nombre" className="label">Nombre</label>
          <input id="co-nombre" name="nombre" required className="input" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="co-contacto" className="label">WhatsApp o correo</label>
          <input id="co-contacto" name="contacto" required className="input" />
        </div>
        <div>
          <label htmlFor="co-comentario" className="label">Comentario (opcional)</label>
          <textarea id="co-comentario" name="comentario" rows={3} className="input resize-y" placeholder="Horarios que te funcionan, expectativas, etc." />
        </div>

        <FormResulto estado={estado} />

        <SubmitButton>
          <Home className="h-4 w-4" /> Inscribirme
        </SubmitButton>
      </div>
    </form>
  );
}