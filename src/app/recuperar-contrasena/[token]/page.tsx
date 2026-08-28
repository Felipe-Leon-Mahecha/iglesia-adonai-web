import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { FormRestablecer } from "@/components/forms/FormRestablecer";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
};

export default async function RestablecerContrasenaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!db) {
    return (
      <div className="container-site flex min-h-[60vh] items-center justify-center py-16">
        <EnlaceInvalido />
      </div>
    );
  }

  const registro = await db.verificationToken.findFirst({ where: { token } });
  if (!registro || registro.expires < new Date()) {
    return (
      <div className="container-site flex min-h-[60vh] items-center justify-center py-16">
        <EnlaceInvalido />
      </div>
    );
  }

  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <FormRestablecer token={token} />
      </div>
    </div>
  );
}

function EnlaceInvalido() {
  return (
    <div className="card w-full max-w-md text-center">
      <ShieldAlert className="mx-auto h-8 w-8 text-coral" />
      <h1 className="mt-3 font-display text-xl font-bold text-navy">Enlace inválido o expirado</h1>
      <p className="mt-2 text-sm text-navy/65">
        Este enlace de recuperación ya no es válido. Solicita uno nuevo para continuar.
      </p>
      <Link href="/recuperar-contrasena" className="btn-primary mt-5">Solicitar de nuevo</Link>
    </div>
  );
}