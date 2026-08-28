"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { asegurarRol } from "@/lib/actions/guard";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";

const esquemaEtapa = z.object({ nombre: z.string().min(2).max(100) });

export async function crearEtapa(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaEtapa.safeParse({ nombre: formData.get("nombre") });
    if (!parsed.success) return stateError("Escribe un nombre para la etapa.");
    const maxOrden = await db!.etapaDiscipulado.aggregate({ _max: { orden: true } });
    await db!.etapaDiscipulado.create({ data: { nombre: parsed.data.nombre, orden: (maxOrden._max.orden ?? 0) + 1 } });
    revalidatePath("/admin/discipulado");
    return stateOk("Etapa creada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarEtapa(id: string): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const usada = await db!.discipulo.count({ where: { etapaId: id } });
    if (usada > 0) return stateError("No se puede eliminar: hay discípulos en esta etapa.");
    await db!.etapaDiscipulado.delete({ where: { id } });
    revalidatePath("/admin/discipulado");
    return stateOk("Etapa eliminada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

const esquemaDiscipulo = z.object({
  nombre: z.string().min(2).max(200),
  contacto: z.string().min(3).max(200),
  etapaId: z.string().min(1),
});

export async function crearDiscipulo(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaDiscipulo.safeParse({
      nombre: formData.get("nombre"),
      contacto: formData.get("contacto"),
      etapaId: formData.get("etapaId"),
    });
    if (!parsed.success) return stateError("Verifica los datos del discípulo.");
    await db!.discipulo.create({ data: parsed.data });
    revalidatePath("/admin/discipulado");
    return stateOk("Discípulo registrado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function cambiarEtapaDiscipulo(discipuloId: string, etapaId: string): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.discipulo.update({ where: { id: discipuloId }, data: { etapaId } });
  revalidatePath("/admin/discipulado");
}

export async function eliminarDiscipulo(discipuloId: string): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.discipulo.delete({ where: { id: discipuloId } });
  revalidatePath("/admin/discipulado");
}

const esquemaSeguimiento = z.object({
  nota: z.string().min(3, "Escribe una nota corta de la sesión.").max(2000),
});

export async function agregarSeguimiento(
  discipuloId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaSeguimiento.safeParse({ nota: formData.get("nota") });
    if (!parsed.success) return stateError(parsed.error.issues[0]?.message ?? "Escribe una nota.");
    await db!.seguimientoDiscipulado.create({
      data: { discipuloId, nota: parsed.data.nota },
    });
    revalidatePath("/admin/discipulado");
    return stateOk("Seguimiento guardado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}