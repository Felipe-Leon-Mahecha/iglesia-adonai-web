import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { FormContacto } from "@/components/forms/FormContacto";
import { CATEGORIAS_CONTACTO } from "@/lib/site";

const CAT = CATEGORIAS_CONTACTO.find((c) => c.id === "ASESORIA_FAMILIAR")!;

export const metadata: Metadata = {
  title: "Asesoría familiar",
  description: "Asesoría familiar privada y confidencial. Conversa con un consejero de la iglesia.",
};

export default function AsesoriaContactoPage() {
  return (
    <>
      <PageHero
        kicker="Contacto"
        titulo="¿Necesitas asesoría familiar?"
        descripcion="Un consejero de la iglesia te acompaña en lo que estés viviendo como pareja o familia."
      />
      <section className="container-site grid gap-8 py-16 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="leading-relaxed text-navy/75">
            Las crisis, las dudas y las cargas son parte de la vida familiar. Nuestro equipo ofrece acompañamiento
            pastoral y consejería desde la Palabra de Dios, con respeto y sin juzgar.
          </p>
          <p className="leading-relaxed text-navy/75">Puedes pedir una asesoría para ti, para tu pareja o para tu familia.</p>
          <div className="rounded-xl border border-beige bg-beige-soft p-5 text-sm leading-relaxed text-navy">
            <strong>Compromiso de confidencialidad.</strong> Lo que compartas en este formulario o en las sesiones
            queda entre tú y el equipo de consejería. Solo se usa para darte seguimiento y nunca se publica.
          </div>
        </div>
        <FormContacto categoria={CAT.id} titulo="Pide una cita" placeholders={CAT.placeholders} confidencial={CAT.confidencial} />
      </section>
      <CTASection />
    </>
  );
}