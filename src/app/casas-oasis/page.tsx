import type { Metadata } from "next";
import Link from "next/link";
import { Home as HomeIcon, CalendarDays, Users, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { FormCasasOasis } from "@/components/forms/FormCasasOasis";
import { getCohortesPublicas } from "@/lib/queries";
import { SITE } from "@/lib/site";
import { formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Casas Oasis",
  description: "Grupos pequeños de la iglesia para crecer en comunidad. Inscríbete a la próxima cohorte.",
};

export default async function CasasOasisPage() {
  const cohortes = await getCohortesPublicas();
  const proxima = cohortes[0] ?? null;

  return (
    <>
      <PageHero
        kicker="Casas Oasis"
        titulo="Crece en tu fe en un espacio pequeño"
        descripcion="Grupos de vida que se reúnen en casas entre semana para estudiar la Palabra, orar y acompañarse."
      />

      <section className="container-site grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            {SITE.logos.casasOasis ? (
              <img src={SITE.logos.casasOasis} alt="Logo Casa Oasis" className="h-16 w-16 rounded-full object-contain" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-soft text-teal">
                <HomeIcon className="h-7 w-7" />
              </div>
            )}
            <h2 className="font-display text-2xl font-bold text-navy md:text-3xl">¿Qué es una Casa Oasis?</h2>
          </div>
          {SITE.imagenes.casasOasis && (
            <img
              src={SITE.imagenes.casasOasis}
              alt="Casa Oasis de la iglesia"
              className="aspect-video w-full rounded-2xl object-cover shadow-sm"
            />
          )}
          <p className="leading-relaxed text-navy/75">
            Una Casa Oasis es un grupo pequeño de entre 8 y 12 personas que se reúne semanalmente en el hogar de una
            familia de la iglesia. Ahí se profundiza lo aprendido el domingo, se ora por las necesidades de cada uno y
            se construyen amistades reales.
          </p>
          <p className="leading-relaxed text-navy/75">
            Es el lugar ideal para quienes quieren dejar de ser espectadores y empezar a vivir la fe en comunidad.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: HomeIcon, titulo: "En casas", texto: "Ambiente íntimo y familiar" },
              { icon: Users, titulo: "Grupos pequeños", texto: "Atención y cercanía reales" },
              { icon: CalendarDays, titulo: "Entre semana", texto: "Horarios para todos" },
            ].map((v) => (
              <div key={v.titulo} className="rounded-xl border border-navy/10 bg-white p-4 text-center">
                <v.icon className="mx-auto h-6 w-6 text-teal" />
                <p className="mt-2 font-semibold text-navy">{v.titulo}</p>
                <p className="mt-1 text-xs text-navy/55">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {proxima ? (
            <div className="card">
              <p className="kicker">Próxima cohorte</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-navy">
                Inicia {formatFecha(proxima.fechaInicio)}
              </h3>
              <p className="mt-1 text-sm text-navy/65">Cohorte con duración hasta {formatFecha(proxima.fechaFin)}.</p>
              <div className="mt-5 flex items-center gap-2 text-sm text-navy/70">
                <Users className="h-4 w-4 text-teal" />
                {proxima.cupo - proxima._count.inscripciones} de {proxima.cupo} cupos disponibles
              </div>
              <div className="mt-6">
                <a href="#inscripcion" className="btn-primary w-full">
                  Inscribirme a la cohorte <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="card">
              <h3 className="font-display text-2xl font-bold text-navy">Próxima cohorte</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                Por ahora no hay una cohorte abierta. Sigue pendiente de esta página o escríbenos para enterarte cuando
                se abra la próxima.
              </p>
              <Link href="/contacto" className="btn-outline mt-5">Avisarme</Link>
            </div>
          )}
        </div>
      </section>

      <section id="inscripcion" className="bg-beige-soft py-16">
        <div className="container-site grid gap-8 lg:grid-cols-2">
          <div>
            <p className="kicker">Inscripción</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy">Aparta tu lugar en la cohorte</h2>
            <p className="mt-4 leading-relaxed text-navy/75">
              Al inscribirte recibirás un mensaje del líder de la Casa Oasis con la dirección, el día y la hora exactos
              de tu grupo. También puedes indicar en el comentario los horarios que te funcionan.
            </p>
          </div>
          <FormCasasOasis cohortes={cohortes} />
        </div>
      </section>

      <CTASection />
    </>
  );
}