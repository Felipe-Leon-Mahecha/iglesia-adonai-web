"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, Inbox as InboxIcon, RefreshCw } from "lucide-react";
import { cambiarEstadoMensajes, marcarMensaje } from "@/lib/actions/admin-general";
import { categoriaLabel } from "@/lib/catalog";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { formatFecha } from "@/lib/utils";

export type MensajeRow = {
  id: string;
  nombre: string;
  contacto: string;
  categoria: string;
  mensaje: string;
  estado: string;
  createdAt: string;
};

export function InboxClient({ mensajes, categorias }: { mensajes: MensajeRow[]; categorias: string[] }) {
  const router = useRouter();
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  const filtrados = useMemo(
    () =>
      mensajes.filter(
        (m) =>
          (filtroCategoria === "TODAS" || m.categoria === filtroCategoria) &&
          (filtroEstado === "TODOS" || m.estado === filtroEstado)
      ),
    [mensajes, filtroCategoria, filtroEstado]
  );

  const pendientes = mensajes.filter((m) => m.estado === "PENDIENTE").length;

  function toggle(ids: string[]) {
    setSeleccionados((prev) => {
      const set = new Set(prev);
      for (const id of ids) {
        if (set.has(id)) set.delete(id);
        else set.add(id);
      }
      return Array.from(set);
    });
  }

  async function aplicarBulk(estado: string) {
    if (seleccionados.length === 0) return;
    setOcupado(true);
    await cambiarEstadoMensajes(seleccionados, estado);
    setOcupado(false);
    setSeleccionados([]);
    router.refresh();
  }

  async function toggleUno(m: MensajeRow) {
    setOcupado(true);
    await marcarMensaje("estado", m.estado === "PENDIENTE" ? "ATENDIDO" : "PENDIENTE", m.id);
    setOcupado(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["TODAS", ...categorias].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFiltroCategoria(c)}
              className={
                filtroCategoria === c
                  ? "chip bg-navy text-white"
                  : "chip border border-navy/15 bg-white text-navy/70 hover:bg-navy/5"
              }
            >
              {c === "TODAS" ? "Todas" : categoriaLabel(c)}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <button
            type="button"
            onClick={() => setFiltroEstado("TODOS")}
            className={filtroEstado === "TODOS" ? "chip bg-mist/60 text-navy" : "chip border border-navy/15 bg-white text-navy/70"}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("PENDIENTE")}
            className={filtroEstado === "PENDIENTE" ? "chip bg-coral text-white" : "chip border border-coral/30 bg-white text-coral"}
          >
            Pendientes ({pendientes})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("ATENDIDO")}
            className={filtroEstado === "ATENDIDO" ? "chip bg-teal text-white" : "chip border border-teal/30 bg-white text-teal"}
          >
            Atendidos
          </button>
        </div>
      </div>

      {seleccionados.length > 0 && (
        <Card className="flex flex-wrap items-center gap-2 !p-3">
          <span className="text-sm font-medium text-navy">{seleccionados.length} seleccionados</span>
          <button type="button" disabled={ocupado} onClick={() => aplicarBulk("ATENDIDO")} className="btn-teal !py-1.5 !text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Marcar atendidos
          </button>
          <button type="button" disabled={ocupado} onClick={() => aplicarBulk("PENDIENTE")} className="btn-outline !py-1.5 !text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Volver a pendientes
          </button>
          <button type="button" onClick={() => setSeleccionados([])} className="ml-auto text-sm text-navy/60 hover:text-navy">
            Limpiar
          </button>
        </Card>
      )}

      {filtrados.length === 0 ? (
        <EmptyState titulo="No hay mensajes aquí" detalle="Cuando alguien use el formulario de contacto, aparecerá en esta bandeja." />
      ) : (
        <ul className="space-y-2">
          {filtrados.map((m) => {
            const esNuevo = m.estado === "PENDIENTE";
            return (
              <li key={m.id} className="overflow-hidden rounded-xl border border-navy/10 bg-white">
                <div className="flex items-center gap-3 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(m.id)}
                    onChange={() => toggle([m.id])}
                    className="h-4 w-4 accent-teal"
                    aria-label={`Seleccionar mensaje de ${m.nombre}`}
                  />
                  <span className={cnEsNuevo(esNuevo)} />
                  <button type="button" onClick={() => setAbierto(abierto === m.id ? null : m.id)} className="flex flex-1 items-center gap-3 text-left">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">
                        {m.nombre} <span className="font-normal text-navy/50">· {m.contacto}</span>
                      </p>
                      <p className="truncate text-xs text-navy/50">{m.mensaje}</p>
                    </div>
                    <span className="hidden shrink-0 text-xs text-navy/40 md:block">{formatFecha(m.createdAt)}</span>
                    <Badge color={esNuevo ? "coral" : "teal"}>{esNuevo ? "Pendiente" : "Atendido"}</Badge>
                  </button>
                  <button
                    type="button"
                    disabled={ocupado}
                    onClick={() => toggleUno(m)}
                    className="shrink-0 rounded-lg border border-navy/15 p-2 text-navy/70 transition-colors hover:bg-navy/5 disabled:opacity-50"
                    title={esNuevo ? "Marcar atendido" : "Volver a pendiente"}
                  >
                    {esNuevo ? <CheckCircle2 className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                  </button>
                </div>
                {abierto === m.id && (
                  <div className="border-t border-navy/10 px-4 py-4">
                    <Badge color="beige" className="mb-3">{categoriaLabel(m.categoria)}</Badge>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy/80">{m.mensaje}</p>
                    <a href={`mailto:${m.contacto}`} className="btn-outline mt-4 !py-2 !text-xs">
                      Responder por correo
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center gap-2 text-xs text-navy/50">
        <RefreshCw className="h-3 w-3" /> La bandeja se refresca tras cada cambio.
        {mensajes.length === 0 && <InboxIcon className="h-3 w-3" />}
      </div>
    </div>
  );
}

function cnEsNuevo(nuevo: boolean) {
  return nuevo
    ? "h-2 w-2 shrink-0 rounded-full bg-coral"
    : "h-2 w-2 shrink-0 rounded-full bg-mist";
}