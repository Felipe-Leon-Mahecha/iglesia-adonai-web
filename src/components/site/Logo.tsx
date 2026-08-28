import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

export function Logo({ dark = false, conTexto = true, className }: { dark?: boolean; conTexto?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo-adonai.png"
        alt={`Logo de ${SITE.nombre}`}
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
        priority
      />
      {conTexto && (
        <span className={cn("font-display text-lg font-bold leading-none tracking-tight", dark ? "text-white" : "text-navy")}>
          {SITE.nombre}
          <span className="block text-[10px] font-sans font-normal uppercase tracking-[0.28em] text-teal">
            Iglesia cristiana
          </span>
        </span>
      )}
    </span>
  );
}