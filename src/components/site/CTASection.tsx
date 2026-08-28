import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

export function CTASection() {
  return (
    <section className="bg-navy py-16 text-white">
      <div className="container-site flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-bold text-balance md:text-4xl">
          Te esperamos este domingo
        </h2>
        <p className="max-w-xl text-white/75">{SITE.horarios.domingo} · {SITE.ubicacion.direccion}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={SITE.contacto.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-beige">
            <MessageCircle className="h-4 w-4" /> Escríbenos por WhatsApp
          </a>
          <Link href="/contacto" className="btn-outline-light">
            Contáctanos
          </Link>
        </div>
      </div>
    </section>
  );
}