import { cn } from "@/lib/utils";

export function PageHero({
  kicker,
  titulo,
  descripcion,
  children,
}: {
  kicker?: string;
  titulo: string;
  descripcion?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-navy/10 bg-navy text-white">
      <div className="container-site py-14 md:py-20">
        {kicker && <p className="kicker"><span className={cn("h-px w-8", "bg-teal")} />{kicker}</p>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-balance md:text-5xl">
          {titulo}
        </h1>
        {descripcion && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">{descripcion}</p>}
        {children}
      </div>
    </section>
  );
}