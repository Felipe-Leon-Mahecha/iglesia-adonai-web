"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, CirclePlus } from "lucide-react";
import {
  crearEventoBautismo,
  actualizarEventoBautismo,
  eliminarEventoBautismo,
  cambiarEstadoInscripcionBautismo,
  eliminarInscripcionBautismo,
} from "@/lib/actions/admin-casas-bautismos";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { ESTADOS_BAUTISMO } from "@/lib/catalog";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export type InscripcionBautismoRow = { id: string; nombre: string; edad: number; contacto: string; tomoCharla: boolean; comentario: string | null; estado: string; createdAt: string };
export type EventoBautismoRow = { id: string; fecha: string; lugar: string; requisitos: string; inscripciones: InscripcionBautismoRow[] };

function fechaLocal(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

export function BautismosClient({ eventos }: { eventos: EventoBautismoRow[] }) {
  const router = useRouter();
  const [estadoNuevo, formNuevoAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearEventoBautismo(fd),
    estadoInicial
  );
  const [editar, setEditar] = useState<EventoBautismoRow | null>(null);
  const [verInscritos, setVerInscritos] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <form action={formNuevoAction} className="card">
        <h2 className="font-display text-lg font-bold text-navy">Nuevo evento de bautismo</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="b-fecha" className="label">Fecha</label>
            <input id="b-fecha" name="fecha" type="datetime-local" required className="input" />
          </div>
          <div>
            <label htmlFor="b-lugar" className="label">Lugar</label>
            <input id="b-lugar" name="lugar" required className="input" placeholder="Ej: Río / lago / piscina" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="b-requisitos" className="label">Requisitos del evento</label>
            <textarea id="b-requisitos" name="requisitos" required rows={3} className="input resize-y" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <SubmitButton className="btn-teal">
            <CirclePlus className="h-4 w-4" /> Crear evento
          </SubmitButton>
          <FormResulto estado={estadoNuevo} />
        </div>
      </form>

      {editar && (
        <form
          action={async (fd) => {
            const r = await actualizarEventoBautismo(editar.id, fd);
            if (!r.ok) alert(r.error);
            setEditar(null);
            router.refresh();
          }}
          className="card border-teal/40"
        >
          <h2 className="font-display text-lg font-bold text-navy">Editar evento</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Fecha</label>
              <input name="fecha" type="datetime-local" required defaultValue={fechaLocal(editar.fecha)} className="input" />
            </div>
            <div>
              <label className="label">Lugar</label>
              <input name="lugar" required defaultValue={editar.lugar} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Requisitos</label>
              <textarea name="requisitos" required rows={3} defaultValue={editar.requisitos} className="input resize-y" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <SubmitButton className="btn-navy">Guardar cambios</SubmitButton>
            <button type="button" onClick={() => setEditar(null)} className="btn-outline">Cancelar</button>
          </div>
        </form>
      )}

      {eventos.length === 0 ? (
        <EmptyState titulo="Sin eventos de bautismo" detalle="Crea el evento de bautismos de noviembre." />
      ) : (
        <div className="space-y-4">
          {eventos.map((ev) => {
            const abierta = verInscritos === ev.id;
            return (
              <Card key={ev.id} className="!p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color="navy">Bautismos</Badge>
                  <span className="text-sm font-semibold text-navy">{formatFecha(ev.fecha, true)}</span>
                  <span className="text-sm text-navy/60">· {ev.lugar}</span>
                  <span className="text-xs text-navy/50">{ev.inscripciones.length} inscritos</span>
                  <div className="ml-auto flex gap-1.5">
                    <button type="button" onClick={() => setEditar(ev)} className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-navy/5" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => { if (confirm("¿Eliminar evento e inscripciones?")) { await eliminarEventoBautismo(ev.id); router.refresh(); } }}
                      className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-coral-soft hover:text-coral"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 max-w-3xl text-sm text-navy/70">{ev.requisitos}</p>

                <button type="button" onClick={() => setVerInscritos(abierta ? null : ev.id)} className="mt-3 text-sm font-medium text-teal hover:underline">
                  {abierta ? "Cerrar lista" : `Ver inscritos (${ev.inscripciones.length})`}
                </button>

                {abierta && (
                  <div className="mt-3 overflow-x-auto rounded-lg border border-navy/10">
                    {ev.inscripciones.length === 0 ? (
                      <p className="p-4 text-sm text-navy/50">Aún no hay inscritos.</p>
                    ) : (
                      <table className="w-full min-w-[640px]">
                        <thead className="border-b border-navy/10 bg-[#fafafa]">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Nombre</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Edad</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Contacto</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Charla</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Estado</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-navy/60">Comentario</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/5">
                          {ev.inscripciones.map((i) => (
                            <tr key={i.id}>
                              <td className="px-4 py-2 text-sm font-medium text-navy">{i.nombre}</td>
                              <td className="px-4 py-2 text-sm text-navy/60">{i.edad}</td>
                              <td className="px-4 py-2 text-sm text-navy/60">{i.contacto}</td>
                              <td className="px-4 py-2">
                                {i.tomoCharla ? <Badge color="teal">Sí</Badge> : <Badge color="beige">No</Badge>}
                              </td>
                              <td className="px-4 py-2">
                                <select
                                  value={i.estado}
                                  onChange={async (e) => {
                                    await cambiarEstadoInscripcionBautismo(i.id, e.target.value);
                                    router.refresh();
                                  }}
                                  className="input !w-auto !py-1 !text-xs"
                                >
                                  {ESTADOS_BAUTISMO.map((s) => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="max-w-[160px] px-4 py-2 text-sm text-navy/50">{i.comentario ?? "—"}</td>
                              <td className="px-4 py-2">
                                <button
                                  type="button"
                                  onClick={async () => { if (confirm("¿Eliminar inscripción?")) { await eliminarInscripcionBautismo(i.id); router.refresh(); } }}
                                  className="rounded-lg p-1.5 text-navy/35 hover:bg-coral-soft hover:text-coral"
                                  title="Eliminar inscripción"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
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