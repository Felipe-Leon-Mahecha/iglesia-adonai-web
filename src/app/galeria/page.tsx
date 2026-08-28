import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { getGaleriaFotos } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galería",
  description: "Fotos de nuestros cultos, eventos y actividades.",
};

export default async function GaleriaPage() {
  const fotos = await getGaleriaFotos();

  return (
    <>
      <PageHero kicker="Galería" titulo="Momentos de nuestra iglesia" descripcion="Retazos de los cultos, eventos y celebraciones que vivimos en comunidad." />

      <section className="container-site py-16">
        {fotos.length === 0 ? (
          <div className="card text-center">
            <Camera className="mx-auto h-8 w-8 text-teal" />
            <p className="mt-3 text-navy/70">Pronto subiremos fotos. Mientras tanto, ¡ven a vernos en persona!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {fotos.map((f) => (
              <figure key={f.id} className="group relative overflow-hidden rounded-xl border border-navy/10">
                <img src={f.url} alt={f.descripcion ?? "Foto de la galería"} className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {f.descripcion && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-3 pb-2 pt-8 text-xs text-white">
                    {f.descripcion}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>

      <CTASection />
    </>
  );
}