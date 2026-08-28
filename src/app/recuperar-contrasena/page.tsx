import type { Metadata } from "next";
import { FormRecuperar } from "@/components/forms/FormRecuperar";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecuperarContrasenaPage() {
  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <FormRecuperar />
      </div>
    </div>
  );
}