import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, AtSign, Camera } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { SITE } from "@/lib/site";

const COLUMNAS: Array<{ titulo: string; links: Array<{ href: string; label: string }> }> = [
  {
    titulo: "Conoce",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/ministerios", label: "Ministerios" },
      { href: "/servicios", label: "Nuestros servicios" },
    ],
  },
  {
    titulo: "Conecta",
    links: [
      { href: "/eventos", label: "Eventos" },
      { href: "/casas-oasis", label: "Casas Oasis" },
      { href: "/bautismos", label: "Bautismos" },
      { href: "/sermones", label: "Sermones" },
    ],
  },
  {
    titulo: "Comparte",
    links: [
      { href: "/dar", label: "Diezmos y ofrendas" },
      { href: "/contacto", label: "Contacto" },
      { href: "/login", label: "Portal interno" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{SITE.descripcion}</p>
          <div className="mt-5 flex gap-3">
            <a href={SITE.contacto.facebook} target="_blank" rel="noopener noreferrer" aria-label="Red social / página" className="rounded-full border border-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <AtSign className="h-4 w-4" />
            </a>
            <a href={SITE.contacto.instagram} target="_blank" rel="noopener noreferrer" aria-label="Red social / fotos" className="rounded-full border border-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <Camera className="h-4 w-4" />
            </a>
            <a href={SITE.contacto.whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full border border-white/20 p-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {COLUMNAS.map((col) => (
          <div key={col.titulo}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-beige">{col.titulo}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.nombreLargo}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {SITE.ubicacion.ciudad}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {SITE.contacto.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> {SITE.contacto.whatsapp}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}