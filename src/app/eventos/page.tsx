import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { getEventosPublicos } from "@/lib/queries";
import { formatFecha, nombreDia } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Calendario de eventos y actividades de la iglesia. Entérate de lo que viene y reserva tu lugar.",
};

export default async function EventosPage() {
  const eventos = await getEventosPublicos();
  const ahora = new Date();
  const futuros = eventos.filter((e) => new Date(e.fecha) >= ahora);
  const pasados = eventos.filter((e) => new Date(e.fecha) < ahora).reverse();

  return (
    <>
      <PageHero
        kicker="Eventos"
        titulo="Lo que viene en la iglesia"
        descripcion="Retiros, celebraciones, bautismos y más. Revisa la agenda y aparta tu lugar."
      />

      <section className="container-site py-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-navy">Próximos eventos</h2>
        {futuros.length === 0 ? (
          <div className="card text-center">
            <p className="text-navy/70">No hay eventos públicos por ahora. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {futuros.map((e) => (
              <Link key={e.id} href={`/eventos/${e.slug}`} className="card group overflow-hidden !p-0 transition-shadow hover:shadow-md">
                {e.imagen && <img src={e.imagen} alt={e.titulo} className="h-40 w-full object-cover" />}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">{nombreDia(e.fecha)}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-navy">{e.titulo}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-navy/60">
                    <CalendarDays className="h-4 w-4 text-teal" /> {formatFecha(e.fecha, true)}
                  </p>
                  {e.lugar && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-navy/60">
                      <MapPin className="h-4 w-4 text-teal" /> {e.lugar}
                    </p>
                  )}
                  {e.requiereInscripcion && (
                    <span className="chip mt-3 bg-coral-soft text-coral">Requiere inscripción</span>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal">
                    Ver detalles <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {pasados.length > 0 && (
          <>
            <h2 className="mb-6 mt-14 font-display text-2xl font-bold text-navy">Eventos recientes</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {pasados.slice(0, 6).map((e) => (
                <Link key={e.id} href={`/eventos/${e.slug}`} className="card group overflow-hidden !p-0 opacity-80 transition-shadow hover:opacity-100 hover:shadow-md">
                  {e.imagen && <img src={e.imagen} alt={e.titulo} className="h-32 w-full object-cover" />}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-navy">{e.titulo}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-navy/60">
                      <CalendarDays className="h-4 w-4 text-teal" /> {formatFecha(e.fecha, true)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <CTASection />
    </>
  );
}