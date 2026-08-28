"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Music as MusicIcon, ListMusic } from "lucide-react";
import { crearCancion, eliminarCancion, crearSetlist } from "@/lib/actions/admin-equipos";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { SERVICIO_TIPOS, servicioTipoLabel } from "@/lib/catalog";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export type CancionRow = { id: string; titulo: string; tono: string | null; linkLetra: string | null; linkPista: string | null; vecesUsadas: number };
export type ServicioAlabanzaRow = {
  id: string;
  tipo: string;
  fecha: string;
  setlist: { id: string; canciones: Array<{ id: string; cancionId: string; orden: number; titulo: string; tono: string | null }> } | null;
};

export function AlabanzaClient({ canciones, servicios }: { canciones: CancionRow[]; servicios: ServicioAlabanzaRow[] }) {
  const router = useRouter();
  const [estadoCancion, formCancionAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearCancion(fd),
    estadoInicial
  );
  const [plan, setPlan] = useState<{ servicioId: string; elegidas: string[] } | null>(null);

  const servicioEnPlan = servicios.find((s) => s.id === plan?.servicioId);
  const max = SERVICIO_TIPOS.find((t) => t.id === servicioEnPlan?.tipo)?.maxCanciones ?? 6;

  function toggleEnPlan(cancionId: string) {
    if (!plan) return;
    setPlan((prev) => {
      const elegidas = prev!.elegidas.includes(cancionId)
        ? prev!.elegidas.filter((c) => c !== cancionId)
        : prev!.elegidas.length >= max
          ? prev!.elegidas
          : [...prev!.elegidas, cancionId];
      return { ...prev!, elegidas };
    });
  }

  async function guardarSetlist() {
    if (!plan) return;
    const res = await crearSetlist(plan.servicioId, plan.elegidas);
    if (!res.ok) alert(res.error);
    setPlan(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <form action={formCancionAction} className="card">
          <h2 className="font-display text-lg font-bold text-navy">Nueva canción</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="c-titulo" className="label">Título</label>
              <input id="c-titulo" name="titulo" required className="input" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="c-tono" className="label">Tono</label>
                <input id="c-tono" name="tono" className="input" placeholder="Ej: Do / C" />
              </div>
              <div>
                <label htmlFor="c-linkLetra" className="label">Link a letra/acordes</label>
                <input id="c-linkLetra" name="linkLetra" type="url" className="input" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label htmlFor="c-linkPista" className="label">Link a pista</label>
              <input id="c-linkPista" name="linkPista" type="url" className="input" placeholder="https://..." />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <SubmitButton className="btn-teal">
              <Plus className="h-4 w-4" /> Guardar canción
            </SubmitButton>
            <FormResulto estado={estadoCancion} />
          </div>
        </form>

        <div className="card">
          <h2 className="font-display text-lg font-bold text-navy">Planear setlist</h2>
          <p className="mt-1 text-sm text-navy/60">
            Domingo = hasta 6 canciones · Miércoles = hasta 3. Elige un servicio y marca las canciones.
          </p>
          <div className="mt-3">
            <label htmlFor="p-servicio" className="label">Servicio</label>
            <select
              id="p-servicio"
              className="input"
              value={plan?.servicioId ?? ""}
              onChange={(e) => setPlan({ servicioId: e.target.value, elegidas: servicios.find((s) => s.id === e.target.value)?.setlist?.canciones.map((c) => c.cancionId) ?? [] })}
            >
              <option value="">Elegir servicio…</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {servicioTipoLabel(s.tipo)} · {formatFecha(s.fecha)}
                  {s.setlist ? ` (${s.setlist.canciones.length} canciones)` : ""}
                </option>
              ))}
            </select>
          </div>

          {servicioEnPlan && (
            <>
              <div className="mt-3 max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {canciones.map((c) => {
                  const activa = plan?.elegidas.includes(c.id) ?? false;
                  const llena = (plan?.elegidas.length ?? 0) >= max && !activa;
                  return (
                    <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${activa ? "border-teal bg-teal-soft" : llena ? "border-mist bg-mist/20 text-navy/40" : "border-navy/10 bg-white hover:border-teal/40"}`}>
                      <input type="checkbox" checked={activa} disabled={llena} onChange={() => toggleEnPlan(c.id)} className="accent-teal" />
                      <span className="flex-1">
                        {c.titulo} {c.tono && <span className="text-xs text-navy/50">· {c.tono}</span>}
                      </span>
                      {c.vecesUsadas > 0 && (
                        <span className="text-xs text-navy/40" title="Cuántas veces se ha cantado">{(c.vecesUsadas)}x</span>
                      )}
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-navy/50">
                {plan?.elegidas.length ?? 0}/{max} seleccionadas
              </p>
              <button type="button" onClick={guardarSetlist} disabled={(plan?.elegidas.length ?? 0) === 0} className="btn-navy mt-3">
                <ListMusic className="h-4 w-4" /> Guardar setlist
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-navy">Repertorio ({canciones.length})</h2>
        {canciones.length === 0 ? (
          <EmptyState titulo="Sin canciones" detalle="Agrega canciones para empezar a planear setlists." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
            <table className="w-full min-w-[560px]">
              <thead className="border-b border-navy/10 bg-[#fafafa]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy/60">Canción</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy/60">Tono</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy/60">Links</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-navy/60">Veces usada</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {canciones.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 text-sm font-medium text-navy">{c.titulo}</td>
                    <td className="px-4 py-3 text-sm text-navy/70">{c.tono ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 text-xs">
                        {c.linkLetra && (
                          <a href={c.linkLetra} target="_blank" rel="noopener noreferrer" className="font-medium text-teal hover:underline">Letra</a>
                        )}
                        {c.linkPista && (
                          <a href={c.linkPista} target="_blank" rel="noopener noreferrer" className="font-medium text-teal hover:underline">Pista</a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-navy/50">{c.vecesUsadas}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={async () => {
                        if (!confirm(`¿Eliminar "${c.titulo}"?`)) return;
                        await eliminarCancion(c.id);
                        router.refresh();
                      }} className="rounded-lg p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-navy">Historial de setlists</h2>
        {servicios.length === 0 ? (
          <EmptyState titulo="Sin servicios" detalle="Crea servicios desde el módulo de servidores para planear setlists." />
        ) : (
          <div className="space-y-3">
            {servicios.map((s) => (
              <Card key={s.id} className="!p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={s.tipo === "DOMINGO" ? "navy" : s.tipo === "MIERCOLES" ? "teal" : "beige"}>{servicioTipoLabel(s.tipo)}</Badge>
                  <span className="text-sm font-semibold text-navy">{formatFecha(s.fecha)}</span>
                  <span className="text-xs text-navy/50">
                    {s.setlist ? `${s.setlist.canciones.length} canciones` : "Sin setlist"}
                  </span>
                </div>
                {s.setlist && s.setlist.canciones.length > 0 ? (
                  <ol className="mt-3 space-y-1">
                    {s.setlist.canciones.map((c) => (
                      <li key={c.id} className="flex items-center gap-2 text-sm text-navy/80">
                        <MusicIcon className="h-3.5 w-3.5 shrink-0 text-teal" />
                        <span className="text-xs text-navy/40">{c.orden}.</span> {c.titulo}
                        {c.tono && <span className="text-xs text-navy/50">· {c.tono}</span>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-navy/50">Aún no se ha planeado setlist para este servicio.</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}