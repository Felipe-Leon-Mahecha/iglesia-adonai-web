import { requiereRoles } from "@/lib/role";
import { getEventosPublicos, getSermones, getGaleriaFotos } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { ContenidoClient } from "@/components/admin/ContenidoClient";

export const dynamic = "force-dynamic";

export default async function ContenidoPage() {
  await requiereRoles(["ADMIN", "EDITOR"]);
  const [eventos, sermones, fotos] = await Promise.all([
    getEventosPublicos(),
    getSermones(),
    getGaleriaFotos(),
  ]);

  const todosSermones = sermones.flatMap((s) => s.sermones);

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Contenido del sitio web"
        descripcion="Sube y edita eventos, sermones y fotos de la galería que se muestran en el sitio público."
      />
      <ContenidoClient
        eventos={eventos.map((e) => ({
          id: e.id,
          titulo: e.titulo,
          descripcion: e.descripcion,
          lugar: e.lugar,
          fecha: e.fecha.toISOString(),
          imagen: e.imagen,
          requiereInscripcion: e.requiereInscripcion,
          publicado: e.publicado,
        }))}
        sermones={todosSermones.map((s) => ({
          id: s.id,
          titulo: s.titulo,
          serie: s.serie,
          textoBiblico: s.textoBiblico,
          fecha: s.fecha.toISOString(),
          imagen: s.imagen,
          linkAudio: s.linkAudio,
          linkVideo: s.linkVideo,
          publicado: s.publicado,
        }))}
        fotos={fotos.map((f) => ({ id: f.id, url: f.url, descripcion: f.descripcion }))}
      />
    </div>
  );
}