import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, PartyPopper, Map } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CTASection } from "@/components/site/CTASection";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Eres nuevo",
  description: "Información para quienes visitan por primera vez: horarios, dirección y cómo encontrar el lugar.",
};

export default function NuevoContactoPage() {
  return (
    <>
      <PageHero
        kicker="Contacto"
        titulo="¿Eres nuevo o visitante?"
        descripcion="No necesitas inscribirte: solo llega. Te contamos cómo preparar tu primera visita."
      >
        <span className="chip mt-6 bg-white/10 text-white"><PartyPopper className="h-3.5 w-3.5" /> Entrada libre siempre</span>
      </PageHero>

      <section className="container-site grid gap-8 py-16 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-navy">Tu primera visita</h2>
          <ul className="space-y-3">
            {[
              ["Ven como estás", "No hay código de vestimenta. Ropa cómoda y corazón dispuesto."],
              ["Llega 10 minutos antes", "Así buscas parqueo y saludas con calma."],
              ["Somos para todos", "Hay espacio para niños y un grupo de bienvenida para visitantes."],
              ["Quédate al final", "Después del culto hay café y tiempo para conocernos."],
            ].map(([titulo, texto]) => (
              <li key={titulo} className="flex items-start gap-3 rounded-lg border border-navy/10 bg-white p-4">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal" />
                <p className="text-sm leading-relaxed text-navy/75">
                  <strong className="text-navy">{titulo}.</strong> {texto}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
              <Clock className="h-4 w-4 text-teal" /> Horarios
            </h3>
            <p className="mt-3 text-sm text-navy/75"><strong className="text-navy">{SITE.horarios.domingo}</strong> · {SITE.horarios.etiquetaDomingo}</p>
            <p className="mt-1 text-sm text-navy/75"><strong className="text-navy">{SITE.horarios.miercoles}</strong> · {SITE.horarios.etiquetaMiercoles}</p>
          </div>

          <div className="card">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
              <MapPin className="h-4 w-4 text-teal" /> Cómo llegar
            </h3>
            <p className="mt-3 text-sm text-navy/75">{SITE.ubicacion.direccion}</p>
            <p className="text-sm text-navy/75">{SITE.ubicacion.ciudad}</p>
            <a href={SITE.ubicacion.mapsLink} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 !py-2 !text-xs">
              <Map className="h-3.5 w-3.5" /> Abrir en Google Maps
            </a>
          </div>

          <Link href="/login" className="text-sm text-navy/50 hover:text-navy">¿Eres parte del staff? Portal interno →</Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}