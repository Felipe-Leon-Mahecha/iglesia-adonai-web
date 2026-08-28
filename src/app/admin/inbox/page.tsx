import { requiereAdmin } from "@/lib/role";
import { getMensajesContacto } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { InboxClient } from "@/components/admin/InboxClient";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  await requiereAdmin();
  const mensajes = await getMensajesContacto();
  const categorias = Array.from(new Set(mensajes.map((m) => m.categoria)));

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Inbox de contacto"
        descripcion="Todos los mensajes que llegan de los formularios públicos, por categoría."
      />
      <InboxClient
        mensajes={mensajes.map((m) => ({
          id: m.id,
          nombre: m.nombre,
          contacto: m.contacto,
          categoria: m.categoria,
          mensaje: m.mensaje,
          estado: m.estado,
          createdAt: m.createdAt.toISOString(),
        }))}
        categorias={categorias}
      />
    </div>
  );
}