import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { FormContacto } from "@/components/forms/FormContacto";
import { CATEGORIAS_CONTACTO } from "@/lib/site";

const CAT = CATEGORIAS_CONTACTO.find((c) => c.id === "ORACION")!;

export const metadata: Metadata = {
  title: "Ayuda espiritual y oración",
  description: "Pide oración o pide hablar con un pastor. Peticiones confidenciales.",
};

export default function AyudaEspiritualContactoPage() {
  return (
    <>
      <PageHero
        kicker="Contacto"
        titulo="¿Buscas ayuda espiritual u oración?"
        descripcion="No tienes que cargar solo lo que estás viviendo. Envía tu petición y oremos por ti."
      />
      <section className="container-site grid gap-8 py-16 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="leading-relaxed text-navy/75">
            El equipo pastoral ora por cada petición que nos llega y responde personalmente cuando lo necesitas.
            Si prefieres hablar directamente con un pastor, dínoslo en el mensaje.
          </p>
          <div className="rounded-xl border border-beige bg-beige-soft p-5 text-sm leading-relaxed text-navy">
            <strong>Confidencial.</strong> Tu petición se mantiene en privado y se ora por ella dentro del equipo
            pastoral. Nunca se hace pública.
          </div>
        </div>
        <FormContacto categoria={CAT.id} titulo="Envía tu petición de oración" placeholders={CAT.placeholders} confidencial={CAT.confidencial} />
      </section>
      <CTASection />
    </>
  );
}