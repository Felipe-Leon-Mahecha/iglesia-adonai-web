import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, MessageCircle, Heart, Home as HomeIcon, Users, Flame } from "lucide-react";
import { SITE } from "@/lib/site";
import { getEventosPublicos, getCohortesPublicas, getEventoBautismoActual } from "@/lib/queries";
import { CTASection } from "@/components/site/CTASection";
import { AnunciosCarousel, type Anuncio } from "@/components/site/AnunciosCarousel";
import { formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HomeHero />

      <section className="container-site -mt-16 grid gap-4 pb-20 md:grid-cols-3">
        {[
          { titulo: SITE.horarios.etiquetaDomingo, hora: "10:00 a. m.", dia: "Domingos", icon: Clock },
          { titulo: SITE.horarios.etiquetaMiercoles, hora: "7:00 p. m.", dia: "Miércoles", icon: Flame },
          { titulo: "Reuniones en grupo", hora: "Agenda semanal", dia: "Semanas", icon: Users },
        ].map((s) => (
          <div key={s.titulo} className="card !rounded-2xl !p-6">
            <s.icon className="h-6 w-6 text-teal" />
            <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-navy/60">{s.titulo}</h3>
            <p className="font-display text-xl font-bold text-navy">{s.hora}</p>
            <p className="text-sm text-navy/60">{s.dia}</p>
          </div>
        ))}
      </section>

      <AnunciosHome />

      <section className="bg-beige-soft py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="kicker">Bienvenidos</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl">
              Un hogar donde cada persona encuentra su lugar
            </h2>
            <p className="mt-4 leading-relaxed text-navy/75">
              En {SITE.nombreLargo} creemos que la iglesia es una familia. Ven tal como eres: aquí te esperamos con un
              café, una palmada y la Palabra de Dios. Creemos en un Dios que restaura familias, sana corazones y nos
              llama a servir con propósito.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/nosotros" className="btn-primary">
                Conócenos <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contacto" className="btn-outline">Contáctanos</Link>
            </div>
          </div>
          <div className="relative mx-auto grid max-w-md gap-3">
            <div className="animate-float-slow rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <Users className="h-6 w-6 text-coral" />
              <h3 className="mt-2 font-semibold text-navy">Comunidad</h3>
              <p className="mt-1 text-sm text-navy/60">Súmate a un grupo pequeño y camina acompañado.</p>
            </div>
            <div className="ml-8 animate-float-slow rounded-2xl border border-navy/10 bg-white p-6 shadow-sm [animation-delay:1.5s]">
              <Heart className="h-6 w-6 text-teal" />
              <h3 className="mt-2 font-semibold text-navy">Servicio</h3>
              <p className="mt-1 text-sm text-navy/60">Hay un ministerio donde tu don encaja.</p>
            </div>
            <div className="ml-16 animate-float-slow rounded-2xl border border-navy/10 bg-white p-6 shadow-sm [animation-delay:3s]">
              <HomeIcon className="h-6 w-6 text-[#b2923f]" />
              <h3 className="mt-2 font-semibold text-navy">Casas Oasis</h3>
              <p className="mt-1 text-sm text-navy/60">Crece en tu fe en un espacio pequeño y cercano.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="text-center">
          <p className="kicker justify-center">Ministerios</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl">Encuentra tu lugar</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITE.ministerios.slice(0, 6).map((m) => (
            <Link key={m.id} href="/ministerios" className="card group flex flex-col transition-shadow hover:shadow-md">
              {m.logo && (
                <img src={m.logo} alt={`Logo ${m.nombre}`} className="mb-2 h-12 w-12 rounded-full object-contain" />
              )}
              <h3 className="font-display text-lg font-bold text-navy">{m.nombre}</h3>
              <p className="mt-1 text-sm text-navy/60">{m.descripcion}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal">
                Ver ministerios <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-navy-deep py-16 text-white">
        <div className="container-site grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="kicker">
              {SITE.logos.casasOasis && (
                <img src={SITE.logos.casasOasis} alt="Logo Casa Oasis" className="h-10 w-10 rounded-full object-contain" />
              )}
              <span className="text-beige">Casas Oasis</span>
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Pequeños grupos, crecimiento real
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              En las Casas Oasis nos reunimos entre semana en casas de la membresía para estudiar la Palabra, orar y
              vivir la fe en comunidad.
            </p>
            <Link href="/casas-oasis" className="btn-beige mt-6">
              Conocer Casas Oasis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Cercanía", "Palabra", "Oración", "Amistad"].map((v) => (
              <div key={v} className="rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-center">
                <p className="font-display text-lg font-bold text-beige">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Galeria />

      <CTASection />
    </>
  );
}

