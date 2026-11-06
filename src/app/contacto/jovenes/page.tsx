import type { Metadata } from "next";
import { Rocket } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { FormContacto } from "@/components/forms/FormContacto";
import { CATEGORIAS_CONTACTO, SITE } from "@/lib/site";

const CAT = CATEGORIAS_CONTACTO.find((c) => c.id === "JOVENES")!;

export const metadata: Metadata = {
  title: "Jóvenes",
  description: "Únete al grupo de jóvenes de la iglesia. Escríbenos y te contactamos.",
};

export default function JovenesContactoPage() {
  return (
    <>
      <PageHero kicker="Contacto" titulo="¿Eres joven?" descripcion="Te estamos esperando. Cuéntanos de ti y participa del grupo de jóvenes." />
      <section className="container-site grid gap-8 py-16 lg:grid-cols-2">
        <div className="space-y-4">
          {SITE.logos.jovenes ? (
            <div className="flex items-center gap-4">
              <img src={SITE.logos.jovenes} alt="Logo del grupo de jóvenes" className="h-16 w-16 rounded-full object-contain" />
              <h2 className="font-display text-2xl font-bold text-navy">Grupo de jóvenes</h2>
            </div>
          ) : (
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-navy">
              <Rocket className="h-7 w-7 text-teal" /> Grupo de jóvenes
            </h2>
          )}
          <p className="leading-relaxed text-navy/75">
            El grupo de jóvenes es un espacio para conocerte a ti mismo, hacer buenas amistades y crecer en tu fe.
            Hacemos reuniones semanales, salidas y servicio a la comunidad.
          </p>
          <div className="rounded-xl border border-navy/10 bg-white p-5 text-sm leading-relaxed text-navy/70">
            Si no sabes cómo empezar, no importa: escríbenos y te decimos cuándo y dónde nos reunimos. También puedes
            pasar a saludarnos un domingo después del culto.
          </div>
        </div>
        <FormContacto categoria={CAT.id} titulo="Escríbenos" placeholders={CAT.placeholders} confidencial={CAT.confidencial} />
      </section>
      <CTASection />
    </>
  );
}