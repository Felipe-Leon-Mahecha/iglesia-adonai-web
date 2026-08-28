import { requiereAdmin } from "@/lib/role";
import { getEventosBautismoAdmin } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { BautismosClient } from "@/components/admin/BautismosClient";

export const dynamic = "force-dynamic";

export default async function BautismosAdminPage() {
  await requiereAdmin();
  const eventos = await getEventosBautismoAdmin();

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Bautismos (interno)"
        descripcion="Eventos de bautizo y gestión de inscritos: confirma, contacta y registra quién tomó la charla."
      />
      <BautismosClient
        eventos={eventos.map((e) => ({
          id: e.id,
          fecha: e.fecha.toISOString(),
          lugar: e.lugar,
          requisitos: e.requisitos,
          inscripciones: e.inscripciones.map((i) => ({
            id: i.id,
            nombre: i.nombre,
            edad: i.edad,
            contacto: i.contacto,
            tomoCharla: i.tomoCharla,
            comentario: i.comentario,
            estado: i.estado,
            createdAt: i.createdAt.toISOString(),
          })),
        }))}
      />
    </div>
  );
}