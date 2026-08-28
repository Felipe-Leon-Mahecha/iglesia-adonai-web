import { requiereAdmin } from "@/lib/role";
import { getUsuarios } from "@/lib/queries";
import { PageHeader } from "@/components/admin/ui";
import { UsuariosClient } from "@/components/admin/UsuariosClient";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const sesion = await requiereAdmin();
  const usuarios = await getUsuarios();

  return (
    <div className="space-y-4">
      <PageHeader
        titulo="Usuarios del staff"
        descripcion="Crea cuentas y asigna roles. Recuerda: los roles se validan en el servidor, no solo en el menú."
      />
      {sesion && (
        <UsuariosClient
          yoId={sesion.user.id}
          usuarios={usuarios.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            roles: u.roles,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}