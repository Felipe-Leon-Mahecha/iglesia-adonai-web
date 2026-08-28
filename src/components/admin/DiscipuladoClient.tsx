"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, StickyNote, ChevronRight } from "lucide-react";
import {
  crearEtapa,
  eliminarEtapa,
  crearDiscipulo,
  cambiarEtapaDiscipulo,
  eliminarDiscipulo,
  agregarSeguimiento,
} from "@/lib/actions/admin-discipulado";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, EmptyState } from "@/components/admin/ui";
import { formatFechaCorta } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export type SeguimientoRow = { fecha: string; nota: string };
export type DiscipuloRow = { id: string; nombre: string; contacto: string; seguimientos: SeguimientoRow[]; totalSeguimientos: number };
export type EtapaRow = { id: string; nombre: string; orden: number; discipulos: DiscipuloRow[] };

export function DiscipuladoClient({ etapas }: { etapas: EtapaRow[] }) {
  const router = useRouter();
  const [estadoEtapa, formEtapaAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearEtapa(fd),
    estadoInicial
  );
  const [estadoDis, formDisAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearDiscipulo(fd),
    estadoInicial
  );
  const [nuevoEnEtapa, setNuevoEnEtapa] = useState<string | null>(null);
  const [seguirA, setSeguirA] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <form action={formEtapaAction} className="flex items-end gap-2">
          <div>
            <label htmlFor="etapa-nombre" className="label">Nueva etapa</label>
            <input id="etapa-nombre" name="nombre" required className="input !w-44" placeholder="Ej: Servidor" />
          </div>
          <SubmitButton className="btn-teal !py-2.5">Crear</SubmitButton>
        </form>
        <FormResulto estado={estadoEtapa} />
      </div>

      <form action={formDisAction} className="card">
        <h2 className="font-display text-lg font-bold text-navy">Registrar discípulo</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="d-nombre" className="label">Nombre</label>
            <input id="d-nombre" name="nombre" required className="input" />
          </div>
          <div>
            <label htmlFor="d-contacto" className="label">Contacto</label>
            <input id="d-contacto" name="contacto" required className="input" />
          </div>
          <div>
            <label htmlFor="d-etapa" className="label">Etapa / grupo</label>
            <select id="d-etapa" name="etapaId" required className="input">
              {etapas.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <SubmitButton className="btn-navy">
            <Plus className="h-4 w-4" /> Guardar discípulo
          </SubmitButton>
          <FormResulto estado={estadoDis} />
        </div>
      </form>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {etapas.length === 0 && (
          <div className="min-w-full">
            <EmptyState titulo="Sin etapas" detalle="Crea la primera etapa del proceso de discipulado." />
          </div>
        )}
        {etapas.map((etapa) => (
          <div key={etapa.id} className="w-72 shrink-0 rounded-xl border border-navy/10 bg-white">
            <div className="flex items-center justify-between border-b border-navy/10 px-3 py-2.5">
              <p className="text-sm font-bold text-navy">{etapa.nombre}</p>
              <div className="flex items-center gap-1">
                <Badge color="beige">{etapa.discipulos.length}</Badge>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await eliminarEtapa(etapa.id);
                    if (!res.ok) alert(res.error);
                    router.refresh();
                  }}
                  className="rounded-lg p-1.5 text-navy/35 hover:bg-coral-soft hover:text-coral"
                  title="Eliminar etapa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 p-2">
              <button
                type="button"
                onClick={() => setNuevoEnEtapa(nuevoEnEtapa === etapa.id ? null : etapa.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-navy/25 px-3 py-2 text-xs font-medium text-navy/60 hover:border-teal hover:text-teal"
              >
                <Plus className="h-3.5 w-3.5" /> Mover o agregar aquí
              </button>

              {nuevoEnEtapa === etapa.id && (
                <form
                  action={async (fd) => {
                    const res = await crearDiscipulo(fd);
                    if (!res.ok) alert(res.error);
                    setNuevoEnEtapa(null);
                    router.refresh();
                  }}
                  className="space-y-2 rounded-lg border border-teal/40 bg-teal-soft p-2"
                >
                  <input name="etapaId" type="hidden" value={etapa.id} />
                  <input name="nombre" required className="input !py-1.5 !text-xs" placeholder="Nombre" />
                  <input name="contacto" required className="input !py-1.5 !text-xs" placeholder="Contacto" />
                  <SubmitButton className="btn-teal w-full !px-3 !py-1.5 !text-xs">Guardar</SubmitButton>
                </form>
              )}

              {etapa.discipulos.map((d) => (
                <div key={d.id} className="rounded-lg border border-navy/10 bg-[#fafbfc] p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy">{d.nombre}</p>
                      <p className="truncate text-xs text-navy/50">{d.contacto}</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm(`¿Eliminar a ${d.nombre}?`)) return;
                        await eliminarDiscipulo(d.id);
                        router.refresh();
                      }}
                      className="rounded-lg p-1 text-navy/35 hover:bg-coral-soft hover:text-coral"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <select
                      value={etapa.id}
                      onChange={async (e) => {
                        await cambiarEtapaDiscipulo(d.id, e.target.value);
                        router.refresh();
                      }}
                      className="input !w-auto !py-1 !text-xs"
                      title="Cambiar de etapa"
                    >
                      {etapas.map((e) => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2">
                    {d.seguimientos.length > 0 && (
                      <ul className="space-y-1">
                        {d.seguimientos.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-navy/60">
                            <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                            <span>
                              <span className="font-medium text-navy/40">{formatFechaCorta(s.fecha)}:</span> {s.nota}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {d.totalSeguimientos > d.seguimientos.length && (
                      <p className="text-[11px] text-navy/40">+{d.totalSeguimientos - d.seguimientos.length} más</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSeguirA(seguirA === d.id ? null : d.id)}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-teal hover:underline"
                    >
                      <StickyNote className="h-3 w-3" /> {seguirA === d.id ? "Cerrar nota" : "Registrar seguimiento"}
                    </button>
                  </div>

                  {seguirA === d.id && (
                    <form
                      action={async (fd) => {
                        const res = await agregarSeguimiento(d.id, estadoInicial, fd);
                        if (!res.ok) alert(res.error);
                        setSeguirA(null);
                        router.refresh();
                      }}
                      className="mt-2 space-y-2"
                    >
                      <textarea name="nota" required rows={2} className="input resize-y !py-1.5 !text-xs" placeholder="Nota corta de la sesión…" />
                      <SubmitButton className="btn-teal w-full !px-3 !py-1.5 !text-xs">Guardar nota</SubmitButton>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}