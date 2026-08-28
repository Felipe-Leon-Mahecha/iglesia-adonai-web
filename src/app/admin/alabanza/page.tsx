import { requiereRoles } from "@/lib/role";
import { getCanciones, getServicios } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { AlabanzaClient } from "@/components/admin/AlabanzaClient";

export const dynamic = "force-dynamic";

export default async function AlabanzaPage() {
  await requiereRoles(["ADMIN", "ALABANZA"]);
  const [canciones, servicios] = await Promise.all([getCanciones(), getServicios()]);

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Alabanza"
        descripcion="Repertorio de canciones y planeador de setlists por servicio (domingo = 6, miércoles = 3)."
      />
      <AlabanzaClient
        canciones={canciones.map((c) => ({
          id: c.id,
          titulo: c.titulo,
          tono: c.tono,
          linkLetra: c.linkLetra,
          linkPista: c.linkPista,
          vecesUsadas: c._count.setlistCanciones,
        }))}
        servicios={servicios.map((s) => ({
          id: s.id,
          tipo: s.tipo,
          fecha: s.fecha.toISOString(),
          setlist: s.setlist
            ? {
                id: s.setlist.id,
                canciones: s.setlist.canciones.map((sc) => ({
                  id: sc.id,
                  cancionId: sc.cancionId,
                  orden: sc.orden,
                  titulo: sc.cancion.titulo,
                  tono: sc.cancion.tono,
                })),
              }
            : null,
        }))}
      />
    </div>
  );
}