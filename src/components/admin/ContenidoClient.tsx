"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, ImagePlus, CalendarDays, Mic2 } from "lucide-react";
import {
  crearEventoAction,
  eliminarEvento,
  crearSermonAction,
  eliminarSermon,
  agregarFotoGaleria,
  eliminarFotoGaleria,
} from "@/lib/actions/admin-general";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };

export type EventoRow = { id: string; titulo: string; descripcion: string; lugar: string | null; fecha: string; imagen: string | null; requiereInscripcion: boolean; publicado: boolean };
export type SermonRow = { id: string; titulo: string; serie: string; textoBiblico: string | null; fecha: string; imagen: string | null; linkAudio: string | null; linkVideo: string | null; publicado: boolean };
export type FotoRow = { id: string; url: string; descripcion: string | null };

function fechaLocal(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

function FormEvento({ evento, onClose }: { evento?: EventoRow; onClose?: () => void }) {
  const [estado, formAction] = useActionState(
    (prev: ActionState, fd: FormData) => crearEventoAction(fd, evento?.id),
    estadoInicial
  );
  return (
    <form action={formAction} className="card border-teal/40">
      <h2 className="font-display text-lg font-bold text-navy">{evento ? "Editar evento" : "Nuevo evento"}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Título</label>
          <input name="titulo" required defaultValue={evento?.titulo} className="input" />
        </div>
        <div>
          <label className="label">Fecha</label>
          <input name="fecha" type="datetime-local" required defaultValue={evento ? fechaLocal(evento.fecha) : ""} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Descripción</label>
          <textarea name="descripcion" required rows={3} defaultValue={evento?.descripcion} className="input resize-y" />
        </div>
        <div>
          <label className="label">Lugar</label>
          <input name="lugar" defaultValue={evento?.lugar ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Imagen (URL)</label>
          <input name="imagen" type="url" defaultValue={evento?.imagen ?? ""} className="input" placeholder="https://..." />
        </div>
        <div>
          <label className="label">Fín (opcional)</label>
          <input name="fechaFin" type="datetime-local" className="input" />
        </div>
        <div>
          <span className="label">Inscripción</span>
          <select name="requiereInscripcion" defaultValue={evento ? (evento.requiereInscripcion ? "si" : "no") : "si"} className="input">
            <option value="si">Sí, pedir inscripción</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <span className="label">Publicado</span>
          <select name="publicado" defaultValue={evento ? (evento.publicado ? "si" : "no") : "si"} className="input">
            <option value="si">Publicado</option>
            <option value="no">Borrador</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SubmitButton className="btn-teal">
          <Plus className="h-4 w-4" /> {evento ? "Guardar cambios" : "Crear evento"}
        </SubmitButton>
        <FormResulto estado={estado} />
        {evento && onClose && (
          <button type="button" onClick={onClose} className="btn-outline !py-2 !text-xs">Cerrar</button>
        )}
      </div>
    </form>
  );
}

function FormSermon({ sermon, onClose }: { sermon?: SermonRow; onClose?: () => void }) {
  const [estado, formAction] = useActionState(
    (prev: ActionState, fd: FormData) => crearSermonAction(fd, sermon?.id),
    estadoInicial
  );
  return (
    <form action={formAction} className="card border-teal/40">
      <h2 className="font-display text-lg font-bold text-navy">{sermon ? "Editar sermón" : "Nuevo sermón"}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Título</label>
          <input name="titulo" required defaultValue={sermon?.titulo} className="input" />
        </div>
        <div>
          <label className="label">Serie</label>
          <input name="serie" required defaultValue={sermon?.serie ?? "Sin serie"} className="input" />
        </div>
        <div>
          <label className="label">Fecha</label>
          <input name="fecha" type="date" required defaultValue={sermon ? fechaLocal(sermon.fecha).slice(0, 10) : ""} className="input" />
        </div>
        <div>
          <label className="label">Texto bíblico</label>
          <input name="textoBiblico" defaultValue={sermon?.textoBiblico ?? ""} className="input" placeholder="Ej: Isaías 43:19" />
        </div>
        <div>
          <label className="label">Link de video</label>
          <input name="linkVideo" type="url" defaultValue={sermon?.linkVideo ?? ""} className="input" placeholder="https://youtube.com/..." />
        </div>
        <div>
          <label className="label">Link de audio</label>
          <input name="linkAudio" type="url" defaultValue={sermon?.linkAudio ?? ""} className="input" placeholder="https://..." />
        </div>
        <div>
          <label className="label">Imagen (URL)</label>
          <input name="imagen" type="url" defaultValue={sermon?.imagen ?? ""} className="input" placeholder="https://..." />
        </div>
        <div>
          <span className="label">Publicado</span>
          <select name="publicado" defaultValue={sermon ? (sermon.publicado ? "si" : "no") : "si"} className="input">
            <option value="si">Publicado</option>
            <option value="no">Borrador</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SubmitButton className="btn-teal">
          <Plus className="h-4 w-4" /> {sermon ? "Guardar cambios" : "Crear sermón"}
        </SubmitButton>
        <FormResulto estado={estado} />
        {sermon && onClose && (
          <button type="button" onClick={onClose} className="btn-outline !py-2 !text-xs">Cerrar</button>
        )}
      </div>
    </form>
  );
}

export function ContenidoClient({ eventos, sermones, fotos }: { eventos: EventoRow[]; sermones: SermonRow[]; fotos: FotoRow[] }) {
  const router = useRouter();
  const [crearEvento, setCrearEvento] = useState(false);
  const [crearSermon, setCrearSermon] = useState(false);
  const [editarEvento, setEditarEvento] = useState<EventoRow | null>(null);
  const [editarSermon, setEditarSermon] = useState<SermonRow | null>(null);
  const [estadoFoto, formFotoAction] = useActionState(
    (_prev: ActionState, fd: FormData) => agregarFotoGaleria(fd),
    estadoInicial
  );
  const [pestaña, setPestaña] = useState<"eventos" | "sermones" | "galeria">("eventos");

  const pestañas = [
    { id: "eventos", label: "Eventos", icon: CalendarDays },
    { id: "sermones", label: "Sermones", icon: Mic2 },
    { id: "galeria", label: "Galería", icon: ImagePlus },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {pestañas.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setPestaña(t.id)}
            className={pestaña === t.id ? "chip bg-navy text-white" : "chip border border-navy/15 bg-white text-navy/70 hover:bg-navy/5"}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {pestaña === "eventos" && (
        <div className="space-y-4">
          <button type="button" onClick={() => setCrearEvento((v) => !v)} className="btn-teal">
            <Plus className="h-4 w-4" /> Nuevo evento
          </button>
          {crearEvento && <FormEvento onClose={() => setCrearEvento(false)} />}
          {editarEvento && <FormEvento evento={editarEvento} onClose={() => setEditarEvento(null)} />}

          {eventos.length === 0 ? (
            <EmptyState titulo="Sin eventos" />
          ) : (
            <div className="space-y-2">
              {eventos.map((e) => (
                <Card key={e.id} className="flex flex-wrap items-center gap-3 !p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy">{e.titulo}</p>
                    <p className="text-xs text-navy/50">
                      {formatFecha(e.fecha, true)} {e.lugar ? `· ${e.lugar}` : ""}
                    </p>
                  </div>
                  {e.requiereInscripcion && <Badge color="teal">Inscripción</Badge>}
                  {e.publicado ? <Badge color="sage">Publicado</Badge> : <Badge color="gray">Borrador</Badge>}
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setEditarEvento(e)} className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-navy/5" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={async () => { if (confirm("¿Eliminar evento?")) { await eliminarEvento(e.id); router.refresh(); } }} className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-coral-soft hover:text-coral" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {pestaña === "sermones" && (
        <div className="space-y-4">
          <button type="button" onClick={() => setCrearSermon((v) => !v)} className="btn-teal">
            <Plus className="h-4 w-4" /> Nuevo sermón
          </button>
          {crearSermon && <FormSermon onClose={() => setCrearSermon(false)} />}
          {editarSermon && <FormSermon sermon={editarSermon} onClose={() => setEditarSermon(null)} />}

          {sermones.length === 0 ? (
            <EmptyState titulo="Sin sermones" />
          ) : (
            <div className="space-y-2">
              {sermones.map((s) => (
                <Card key={s.id} className="flex flex-wrap items-center gap-3 !p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy">{s.titulo}</p>
                    <p className="text-xs text-navy/50">
                      {s.serie} · {formatFecha(s.fecha)}
                    </p>
                  </div>
                  {s.publicado ? <Badge color="sage">Publicado</Badge> : <Badge color="gray">Borrador</Badge>}
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setEditarSermon(s)} className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-navy/5" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={async () => { if (confirm("¿Eliminar sermón?")) { await eliminarSermon(s.id); router.refresh(); } }} className="rounded-lg border border-navy/15 p-2 text-navy/60 hover:bg-coral-soft hover:text-coral" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {pestaña === "galeria" && (
        <div className="space-y-4">
          <form action={formFotoAction} className="card">
            <h2 className="font-display text-lg font-bold text-navy">Agregar foto a la galería</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">URL de la imagen</label>
                <input name="url" type="url" required className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="label">Descripción (opcional)</label>
                <input name="descripcion" className="input" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <SubmitButton className="btn-teal">
                <ImagePlus className="h-4 w-4" /> Agregar foto
              </SubmitButton>
              <FormResulto estado={estadoFoto} />
            </div>
          </form>

          {fotos.length === 0 ? (
            <EmptyState titulo="Galería vacía" />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {fotos.map((f) => (
                <div key={f.id} className="group relative overflow-hidden rounded-xl border border-navy/10">
                  <img src={f.url} alt={f.descripcion ?? "Foto de la galería"} className="aspect-square w-full object-cover" />
                  <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-navy/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="max-w-[70%] truncate text-xs text-white">{f.descripcion ?? "Galería"}</p>
                    <button
                      type="button"
                      onClick={async () => { if (confirm("¿Eliminar foto?")) { await eliminarFotoGaleria(f.id); router.refresh(); } }}
                      className="rounded-lg bg-coral/90 p-1.5 text-white hover:bg-coral"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}