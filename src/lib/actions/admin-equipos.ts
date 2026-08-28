"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { asegurarRol } from "@/lib/actions/guard";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";
import { SERVICIO_TIPOS, ROLES_SERVICIO } from "@/lib/catalog";

const esquemaServidor = z.object({
  nombre: z.string().min(2).max(200),
  telefono: z.string().max(100).optional().or(z.literal("")),
  correo: z.string().max(200).optional().or(z.literal("")),
});

const rolesValidos = z.enum([...ROLES_SERVICIO] as [string, ...string[]]).array().safeParse;

export async function crearServidor(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "LOGISTICA");
    const parsed = esquemaServidor.safeParse({
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      correo: formData.get("correo"),
    });
    if (!parsed.success) return stateError("Verifica los datos.");
    const roles = rolesValidos(formData.getAll("roles"));
    if (!roles.success) return stateError("Rol de servicio inválido.");
    await db!.servidor.create({
      data: {
        nombre: parsed.data.nombre,
        telefono: parsed.data.telefono || null,
        correo: parsed.data.correo || null,
        rolesServicio: roles.data,
      },
    });
    revalidatePath("/admin/servidores");
    return stateOk("Servidor agregado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarServidor(id: string): Promise<void> {
  await asegurarRol("ADMIN", "LOGISTICA");
  await db!.servidor.delete({ where: { id } });
  revalidatePath("/admin/servidores");
}

export async function actualizarRolesServidor(id: string, roles: string[]): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "LOGISTICA");
    const parsed = rolesValidos(roles);
    if (!parsed.success) return stateError("Rol inválido.");
    await db!.servidor.update({ where: { id }, data: { rolesServicio: parsed.data } });
    revalidatePath("/admin/servidores");
    return stateOk("Roles actualizados.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

const esquemaServicio = z.object({
  tipo: z.string().refine((v) => SERVICIO_TIPOS.some((t) => t.id === v), "Tipo inválido."),
  fecha: z.string().min(1),
});

export async function crearServicio(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "LOGISTICA");
    const parsed = esquemaServicio.safeParse({ tipo: formData.get("tipo"), fecha: formData.get("fecha") });
    if (!parsed.success) return stateError("Verifica los datos del servicio.");
    const tipo = parsed.data.tipo;
    const fecha = new Date(parsed.data.fecha);
    const existente = await db!.servicio.findFirst({
      where: { tipo, fecha: { equals: fecha } },
    });
    if (existente) return stateError("Ya existe un servicio de ese tipo para esa fecha.");
    await db!.servicio.create({ data: { tipo, fecha } });
    revalidatePath("/admin/servidores");
    return stateOk("Servicio creado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarServicio(id: string): Promise<void> {
  await asegurarRol("ADMIN", "LOGISTICA");
  await db!.servicio.delete({ where: { id } });
  revalidatePath("/admin/servidores");
}

export async function agregarAsignacion(
  servicioId: string,
  servidorId: string,
  rolServicio: string
): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "LOGISTICA");
    await db!.asignacion.create({ data: { servicioId, servidorId, rolServicio } });
    revalidatePath("/admin/servidores");
    return stateOk("Asignación creada.");
  } catch {
    return stateError("Ese servidor ya está asignado a ese rol en este servicio.");
  }
}

export async function quitarAsignacion(id: string): Promise<void> {
  await asegurarRol("ADMIN", "LOGISTICA");
  await db!.asignacion.delete({ where: { id } });
  revalidatePath("/admin/servidores");
}

const esquemaCancion = z.object({
  titulo: z.string().min(2).max(200),
  tono: z.string().max(20).optional().or(z.literal("")),
  linkLetra: z.string().url().optional().or(z.literal("")),
  linkPista: z.string().url().optional().or(z.literal("")),
});

export async function crearCancion(formData: FormData, id?: string): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "ALABANZA");
    const parsed = esquemaCancion.safeParse({
      titulo: formData.get("titulo"),
      tono: formData.get("tono"),
      linkLetra: formData.get("linkLetra"),
      linkPista: formData.get("linkPista"),
    });
    if (!parsed.success) return stateError(parsed.error.issues[0]?.message ?? "Verifica los datos.");
    const d = parsed.data;
    if (id) {
      await db!.cancion.update({
        where: { id },
        data: { titulo: d.titulo, tono: d.tono || null, linkLetra: d.linkLetra || null, linkPista: d.linkPista || null },
      });
      return stateOk("Canción actualizada.");
    }
    await db!.cancion.create({
      data: { titulo: d.titulo, tono: d.tono || null, linkLetra: d.linkLetra || null, linkPista: d.linkPista || null },
    });
    revalidatePath("/admin/alabanza");
    return stateOk("Canción guardada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarCancion(id: string): Promise<void> {
  await asegurarRol("ADMIN", "ALABANZA");
  await db!.cancion.delete({ where: { id } });
  revalidatePath("/admin/alabanza");
}

export async function crearSetlist(servicioId: string, cancionIds: string[]): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "ALABANZA");
    const servicio = await db!.servicio.findUnique({ where: { id: servicioId } });
    if (!servicio) return stateError("Servicio no encontrado.");
    const max = SERVICIO_TIPOS.find((t) => t.id === servicio.tipo)?.maxCanciones ?? 6;
    if (cancionIds.length === 0) return stateError("Elige al menos una canción.");
    if (cancionIds.length > max) return stateError(`Máximo ${max} canciones para este servicio.`);
    const canceladas = cancionIds.filter((c) => !c);
    const unicas = [...new Set(canceladas.length ? cancionIds : cancionIds)];
    await db!.setlist.upsert({
      where: { servicioId },
      update: {},
      create: { servicioId },
    });
    const setlist = await db!.setlist.findUniqueOrThrow({ where: { servicioId } });
    await db!.setlistCancion.deleteMany({ where: { setlistId: setlist.id } });
    await db!.setlistCancion.createMany({
      data: unicas.map((cancionId, i) => ({ setlistId: setlist.id, cancionId, orden: i + 1 })),
    });
    revalidatePath("/admin/alabanza");
    return stateOk("Setlist guardado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function quitarCancionSetlist(setlistId: string, cancionSetlistId: string): Promise<void> {
  await asegurarRol("ADMIN", "ALABANZA");
  await db!.setlistCancion.delete({ where: { id: cancionSetlistId } });
  revalidatePath("/admin/alabanza");
}