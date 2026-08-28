import type { Metadata } from "next";
import { Clock, MapPin, Sun, Flame } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Servicios y horarios",
  description: `Horarios de culto de ${SITE.nombreLargo}: domingos y miércoles. Encuentra la dirección y cómo llegar.`,
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        kicker="Servicios"
        titulo="Cuándo nos reunimos"
        descripcion="Nos reunimos dos veces a la semana para adorar juntos. Ven como estés: hay un lugar para ti."
      />

      {SITE.imagenes.adoracion && (
        <section className="container-site pt-14">
          <img
            src={SITE.imagenes.adoracion}
            alt="Adoración en ADONAI"
            className="aspect-[21/9] w-full rounded-2xl object-cover shadow-sm"
          />
        </section>
      )}

      <section className="container-site grid gap-5 py-16 md:grid-cols-2">
        {[
          {
            icon: Sun,
            dia: "Domingos",
            hora: "10:00 a. m.",
            titulo: SITE.horarios.etiquetaDomingo,
            descripcion:
              "Nuestro culto principal: alabanza, adoración y una palabra para tu vida. Tenemos ministros para niños en el mismo horario.",
          },
          {
            icon: Flame,
            dia: "Miércoles",
            hora: "7:00 p. m.",
            titulo: SITE.horarios.etiquetaMiercoles,
            descripcion:
              "Una noche más íntima de oración y Palabra. Es el encuentro ideal si estás empezando a visitarnos.",
          },
        ].map((s) => (
          <div key={s.dia} className="card">
            <div className="flex items-center justify-between">
              <s.icon className="h-7 w-7 text-teal" />
              <span className="text-xs font-semibold uppercase tracking-wider text-navy/40">{s.dia}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-navy">{s.titulo}</h2>
            <p className="mt-1 flex items-center gap-2 font-semibold text-coral">
              <Clock className="h-4 w-4" /> {s.hora}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-navy/65">{s.descripcion}</p>
          </div>
        ))}
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="container-site">
          <p className="kicker"><span className="bg-teal" />Dónde nos encontramos</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Cómo llegar</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="flex items-start gap-2 text-white/75">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-beige" />
                <span>
                  <strong className="text-white">{SITE.ubicacion.direccion}</strong>
                  <br />
                  {SITE.ubicacion.ciudad}
                </span>
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <p><strong className="text-beige">Domingos:</strong> {SITE.horarios.domingo}</p>
                <p><strong className="text-beige">Miércoles:</strong> {SITE.horarios.miercoles}</p>
                <p>Entrada libre. Estacionamiento disponible.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={SITE.ubicacion.mapsEmbed}
                title={`Mapa de ${SITE.nombre}`}
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}