function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: "radial-gradient(60rem 30rem at 85% -10%, #1d9586 0%, transparent 60%), radial-gradient(50rem 30rem at 5% 110%, #e8d1a3 0%, transparent 55%)",
        }}
      />
      {SITE.imagenes.hero && (
        <img src={SITE.imagenes.hero} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
      )}
      <div className="container-site relative grid items-center gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="kicker"><span className="h-px w-8 bg-beige" />Adoración · Palabra · Comunidad</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Un hogar espiritual para ti <span className="text-beige">y tu familia</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            {SITE.nombreLargo} te invita a adorar, crecer y servir. Ven este domingo a vivir la presencia de Dios en
            comunidad.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contacto" className="btn-primary">
              <MessageCircle className="h-4 w-4" /> Escríbenos
            </Link>
            <Link href="/eventos" className="btn-outline-light">
              Ver próximos eventos
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-beige" /> {SITE.ubicacion.direccion}</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-beige" /> {SITE.horarios.domingo}</span>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-beige/20 blur-3xl" />
            <Image
              src="/logo-adonai.png"
              alt={`Logo de ${SITE.nombre}`}
              width={280}
              height={280}
              className="relative h-56 w-56 rounded-full border-4 border-beige/40 object-cover shadow-2xl md:h-72 md:w-72"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

async function AnunciosHome() {
  const [eventos, cohortes, bautismo] = await Promise.all([
    getEventosPublicos(),
    getCohortesPublicas(),
    getEventoBautismoActual(),
  ]);

  const ahora = new Date();
  const anuncios: Anuncio[] = [];

  for (const e of eventos) {
    if (new Date(e.fecha) < ahora) continue;
    anuncios.push({
      id: `evento-${e.id}`,
      tipo: "EVENTO",
      titulo: e.titulo,
      descripcion: e.descripcion,
      fechaLabel: formatFecha(e.fecha, true),
      lugar: e.lugar ?? undefined,
      imagen: e.imagen,
      href: `/eventos/${e.slug}`,
      cta: "Ver detalles",
    });
    if (anuncios.filter((a) => a.tipo === "EVENTO").length >= 3) break;
  }

  const cohorte = cohortes[0];
  if (cohorte) {
    anuncios.push({
      id: `casas-${cohorte.id}`,
      tipo: "CASAS",
      titulo: "Próxima cohorte de Casas Oasis",
      descripcion: "Inscríbete y crece en comunidad: Palabra, oración y amistad en grupos pequeños.",
      fechaLabel: `Inicia ${formatFecha(cohorte.fechaInicio, true)}`,
      imagen: SITE.imagenes.casasOasis,
      href: "/casas-oasis",
      cta: "Saber más",
    });
  }

  if (bautismo) {
    anuncios.push({
      id: `bautismo-${bautismo.id}`,
      tipo: "BAUTISMO",
      titulo: "Servicio de bautismos",
      descripcion: bautismo.requisitos,
      fechaLabel: formatFecha(bautismo.fecha, true),
      lugar: bautismo.lugar,
      href: "/bautismos",
      cta: "Saber más",
    });
  }

  return <AnunciosCarousel anuncios={anuncios} />;
}

function Galeria() {
  if (!SITE.imagenes.galeria.length) return null;
  return (
    <section className="container-site py-16">
      <div className="text-center">
        <p className="kicker justify-center"><span className="h-px w-8 bg-teal" />Galería</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl">Nuestra iglesia</h2>
        <p className="mt-2 text-sm text-navy/60">Una mirada a lo que vivimos cada domingo.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SITE.imagenes.galeria.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Foto de la iglesia ADONAI ${i + 1}`}
            className="aspect-[4/3] w-full rounded-xl object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}