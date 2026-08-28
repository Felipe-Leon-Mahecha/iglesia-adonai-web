import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { obtenerSesion } from "@/lib/role";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sesion = await obtenerSesion();
  if (!sesion) return null;

  if (!sesion.user.roles || sesion.user.roles.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f7] p-6">
        <div className="card w-full max-w-md text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-coral" />
          <h1 className="mt-4 font-display text-2xl font-bold text-navy">Acceso restringido</h1>
          <p className="mt-3 text-sm leading-relaxed text-navy/65">
            Tu cuenta entró con Google, pero todavía no tiene permisos de administración. Un administrador debe
            asignarte un rol en Usuarios, o escríbenos por WhatsApp para gestionar tu acceso.
          </p>
          <Link href="/" className="btn-outline mt-5">Volver al sitio</Link>
        </div>
      </div>
    );
  }

  return <AdminShell roles={sesion.user.roles}>{children}</AdminShell>;
}