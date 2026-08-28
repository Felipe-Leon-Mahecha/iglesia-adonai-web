import { requiereRoles } from "@/lib/role";
import { getTransacciones, getCategoriasTransaccion } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { ContabilidadClient } from "@/components/admin/ContabilidadClient";

export const dynamic = "force-dynamic";

export default async function ContabilidadPage() {
  await requiereRoles(["ADMIN", "CONTABILIDAD"]);
  const [transacciones, categorias] = await Promise.all([getTransacciones(), getCategoriasTransaccion()]);

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Contabilidad"
        descripcion="Registro de ingresos (diezmos, ofrendas, donaciones) y egresos. Datos sensibles: admin y usuarios de contabilidad."
      />
      <ContabilidadClient
        transacciones={transacciones.map((t) => ({
          id: t.id,
          tipo: t.tipo,
          monto: t.monto,
          fecha: t.fecha.toISOString(),
          nota: t.nota,
          categoria: { id: t.categoria.id, nombre: t.categoria.nombre, tipo: t.categoria.tipo },
        }))}
        categorias={categorias.map((c) => ({ id: c.id, tipo: c.tipo, nombre: c.nombre, orden: c.orden }))}
      />
    </div>
  );
}