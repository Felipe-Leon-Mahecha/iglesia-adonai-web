"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ClipboardPlus } from "lucide-react";
import {
  crearServidor,
  eliminarServidor,
  actualizarRolesServidor,
  crearServicio,
  eliminarServicio,
  agregarAsignacion,
} from "@/lib/actions/admin-equipos";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { ROLES_SERVICIO, SERVICIO_TIPOS, servicioTipoLabel } from "@/lib/catalog";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export type ServidorRow = { id: string; nombre: string; telefono: string | null; correo: string | null; rolesServicio: string[]; totalAsignaciones: number };
export type AsignacionRow = { id: string; rolServicio: string; servidorNombre: string; servidorId: string };
export type ServicioRow = { id: string; tipo: string; fecha: string; asignaciones: AsignacionRow[] };

export function ServidoresClient({
  servidores,
  servicios,
}: {
  servidores: ServidorRow[];
  servicios: ServicioRow[];
}) {
  const router = useRouter();
  const [estadoServidor, formServidorAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearServidor(fd),
    estadoInicial
  );
  const [estadoServicio, formServicioAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearServicio(fd),
    estadoInicial
  );
  const [asignar, setAsignar] = useState<{ servicioId: string; servidorId: string; rolServicio: string } | null>(null);

  const rolesDisponibles = [...ROLES_SERVICIO];

  async function toggleRolServidor(s: ServidorRow, rol: string, on: boolean) {
    const roles = on ? [...new Set([...s.rolesServicio, rol])] : s.rolesServicio.filter((r) => r !== rol);
    const res = await actualizarRolesServidor(s.id, roles);
    if (res.ok) router.refresh();
  }

  async function crearAsignacion() {
    if (!asignar || !asignar.servicioId || !asignar.servidorId || !asignar.rolServicio) return;
    const res = await agregarAsignacion(asignar.servicioId, asignar.servidorId, asignar.rolServicio);
    if (!res.ok) alert(res.error);
    setAsignar(null);
    router.refresh();
  }

  const fechaHoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <form action={formServidorAction} className="card">
          <h2 className="font-display text-lg font-bold text-navy">Agregar servidor</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="sv-nombre" className="label">Nombre</label>
              <input id="sv-nombre" name="nombre" required className="input" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="sv-telefono" className="label">Teléfono</label>
                <input id="sv-telefono" name="telefono" className="input" />
              </div>
              <div>
                <label htmlFor="sv-correo" className="label">Correo</label>
                <input id="sv-correo" name="correo" type="email" className="input" />
              </div>
            </div>
            <div>
              <span className="label">Roles que puede servir</span>
              <div className="flex flex-wrap gap-2">
                {rolesDisponibles.map((r) => (
                  <label key={r} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 text-xs font-medium text-navy/70 transition-colors hover:border-navy/30">
                    <input type="checkbox" name="roles" value={r} className="accent-teal" />
                    {r}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <SubmitButton className="btn-teal">
              <Plus className="h-4 w-4" /> Agregar
            </SubmitButton>
            <FormResulto estado={estadoServidor} />
          </div>
        </form>

        <form action={formServicioAction} className="card">
          <h2 className="font-display text-lg font-bold text-navy">Crear servicio</h2>
          <div className="mt-4 space-y-3">
            <div>
              <span className="label">Tipo</span>
              <div className="flex gap-2">
                {SERVICIO_TIPOS.map((t) => (
                  <label key={t.id} className="inline-flex cursor-pointer items-center gap-2 text-sm text-navy/80">
                    <input type="radio" name="tipo" value={t.id} required className="accent-teal" /> {t.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="svc-fecha" className="label">Fecha</label>
              <input id="svc-fecha" name="fecha" type="date" required defaultValue={fechaHoy} className="input" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <SubmitButton className="btn-navy">
              <Plus className="h-4 w-4" /> Crear servicio
            </SubmitButton>
            <FormResulto estado={estadoServicio} />
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-navy">Servidores ({servidores.length})</h2>
        {servidores.length === 0 ? (
          <EmptyState titulo="Sin servidores" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servidores.map((s) => (
              <Card key={s.id} className="space-y-3 !p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-navy">{s.nombre}</p>
                    <p className="text-xs text-navy/50">{[s.telefono, s.correo].filter(Boolean).join(" · ") || "Sin contacto"}</p>
                  </div>
                  <button type="button" onClick={async () => { await eliminarServidor(s.id); router.refresh(); }} className="rounded-lg p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral" title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-navy/40">Puede servir en</p>
                  <div className="flex flex-wrap gap-1.5">
                    {rolesDisponibles.map((r) => (
                      <label key={r} className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors ${s.rolesServicio.includes(r) ? "border-teal bg-teal-soft text-[#146b60]" : "border-mist bg-white text-navy/40 hover:border-teal/40"}`}>
                        <input
                          type="checkbox"
                          checked={s.rolesServicio.includes(r)}
                          onChange={(e) => toggleRolServidor(s, r, e.target.checked)}
                          className="sr-only"
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-navy/50">{s.totalAsignaciones} asignaciones</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-navy">Servicios y asignaciones</h2>
          {asignar && (
            <button type="button" onClick={() => setAsignar(null)} className="text-sm text-navy/60 hover:text-navy">Cancelar</button>
          )}
        </div>

        {asignar && servidores.length > 0 && (
          <div className="mb-4 grid gap-3 rounded-xl border border-teal/30 bg-teal-soft p-4 sm:grid-cols-3">
            <div>
              <label className="label">Servicio</label>
              <select className="input" value={asignar.servicioId} onChange={(e) => setAsignar({ ...asignar, servicioId: e.target.value })}>
                <option value="">Elegir…</option>
                {servicios.map((sv) => (
                  <option key={sv.id} value={sv.id}>{servicioTipoLabel(sv.tipo)} · {formatFecha(sv.fecha)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Servidor</label>
              <select className="input" value={asignar.servidorId} onChange={(e) => setAsignar({ ...asignar, servidorId: e.target.value })}>
                <option value="">Elegir…</option>
                {servidores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Rol</label>
              <select className="input" value={asignar.rolServicio} onChange={(e) => setAsignar({ ...asignar, rolServicio: e.target.value })}>
                <option value="">Elegir…</option>
                {rolesDisponibles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={crearAsignacion} disabled={!asignar.servicioId || !asignar.servidorId || !asignar.rolServicio} className="btn-teal sm:col-span-3">
              <ClipboardPlus className="h-4 w-4" /> Asignar
            </button>
          </div>
        )}

        {servicios.length === 0 ? (
          <EmptyState titulo="Sin servicios programados" />
        ) : (
          <div className="space-y-3">
            {servicios.map((sv) => {
              const porRol = new Map<string, string[]>();
              for (const a of sv.asignaciones) {
                const lista = porRol.get(a.rolServicio) ?? [];
                lista.push(a.servidorNombre);
                porRol.set(a.rolServicio, lista);
              }
              return (
                <Card key={sv.id} className="!p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color={sv.tipo === "DOMINGO" ? "navy" : sv.tipo === "MIERCOLES" ? "teal" : "beige"}>{servicioTipoLabel(sv.tipo)}</Badge>
                    <span className="text-sm font-semibold text-navy">{formatFecha(sv.fecha)}</span>
                    <span className="text-xs text-navy/50">{sv.asignaciones.length} asignaciones</span>
                    <div className="ml-auto flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAsignar({ servicioId: sv.id, servidorId: servidores[0]?.id ?? "", rolServicio: rolesDisponibles[0] })}
                        className="rounded-lg border border-teal/40 px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal-soft"
                        disabled={servidores.length === 0}
                      >
                        Asignar
                      </button>
                      <button type="button" onClick={async () => { await eliminarServicio(sv.id); router.refresh(); }} className="rounded-lg p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral" title="Eliminar servicio">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {sv.asignaciones.length === 0 ? (
                    <p className="mt-3 text-sm text-navy/50">Sin asignaciones todavía.</p>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from(porRol.entries()).map(([rol, nombres]) => (
                        <span key={rol} className="chip border border-navy/15 bg-white">
                          <span className="font-semibold text-navy">{rol}:</span> {nombres.join(", ")}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}