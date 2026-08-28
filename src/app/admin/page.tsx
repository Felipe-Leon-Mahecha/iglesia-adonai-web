import Link from "next/link";
import { Inbox, Wallet, ClipboardList, Music, BookOpen, Home, Waves, PencilRuler, Users, InboxIcon } from "lucide-react";
import { obtenerSesion, tieneRol } from "@/lib/role";
import { getDashboardResumen } from "@/lib/queries";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MODULOS = [
  { href: "/admin/inbox", label: "Inbox de contacto", desc: "Mensajes de la comunidad", icon: Inbox, roles: ["ADMIN"] },
  { href: "/admin/contabilidad", label: "Contabilidad", desc: "Ingresos y egresos", icon: Wallet, roles: ["ADMIN", "CONTABILIDAD"] },
  { href: "/admin/servidores", label: "Servidores", desc: "Servicios y asignaciones", icon: ClipboardList, roles: ["ADMIN", "LOGISTICA"] },
  { href: "/admin/alabanza", label: "Alabanza", desc: "Canciones y setlists", icon: Music, roles: ["ADMIN", "ALABANZA"] },
  { href: "/admin/discipulado", label: "Discipulado", desc: "Etapas y seguimiento", icon: BookOpen, roles: ["ADMIN"] },
  { href: "/admin/casas-oasis", label: "Casas Oasis", desc: "Cohortes e inscritos", icon: Home, roles: ["ADMIN"] },
  { href: "/admin/bautismos", label: "Bautismos", desc: "Inscritos y charla", icon: Waves, roles: ["ADMIN"] },
  { href: "/admin/contenido", label: "Contenido web", desc: "Eventos, sermones, galería", icon: PencilRuler, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/usuarios", label: "Usuarios", desc: "Roles del staff", icon: Users, roles: ["ADMIN"] },
];

export default async function DashboardAdminPage() {
  const sesion = await obtenerSesion();
  if (!sesion) return null;

  const resumen = await getDashboardResumen();
  const modulos = MODULOS.filter((m) => tieneRol(sesion, ...m.roles));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy">Hola, {sesion.user.name ?? "staff"} 👋</h1>
        <p className="mt-1 text-sm text-navy/60">Este es el panel de administración de ADONAI.</p>
      </div>

      {resumen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard titulo="Mensajes pendientes" valor={String(resumen.mensajesPendientes)} tono="coral" icon={InboxIcon} />
          <StatCard titulo="Inscripciones totales" valor={String(resumen.totalInscripciones)} tono="teal" icon={Users} />
          <StatCard titulo="Ingresos registrados" valor={formatCOP(resumen.ingresos)} tono="sage" icon={Wallet} />
          <StatCard titulo="Próximo evento" valor={resumen.proximoCulto ? formatFecha(resumen.proximoCulto.fecha).split(",")[1] ?? "Pronto" : "Sin eventos"} tono="beige" icon={PencilRuler} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((m) => (
          <Link key={m.href} href={m.href} className="card group flex items-center gap-4 transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-beige">
              <m.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-navy">{m.label}</p>
              <p className="text-xs text-navy/55">{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ titulo, valor, tono, icon: Icon }: { titulo: string; valor: string; tono: "coral" | "teal" | "sage" | "beige"; icon: typeof Users }) {
  const tonos = {
    coral: "bg-coral-soft text-coral",
    teal: "bg-teal-soft text-teal",
    sage: "bg-[#eef1e9] text-[#4d5a44]",
    beige: "bg-beige-soft text-navy",
  };
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tonos[tono]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-navy">{valor}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-navy/50">{titulo}</p>
    </div>
  );
}