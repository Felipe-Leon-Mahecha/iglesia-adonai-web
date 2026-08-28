import type { Metadata } from "next";
import Link from "next/link";
import { Users, Heart, Music, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { SITE } from "@/lib/site";

const ICONOS: Record<string, typeof Users> = {
  jovenes: Users,
  ninos: Heart,
  alabanza: Music,
  matrimonios: HeartHandshake,
  mujeres: Heart,
  hombres: Users,
};

export const metadata: Metadata = {
  title: "Ministerios",
  description: `Conoce los ministerios de ${SITE.nombreLargo}: jóvenes, niños, alabanza, matrimonios, mujeres y hombres.`,
};

export default function MinisteriosPage() {
  return (
    <>
      <PageHero
        kicker="Ministerios"
        titulo="Sirve y crece en comunidad"
        descripcion="Cada ministerio es un espacio para crecer en tu fe y poner tus dones al servicio de los demás."
      />

      <section className="container-site grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {SITE.ministerios.map((m) => {
          const Icon = ICONOS[m.id] ?? Users;
          return (
            <div key={m.id} className="card group overflow-hidden transition-shadow hover:shadow-md">
              {m.foto ? (
                <img src={m.foto} alt={m.nombre} className="-mx-6 -mt-6 mb-4 aspect-[16/9] w-[calc(100%+3rem)] object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-beige">
                  <Icon className="h-6 w-6" />
                </div>
              )}
              {m.logo && (
                <img src={m.logo} alt={`Logo ${m.nombre}`} className="mb-3 mt-4 h-14 w-auto object-contain" />
              )}
              <h2 className="mt-4 font-display text-xl font-bold text-navy">{m.nombre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">{m.descripcion}</p>
              <Link href="/contacto" className="mt-4 inline-block text-sm font-medium text-teal hover:underline">
                Quiero participar
              </Link>
            </div>
          );
        })}
      </section>

      <section className="bg-beige-soft py-16">
        <div className="container-site max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-navy">¿No sabes dónde servir?</h2>
          <p className="mt-4 leading-relaxed text-navy/75">
            Escríbenos y un equipo te ayuda a encontrar el ministerio que mejor encaja con tus dones y tu momento de
            vida. Todos los ministerios están abiertos a nuevas personas.
          </p>
          <Link href="/contacto" className="btn-primary mt-6">Hablar con alguien</Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}