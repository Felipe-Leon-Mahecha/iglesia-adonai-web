import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export type SesionAdmin = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    roles: string[];
  };
};

export async function obtenerSesion(): Promise<SesionAdmin | null> {
  const sesion = await auth();
  if (!sesion?.user) {
    redirect("/login");
  }
  return {
    user: {
      id: sesion.user.id,
      name: sesion.user.name,
      email: sesion.user.email,
      roles: sesion.user.roles ?? [],
    },
  };
}

export function tieneRol(sesion: SesionAdmin, ...roles: string[]): boolean {
  return roles.some((r) => sesion.user.roles.includes(r));
}

export async function requiereRoles(roles: string[]): Promise<SesionAdmin | null> {
  const sesion = await obtenerSesion();
  if (!sesion) return null;
  if (!tieneRol(sesion, ...roles)) {
    notFound();
  }
  return sesion;
}

export async function requiereAdmin(): Promise<SesionAdmin | null> {
  return requiereRoles(["ADMIN"]);
}