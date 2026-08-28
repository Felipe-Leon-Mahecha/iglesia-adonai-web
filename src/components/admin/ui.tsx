import Link from "next/link";
import { cn } from "@/lib/utils";
import { roleLabel } from "@/lib/catalog";

export function Badge({ children, color = "navy", className }: { children: React.ReactNode; color?: "navy" | "teal" | "coral" | "beige" | "sage" | "gray"; className?: string }) {
  const colores = {
    navy: "bg-navy text-white",
    teal: "bg-teal-soft text-[#146b60]",
    coral: "bg-coral-soft text-coral",
    beige: "bg-beige-soft text-navy",
    sage: "bg-[#eef1e9] text-[#4d5a44]",
    gray: "bg-mist/50 text-navy/70",
  };
  return <span className={cn("chip", colores[color], className)}>{children}</span>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-navy/10 bg-white p-5", className)}>{children}</div>;
}

export function PageHeader({ titulo, descripcion, acciones }: { titulo: string; descripcion?: string; acciones?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">{titulo}</h1>
        {descripcion && <p className="mt-1 text-sm text-navy/60">{descripcion}</p>}
      </div>
      {acciones && <div className="flex gap-2">{acciones}</div>}
    </div>
  );
}

export function EmptyState({ titulo, detalle }: { titulo: string; detalle?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-navy/15 bg-white/60 px-6 py-10 text-center">
      <p className="font-medium text-navy">{titulo}</p>
      {detalle && <p className="mt-1 text-sm text-navy/60">{detalle}</p>}
    </div>
  );
}

export function RolesChips({ roles }: { roles: string[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {roles.map((r) => (
        <Badge key={r} color="beige">{roleLabel(r)}</Badge>
      ))}
    </span>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-navy/60", className)}>{children}</th>;
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 text-sm text-navy/90", className)}>{children}</td>;
}

export function LinkButton({ href, children, variant = "navy" }: { href: string; children: React.ReactNode; variant?: "navy" | "outline" }) {
  const clases = variant === "navy" ? "btn-teal" : "btn-outline";
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 !py-2 !text-sm", clases)}>
      {children}
    </Link>
  );
}