import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Compass, Users, MessageCircle, Mail } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Historia, visión, misión y el equipo pastoral de ${SITE.nombreLargo}.`,
};

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        kicker="Nosotros"
        titulo="Quiénes somos"
        descripcion={`Somos una familia de fe en ${SITE.ubicacion.ciudad}. Nuestro deseo es que cada persona conozca a Jesús, crezca en su fe y encuentre propósito.`}
      />

      <section className="container-site grid gap-12 py-16 lg:grid-cols-2">
        <div className="space-y-5">
          <p className="kicker">Nuestra historia</p>
          <h2 className="font-display text-3xl font-bold text-navy">Qué ha hecho Dios en medio de nosotros</h2>
          {SITE.imagenes.nosotros && (
            <img
              src={SITE.imagenes.nosotros}
              alt="La iglesia ADONAI"
              className="aspect-video w-full rounded-2xl object-cover shadow-sm"
            />
          )}
          <div className="leading-relaxed text-navy/75">
            <p>
              {SITE.nombre} nació en {SITE.fundada} con una reunión pequeña y un sueño grande: ver a nuestro barrio
              transformado por el evangelio. Desde entonces, Dios ha reunido una iglesia familiar que adora con alegría,
              sirve con humildad y discipula a las personas en cada etapa de su vida.
            </p>
            <p className="mt-4">
              Hoy nos reunimos cada domingo y miércoles para adorar, y entre semana compartimos la vida en las Casas
              Oasis — grupos pequeños que son el corazón de nuestra comunidad.
            </p>
            <p className="mt-4 rounded-xl border-l-4 border-teal bg-teal-soft p-4">
              Nuestro lema se resume así: <strong>conocer a Dios, crecer con otros y servir al mundo.</strong>
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Compass, titulo: "Visión", texto: "Una iglesia donde cada persona camina con Cristo y deja un legado en su casa, su trabajo y su comunidad." },
            { icon: Heart, titulo: "Misión", texto: "Llevar el evangelio a nuestra ciudad, discipular a los creyentes y equipar a cada uno para servir." },
            { icon: Users, titulo: "Valores", texto: "Fidelidad a la Palabra, amor sincero por las personas, integridad y servicio humilde." },
          ].map((v) => (
            <div key={v.titulo} className="card">
              <v.icon className="h-6 w-6 text-teal" />
              <h3 className="mt-3 font-display text-lg font-bold text-navy">{v.titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy/65">{v.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige-soft py-16">
        <div className="container-site">
          <p className="kicker">Nuestros pastores</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy">El equipo pastoral</h2>
          {SITE.imagenes.pastores && (
            <img
              src={SITE.imagenes.pastores}
              alt="Equipo pastoral de ADONAI"
              className="mt-6 aspect-[21/9] w-full rounded-2xl object-cover shadow-sm"
            />
          )}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {SITE.pastores.map((p) => (
              <div key={p.nombre} className="card flex flex-col items-center text-center">
                {p.foto ? (
                  <img src={p.foto} alt={p.nombre} className="h-28 w-28 rounded-full object-cover" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-navy text-beige">
                    <Users className="h-10 w-10" />
                  </div>
                )}
                <h3 className="mt-4 font-display text-xl font-bold text-navy">{p.nombre}</h3>
                <p className="mt-1 text-sm font-semibold text-teal">{p.rol}</p>
                <p className="mt-3 text-sm leading-relaxed text-navy/65">{p.bio}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={p.whatsapp ? `https://wa.me/${p.whatsapp}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> {p.celular}
                  </a>
                  {p.email && (
                    <a
                      href={`mailto:${p.email}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                    >
                      <Mail className="h-3.5 w-3.5" /> Escribir
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/contacto" className="btn-primary">Escríbenos</Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}