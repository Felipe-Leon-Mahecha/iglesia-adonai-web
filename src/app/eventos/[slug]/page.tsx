import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { FormInscripcionEvento } from "@/components/forms/FormInscripcionEvento";
import { getEventoBySlug } from "@/lib/queries";
import { formatFecha } from "@/lib/utils";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  return { title: evento?.titulo ?? "Evento", description: evento?.descripcion.slice(0, 160) };
}

export default async function EventoDetallePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) notFound();

  const cuposDisponibles = evento.requiereInscripcion ? Math.max(0, 999 - evento._count.inscripciones) : null;

  return (
    <>
      <PageHero kicker="Eventos" titulo={evento.titulo} descripcion={evento.lugar ? `${evento.lugar} · ${SITE.ubicacion.ciudad}` : undefined}>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="chip bg-white/10 text-white"><CalendarDays className="h-3.5 w-3.5" /> {formatFecha(evento.fecha, true)}</span>
          {evento.lugar && <span className="chip bg-white/10 text-white"><MapPin className="h-3.5 w-3.5" /> {evento.lugar}</span>}
          {evento.requiereInscripcion && <span className="chip bg-coral text-white"><Ticket className="h-3.5 w-3.5" /> Requiere inscripción</span>}
        </div>
      </PageHero>

      <section className="container-site grid gap-8 py-16 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <Link href="/eventos" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
            <ArrowLeft className="h-4 w-4" /> Todos los eventos
          </Link>
          <article className="space-y-4 leading-relaxed text-navy/80">
            {evento.descripcion.split(/\r?\n/).map((parrafo, i) =>
              parrafo.trim() ? <p key={i}>{parrafo}</p> : null
            )}
          </article>
        </div>

        <div className="space-y-4">
          {evento.requiereInscripcion ? (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-teal/30 bg-teal-soft p-4 text-sm text-navy">
                <Ticket className="h-5 w-5 shrink-0 text-teal" />
                <span>
                  {cuposDisponibles !== null && cuposDisponibles > 0 ? (
                    <>Cupos disponibles. Al inscribirte, el equipo de la iglesia recibirá una notificación.</>
                  ) : (
                    <>Las inscripciones están abiertas.</>
                  )}
                </span>
              </div>
              <FormInscripcionEvento eventoId={evento.id} titulo={evento.titulo} />
            </>
          ) : (
            <div className="card">
              <p className="text-sm text-navy/65">
                Este evento no necesita inscripción. ¡Solo llega!
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}