import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, MessageCircle, Mail } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { CATEGORIAS_CONTACTO, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos según lo que necesitas: jóvenes, asesoría familiar, ayuda espiritual o más información.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        kicker="Contacto"
        titulo="Estamos aquí para ti"
        descripcion="Elige lo que necesitas y te respondemos. Todos los mensajes llegan directamente al equipo de la iglesia."
      />

      <section className="container-site grid gap-5 py-16 md:grid-cols-2">
        {CATEGORIAS_CONTACTO.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className={`card group flex flex-col transition-shadow hover:shadow-md ${c.confidencial ? "border-beige bg-beige-soft" : ""}`}
          >
            <div className="flex items-center justify-between">
              <span className="kicker">{c.titulo}</span>
              {c.confidencial ? (
                <Lock className="h-4 w-4 text-navy" />
              ) : (
                <MessageCircle className="h-4 w-4 text-teal" />
              )}
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-navy">{c.pregunta}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/65">{c.descripcion}</p>
            {c.confidencial && (
              <span className="chip mt-4 w-fit bg-beige text-navy">Privado y confidencial</span>
            )}
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-teal">
              Entrar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="container-site pb-16">
        <div className="rounded-2xl bg-navy p-8 text-white">
          <h2 className="font-display text-2xl font-bold">Directorio pastoral</h2>
          <p className="mt-1 text-sm text-white/65">Escríbenos o llámanos, según necesites.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SITE.pastores.map((p) => (
              <div key={p.nombre} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="font-display text-lg font-bold">{p.nombre}</p>
                <p className="text-sm text-teal">{p.rol}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${p.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> {p.celular}
                  </a>
                  <a
                    href={`mailto:${p.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10"
                  >
                    <Mail className="h-3.5 w-3.5" /> {p.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site pb-16 text-center">
        <h2 className="font-display text-2xl font-bold text-navy">¿Prefieres WhatsApp?</h2>
        <a href={SITE.contacto.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-beige mt-4">
          <MessageCircle className="h-4 w-4" /> {SITE.contacto.whatsapp}
        </a>
      </section>

      <CTASection />
    </>
  );
}