import { requiereAdmin } from "@/lib/role";
import { getCohortesAdmin } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { CasasOasisClient } from "@/components/admin/CasasOasisClient";

export const dynamic = "force-dynamic";

export default async function CasasOasisAdminPage() {
  await requiereAdmin();
  const cohortes = await getCohortesAdmin();

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Casas Oasis (interno)"
        descripcion="Gestiona cohortes y el estado de cada inscripción."
      />
      <CasasOasisClient
        cohortes={cohortes.map((c) => ({
          id: c.id,
          fechaInicio: c.fechaInicio.toISOString(),
          fechaFin: c.fechaFin.toISOString(),
          cupo: c.cupo,
          activa: c.activa,
          inscripciones: c.inscripciones.map((i) => ({
            id: i.id,
            nombre: i.nombre,
            contacto: i.contacto,
            comentario: i.comentario,
            estado: i.estado,
            createdAt: i.createdAt.toISOString(),
          })),
        }))}
      />
    </div>
  );
}