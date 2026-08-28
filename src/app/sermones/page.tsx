import type { Metadata } from "next";
import { Play, Volume2, BookOpen } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { getSermones } from "@/lib/queries";
import { formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sermones",
  description: "Audios y videos de sermones pasados de la iglesia, agrupados por serie.",
};

export default async function SermonesPage() {
  const series = await getSermones();

  return (
    <>
      <PageHero
        kicker="Sermones"
        titulo="Escucha la Palabra de nuevo"
        descripcion="Revisita las predicaciones de nuestros cultos, organizadas por serie temática."
      />

      <section className="container-site py-16">
        {series.length === 0 ? (
          <div className="card text-center">
            <p className="text-navy/70">Aún no hay sermones publicados. Vuele pronto.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {series.map(({ serie, sermones }) => (
              <div key={serie}>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-display text-2xl font-bold text-navy">{serie}</h2>
                  <span className="chip bg-beige-soft text-navy">{sermones.length} sermones</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {sermones.map((s) => (
                    <article key={s.id} className="card group">
                      {s.imagen && <img src={s.imagen} alt={s.titulo} className="mb-4 h-36 w-full rounded-lg object-cover" />}
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal">{formatFecha(s.fecha)}</p>
                      <h3 className="mt-1 font-display text-lg font-bold text-navy">{s.titulo}</h3>
                      {s.textoBiblico && <p className="mt-1 text-sm italic text-navy/55">{s.textoBiblico}</p>}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {s.linkVideo && (
                          <a href={s.linkVideo} target="_blank" rel="noopener noreferrer" className="btn-teal !py-2 !text-xs">
                            <Play className="h-3.5 w-3.5" /> Ver video
                          </a>
                        )}
                        {s.linkAudio && (
                          <a href={s.linkAudio} target="_blank" rel="noopener noreferrer" className="btn-outline !py-2 !text-xs">
                            <Volume2 className="h-3.5 w-3.5" /> Escuchar audio
                          </a>
                        )}
                        {s.textoBiblico && (
                          <span className="inline-flex items-center gap-1 text-xs text-navy/40">
                            <BookOpen className="h-3.5 w-3.5" /> {s.textoBiblico}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CTASection />
    </>
  );
}