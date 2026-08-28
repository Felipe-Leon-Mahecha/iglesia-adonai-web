"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { crearCohorte, alternarCohorte, eliminarCohorte, cambiarEstadoInscripcionCasas } from "@/lib/actions/admin-casas-bautismos";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { ESTADOS_CASAS_OASIS } from "@/lib/catalog";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export type InscripcionCasasRow = { id: string; nombre: string; contacto: string; comentario: string | null; estado: string; createdAt: string };
export type CohorteRow = {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  cupo: number;
  activa: boolean;
  inscripciones: InscripcionCasasRow[];
};

const hoy = new Date().toISOString().slice(0, 10);

export function CasasOasisClient({ cohortes }: { cohortes: CohorteRow[] }) {
  const router = useRouter();
  const [estado, formAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearCohorte(fd),
    estadoInicial
  );
  const [verDetalle, setVerDetalle] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <form action={formAction} className="card">
          <h2 className="font-display text-lg font-bold text-navy">Nueva cohorte</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="co-fechaInicio" className="label">Fecha de inicio</label>
              <input id="co-fechaInicio" name="fechaInicio" type="date" required defaultValue={hoy} className="input" />
            </div>
            <div>
              <label htmlFor="co-fechaFin" className="label">Fecha de fin</label>
              <input id="co-fechaFin" name="fechaFin" type="date" required className="input" />
            </div>
            <div>
              <label htmlFor="co-cupo" className="label">Cupo</label>
              <input id="co-cupo" name="cupo" type="number" min={1} required defaultValue={20} className="input" />
            </div>
            <div>
              <span className="label">Visible en el sitio</span>
              <select name="activa" className="input" defaultValue="si">
                <option value="si">Sí, abierta a inscripciones</option>
                <option value="no">No, oculta</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <SubmitButton className="btn-teal">
              <Plus className="h-4 w-4" /> Crear cohorte
            </SubmitButton>
            <FormResulto estado={estado} />
          </div>
        </form>
      </div>

      {cohortes.length === 0 ? (
        <EmptyState titulo="Sin cohortes" detalle="Crea la primera cohorte de Casas Oasis." />
      ) : (
        <div className="space-y-4">
          {cohortes.map((c) => {
            const abierta = verDetalle === c.id;
            const llenos = c.inscripciones.length;
            return (
              <Card key={c.id} className="!p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {c.activa ? <Badge color="teal">Abierta</Badge> : <Badge color="gray">Oculta</Badge>}
                  <span className="text-sm font-semibold text-navy">
                    {formatFecha(c.fechaInicio)} → {formatFecha(c.fechaFin)}
                  </span>
                  <span className="text-xs text-navy/50">Cupo {c.cupo} · {llenos} inscritos</span>
                  <div className="ml-auto flex gap-1.5">
                    <button
                      type="button"
                      onClick={async () => { await alternarCohorte(c.id, !c.activa); router.refresh(); }}
                      className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-navy/5"
                      title={c.activa ? "Ocultar cohorte" : "Abrir cohorte"}
                    >
                      {c.activa ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={async () => { if (confirm("¿Eliminar cohorte e inscripciones?")) { await eliminarCohorte(c.id); router.refresh(); } }}
                      className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-coral-soft hover:text-coral"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button type="button" onClick={() => setVerDetalle(abierta ? null : c.id)} className="mt-3 text-sm font-medium text-teal hover:underline">
                  {abierta ? "Cerrar lista de inscritos" : `Ver inscritos (${llenos})`}
                </button>

                {abierta && (
                  <div className="mt-3 overflow-x-auto rounded-lg border border-navy/10">
                    {c.inscripciones.length === 0 ? (
                      <p className="p-4 text-sm text-navy/50">Aún no hay inscritos.</p>
                    ) : (
                      <table className="w-full min-w-[560px]">
                        <thead className="border-b border-navy/10 bg-[#fafafa]">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Nombre</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Contacto</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Estado</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Comentario</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/5">
                          {c.inscripciones.map((i) => (
                            <tr key={i.id}>
                              <td className="px-4 py-2 text-sm font-medium text-navy">{i.nombre}</td>
                              <td className="px-4 py-2 text-sm text-navy/60">{i.contacto}</td>
                              <td className="px-4 py-2">
                                <select
                                  value={i.estado}
                                  onChange={async (e) => {
                                    await cambiarEstadoInscripcionCasas(i.id, e.target.value);
                                    router.refresh();
                                  }}
                                  className="input !w-auto !py-1 !text-xs"
                                >
                                  {ESTADOS_CASAS_OASIS.map((s) => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="max-w-[200px] px-4 py-2 text-sm text-navy/50">{i.comentario ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}