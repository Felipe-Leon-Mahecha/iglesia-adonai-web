import type { Metadata } from "next";
import { Waves, MapPin, CalendarDays, ClipboardCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { FormBautismo } from "@/components/forms/FormBautismo";
import { getEventoBautismoActual } from "@/lib/queries";
import { formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bautismos",
  description: "Bautizos en agua de la iglesia: requisitos, fecha, lugar e inscripción.",
};

export default async function BautismosPage() {
  const evento = await getEventoBautismoActual();

  return (
    <>
      <PageHero
        kicker="Bautismos"
        titulo="Bautizos en agua"
        descripcion="El bautismo es un paso de obediencia y una declaración pública de tu fe en Jesús."
      />

      {evento && (
        <section className="container-site grid gap-8 py-16 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card">
                <CalendarDays className="h-5 w-5 text-coral" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy/50">Fecha</p>
                <p className="mt-1 font-display text-lg font-bold text-navy">{formatFecha(evento.fecha, true)}</p>
              </div>
              <div className="card">
                <MapPin className="h-5 w-5 text-coral" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-navy/50">Lugar</p>
                <p className="mt-1 font-display text-lg font-bold text-navy">{evento.lugar}</p>
              </div>
            </div>

            <div className="card">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-navy">
                <ClipboardCheck className="h-5 w-5 text-teal" /> Requisitos
              </h2>
              <ul className="mt-3 space-y-2">
                {evento.requisitos.split(/\r?\n/).filter(Boolean).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-navy/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <FormBautismo eventoId={evento.id} />
          </div>
        </section>
      )}

      {!evento && (
        <section className="container-site py-16">
          <div className="card text-center">
            <Waves className="mx-auto h-8 w-8 text-teal" />
            <p className="mt-3 text-navy/70">Aún no publicamos la fecha del próximo bautismo. Vuelve pronto.</p>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}