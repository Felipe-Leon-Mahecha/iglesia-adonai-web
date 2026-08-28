"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, Trash2, FileSpreadsheet } from "lucide-react";
import { crearTransaccion, eliminarTransaccion, crearCategoria, eliminarCategoria } from "@/lib/actions/admin-contabilidad";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { Badge, Card, EmptyState, Td, Th } from "@/components/admin/ui";
import { formatCOP, formatFechaCorta } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

export type TransaccionRow = {
  id: string;
  tipo: string;
  monto: number;
  fecha: string;
  nota: string | null;
  categoria: { id: string; nombre: string; tipo: string };
};
export type CategoriaRow = { id: string; tipo: string; nombre: string; orden: number };

const estadoInicial: ActionState = { ok: false };

function fechaInput(value: string) {
  return value.slice(0, 10);
}

export function ContabilidadClient({
  transacciones,
  categorias,
}: {
  transacciones: TransaccionRow[];
  categorias: CategoriaRow[];
}) {
  const router = useRouter();
  const [estado, formAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearTransaccion(fd),
    estadoInicial
  );
  const [estadoCat, formCatAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearCategoria(fd),
    estadoInicial
  );
  const [tipo, setTipo] = useState<"INGRESO" | "EGRESO">("INGRESO");
  const [filtroMes, setFiltroMes] = useState("");
  const [verCategorias, setVerCategorias] = useState(false);

  const catFiltradas = categorias.filter((c) => c.tipo === tipo);

  const filtradas = useMemo(() => {
    if (!filtroMes) return transacciones;
    return transacciones.filter((t) => fechaInput(t.fecha).startsWith(filtroMes));
  }, [transacciones, filtroMes]);

  const resumen = useMemo(() => {
    const base = filtroMes ? filtradas : transacciones;
    const ingresos = base.reduce((a, t) => (t.tipo === "INGRESO" ? a + t.monto : a), 0);
    const egresos = base.reduce((a, t) => (t.tipo === "EGRESO" ? a + t.monto : a), 0);
    return { ingresos, egresos, balance: ingresos - egresos };
  }, [filtradas, transacciones, filtroMes]);

  function descargarCSV() {
    const filas = [
      ["Fecha", "Tipo", "Categoría", "Monto (COP)", "Nota"],
      ...filtradas.map((t) => [
        t.fecha,
        t.tipo,
        t.categoria.nombre,
        String(t.monto),
        t.nota ?? "",
      ]),
    ];
    const csv = filas
      .map((f) => f.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contabilidad-adonai-${filtroMes || "total"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function borrarTransaccion(id: string) {
    if (!confirm("¿Eliminar esta transacción?")) return;
    await eliminarTransaccion(id);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <form
        action={(fd) => {
          fd.set("tipo", tipo);
          formAction(fd);
        }}
        className="card"
      >
        <h2 className="font-display text-lg font-bold text-navy">Registrar movimiento</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="label">Tipo</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setTipo("INGRESO")} className={tipo === "INGRESO" ? "chip bg-teal text-white" : "chip border border-navy/15 bg-white text-navy/70"}>
                Ingreso
              </button>
              <button type="button" onClick={() => setTipo("EGRESO")} className={tipo === "EGRESO" ? "chip bg-coral text-white" : "chip border border-navy/15 bg-white text-navy/70"}>
                Egreso
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="tx-categoria" className="label">Categoría</label>
            <select id="tx-categoria" name="categoriaId" className="input" required>
              {catFiltradas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tx-monto" className="label">Monto (COP)</label>
            <input id="tx-monto" name="monto" type="number" min={1} required className="input" placeholder="50000" />
          </div>
          <div>
            <label htmlFor="tx-fecha" className="label">Fecha</label>
            <input id="tx-fecha" name="fecha" type="datetime-local" required className="input" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="tx-nota" className="label">Nota</label>
          <input id="tx-nota" name="nota" className="input" placeholder="Ej: ofrenda de la reunión del domingo" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <SubmitButton className="btn-navy">
            <Plus className="h-4 w-4" /> Registrar
          </SubmitButton>
          <FormResulto estado={estado} />
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <input type="month" value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} className="input !w-auto" aria-label="Filtrar por mes" />
        {filtroMes && (
          <button type="button" onClick={() => setFiltroMes("")} className="text-sm text-navy/60 hover:text-navy">
            Limpiar filtro
          </button>
        )}
        <button type="button" onClick={() => setVerCategorias((v) => !v)} className="chip ml-auto border border-navy/15 bg-white text-navy/70 hover:bg-navy/5">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Gestionar categorías
        </button>
        <button type="button" onClick={descargarCSV} disabled={filtradas.length === 0} className="btn-teal !py-2 !text-xs">
          <Download className="h-3.5 w-3.5" /> Exportar CSV
        </button>
      </div>

      {verCategorias && (
        <Card>
          <h3 className="font-display text-base font-bold text-navy">Categorías</h3>
          <form
            action={(fd) => {
              fd.set("tipo", tipo);
              formCatAction(fd);
            }}
            className="mt-3 flex flex-wrap items-end gap-2"
          >
            <div>
              <span className="label">Tipo ({tipo === "INGRESO" ? "Ingreso" : "Egreso"})</span>
            </div>
            <div className="min-w-44">
              <label htmlFor="cat-nombre" className="label">Nombre</label>
              <input id="cat-nombre" name="nombre" required className="input" placeholder="Ej: Mercado" />
            </div>
            <SubmitButton className="btn-teal !py-2.5 !text-xs">Crear categoría</SubmitButton>
            <FormResulto estado={estadoCat} />
          </form>
          <ul className="mt-3 space-y-1.5">
            {categorias.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg border border-navy/5 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <Badge color={c.tipo === "INGRESO" ? "teal" : "coral"}>{c.tipo === "INGRESO" ? "Ingreso" : "Egreso"}</Badge>
                  {c.nombre}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    const r = await eliminarCategoria(c.id);
                    if (r.ok) router.refresh();
                    else alert(r.error);
                  }}
                  className="rounded-lg p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral"
                  title="Eliminar categoría"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="!py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">Ingresos</p>
          <p className="mt-1 font-display text-2xl font-bold text-teal">{formatCOP(resumen.ingresos)}</p>
        </Card>
        <Card className="!py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">Egresos</p>
          <p className="mt-1 font-display text-2xl font-bold text-coral">{formatCOP(resumen.egresos)}</p>
        </Card>
        <Card className="!py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">Balance</p>
          <p className={`mt-1 font-display text-2xl font-bold ${resumen.balance >= 0 ? "text-navy" : "text-coral"}`}>{formatCOP(resumen.balance)}</p>
        </Card>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState titulo="Sin movimientos" detalle="Registra la primera transacción para ver el historial." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-navy/10 bg-[#fafafa]">
              <tr>
                <Th>Fecha</Th>
                <Th>Tipo</Th>
                <Th>Categoría</Th>
                <Th className="text-right">Monto</Th>
                <Th>Nota</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filtradas.map((t) => (
                <tr key={t.id}>
                  <Td className="whitespace-nowrap">{formatFechaCorta(t.fecha)}</Td>
                  <Td>
                    <Badge color={t.tipo === "INGRESO" ? "teal" : "coral"}>{t.tipo === "INGRESO" ? "Ingreso" : "Egreso"}</Badge>
                  </Td>
                  <Td>{t.categoria.nombre}</Td>
                  <Td className="whitespace-nowrap text-right font-semibold">{formatCOP(t.monto)}</Td>
                  <Td className="max-w-[220px] truncate text-navy/60">{t.nota ?? "—"}</Td>
                  <Td>
                    <button type="button" onClick={() => borrarTransaccion(t.id)} className="rounded-lg p-1.5 text-navy/40 hover:bg-coral-soft hover:text-coral" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}