import { auth } from "@/auth";

export async function asegurarRol(...roles: string[]): Promise<{ id: string; name?: string | null }> {
  const sesion = await auth();
  const usuario = sesion?.user as { id: string; name?: string | null; roles?: string[] } | undefined;
  if (!usuario) {
    throw new Error("Sesión requerida.");
  }
  const permitido = roles.length === 0 || roles.some((r) => (usuario.roles ?? []).includes(r));
  if (!permitido) {
    throw new Error("No tienes permisos para esta acción.");
  }
  return { id: usuario.id, name: usuario.name ?? null };
}