import { requiereRoles } from "@/lib/role";
import { getServidores, getServicios } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { ServidoresClient } from "@/components/admin/ServidoresClient";

export const dynamic = "force-dynamic";

export default async function ServidoresPage() {
  await requiereRoles(["ADMIN", "LOGISTICA"]);
  const [servidores, servicios] = await Promise.all([getServidores(), getServicios()]);

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Servidores y logística"
        descripcion="Equipo de servicio (sonido, video, streaming, ujier...) y asignación por servicio."
      />
      <ServidoresClient
        servidores={servidores.map((s) => ({
          id: s.id,
          nombre: s.nombre,
          telefono: s.telefono,
          correo: s.correo,
          rolesServicio: s.rolesServicio,
          totalAsignaciones: s._count.asignaciones,
        }))}
        servicios={servicios.map((sv) => ({
          id: sv.id,
          tipo: sv.tipo,
          fecha: sv.fecha.toISOString(),
          asignaciones: sv.asignaciones.map((a) => ({
            id: a.id,
            rolServicio: a.rolServicio,
            servidorNombre: a.servidor.nombre,
            servidorId: a.servidor.id,
          })),
        }))}
      />
    </div>
  );
}