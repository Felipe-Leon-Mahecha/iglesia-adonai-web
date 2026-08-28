import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/role";
import { FormCambiarContrasena } from "@/components/forms/FormCambiarContrasena";

export const metadata: Metadata = {
  title: "Cambiar contraseña",
  robots: { index: false, follow: false },
};

export default async function CambiarContrasenaPage() {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/login");

  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <FormCambiarContrasena />
      </div>
    </div>
  );
}