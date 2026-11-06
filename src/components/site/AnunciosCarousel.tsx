"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";

export type Anuncio = {
  id: string;
  tipo: "EVENTO" | "CASAS" | "BAUTISMO";
  titulo: string;
  descripcion: string;
  fechaLabel?: string;
  lugar?: string;
  imagen?: string | null;
  href: string;
  cta: string;
};

export function AnunciosCarousel({ anuncios }: { anuncios: Anuncio[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (anuncios.length === 0) return null;

  const deslizar = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const ancho = track.querySelector<HTMLElement>("[data-slide]")?.offsetWidth ?? 320;
    track.scrollBy({ left: dir * (ancho + 16), behavior: "smooth" });
  };

  return (
    <section className="container-site py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="kicker"><span className="h-px w-8 bg-teal" />Anuncios</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-navy md:text-3xl">¿Qué está pasando esta semana?</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => deslizar(-1)}
            aria-label="Anuncios anteriores"
            className="rounded-full border border-navy/15 bg-white p-2 text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => deslizar(1)}
            aria-label="Siguientes anuncios"
            className="rounded-full border border-navy/15 bg-white p-2 text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
        {anuncios.map((a) => (
          <article
            key={a.id}
            data-slide
            className="card flex w-[85%] shrink-0 snap-start flex-col overflow-hidden !p-0 sm:w-[360px]"
          >
            {a.imagen ? (
              <img src={a.imagen} alt={a.titulo} className="h-40 w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-navy text-beige">
                <Sparkles className="h-10 w-10" />
              </div>
            )}
            <span className={`mt-5 ml-5 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${a.tipo === "EVENTO" ? "bg-teal-soft text-teal" : a.tipo === "CASAS" ? "bg-beige-soft text-navy" : "bg-coral-soft text-coral"}`}>
              {a.tipo === "EVENTO" ? "Evento" : a.tipo === "CASAS" ? "Casas Oasis" : "Bautismos"}
            </span>
            <div className="flex flex-1 flex-col px-5 pb-5">
              <h3 className="mt-3 font-display text-lg font-bold text-navy">{a.titulo}</h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy/60">
                {a.fechaLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-teal" /> {a.fechaLabel}
                  </span>
                )}
                {a.lugar && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-teal" /> {a.lugar}
                  </span>
                )}
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy/65">{a.descripcion}</p>
              <span className="mt-auto pt-4">
                <Link href={a.href} className="btn-teal !px-4 !py-2 text-sm">
                  {a.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}