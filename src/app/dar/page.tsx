import type { Metadata } from "next";
import { HandCoins, ShieldCheck, Landmark, Smartphone } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Diezmos y ofrendas",
  description: `Formas de dar en ${SITE.nombreLargo}: Nequi, PSE y transferencia bancaria. Información de canales externos, sin pagos en el sitio.`,
};

const ICONOS: Record<string, typeof HandCoins> = {
  "Nequi": Smartphone,
  "PSE / Bancos": Landmark,
  "Transferencia": Landmark,
};

export default function DarPage() {
  return (
    <>
      <PageHero
        kicker="Dar"
        titulo="Diezmos y ofrendas"
        descripcion="Tu generosidad sostiene la obra de Dios en nuestra ciudad. Compartimos los canales que usa la iglesia — el sitio no procesa pagos."
      />

      <section className="container-site py-16">
        {SITE.imagenes.dar && (
          <img
            src={SITE.imagenes.dar}
            alt="Momento de ofrenda en ADONAI"
            className="mb-10 aspect-[21/9] w-full rounded-2xl object-cover shadow-sm"
          />
        )}

        <div className="mb-8 flex items-start gap-3 rounded-xl border border-beige bg-beige-soft p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
          <p className="text-sm leading-relaxed text-navy">
            <strong>Confiabilidad.</strong> {SITE.dar.nota}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {SITE.dar.metodos.map((m) => {
            const Icon = ICONOS[m.nombre] ?? HandCoins;
            return (
              <div key={m.nombre} className="card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-beige">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-navy">{m.nombre}</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{m.descripcion}</p>
                <div className="mt-4 rounded-lg border border-navy/10 bg-[#fafafa] px-4 py-3 text-sm">
                  <p className="font-mono text-navy/80">{m.detalle}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-navy p-8 text-center text-white md:p-12">
          <p className="mx-auto max-w-2xl font-display text-2xl font-bold text-balance md:text-3xl">
            «Cada uno dé como propuso en su corazón, no con tristeza ni por necesidad, porque Dios ama al dador
            alegre.»
          </p>
          <p className="mt-3 text-sm text-white/60">2 Corintios 9:7</p>
        </div>
      </section>

      <CTASection />
    </>
  );
}