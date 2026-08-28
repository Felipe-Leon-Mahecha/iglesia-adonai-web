import { requiereAdmin } from "@/lib/role";
import { getDiscipulosPorEtapa } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { DiscipuladoClient } from "@/components/admin/DiscipuladoClient";

export const dynamic = "force-dynamic";

export default async function DiscipuladoPage() {
  await requiereAdmin();
  const etapas = await getDiscipulosPorEtapa();

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Discipulado"
        descripcion="Registro de discípulos por etapa y seguimiento de cada sesión."
      />
      <DiscipuladoClient
        etapas={etapas.map((e) => ({
          id: e.id,
          nombre: e.nombre,
          orden: e.orden,
          discipulos: e.discipulos.map((d) => ({
            id: d.id,
            nombre: d.nombre,
            contacto: d.contacto,
            totalSeguimientos: d._count.seguimientos,
            seguimientos: d.seguimientos.map((s) => ({ fecha: s.fecha.toISOString(), nota: s.nota })),
          })),
        }))}
      />
    </div>
  );
}