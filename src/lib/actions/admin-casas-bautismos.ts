"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { asegurarRol } from "@/lib/actions/guard";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";

const esquemaCohorte = z.object({
  fechaInicio: z.string().min(1),
  fechaFin: z.string().min(1),
  cupo: z.coerce.number().int().min(1).max(1000),
  activa: z.enum(["si", "no"]),
});

export async function crearCohorte(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaCohorte.safeParse({
      fechaInicio: formData.get("fechaInicio"),
      fechaFin: formData.get("fechaFin"),
      cupo: formData.get("cupo"),
      activa: formData.get("activa"),
    });
    if (!parsed.success) return stateError("Verifica los datos de la cohorte.");
    const d = parsed.data;
    if (new Date(d.fechaFin) <= new Date(d.fechaInicio)) {
      return stateError("La fecha de fin debe ser posterior al inicio.");
    }
    await db!.cohorteCasasOasis.create({
      data: {
        fechaInicio: new Date(d.fechaInicio),
        fechaFin: new Date(d.fechaFin),
        cupo: d.cupo,
        activa: d.activa === "si",
      },
    });
    revalidatePath("/admin/casas-oasis");
    revalidatePath("/casas-oasis");
    return stateOk("Cohorte creada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function alternarCohorte(id: string, activa: boolean): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.cohorteCasasOasis.update({ where: { id }, data: { activa } });
  revalidatePath("/admin/casas-oasis");
  revalidatePath("/casas-oasis");
}

export async function eliminarCohorte(id: string): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.cohorteCasasOasis.delete({ where: { id } });
  revalidatePath("/admin/casas-oasis");
  revalidatePath("/casas-oasis");
}

export async function cambiarEstadoInscripcionCasas(
  inscripcionId: string,
  estado: string
): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.inscripcionCasasOasis.update({ where: { id: inscripcionId }, data: { estado } });
  revalidatePath("/admin/casas-oasis");
  revalidatePath("/casas-oasis");
}

const esquemaEventoBautismo = z.object({
  fecha: z.string().min(1),
  lugar: z.string().min(2).max(300),
  requisitos: z.string().min(5).max(4000),
});

export async function crearEventoBautismo(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaEventoBautismo.safeParse({
      fecha: formData.get("fecha"),
      lugar: formData.get("lugar"),
      requisitos: formData.get("requisitos"),
    });
    if (!parsed.success) return stateError("Verifica los datos del evento.");
    const d = parsed.data;
    await db!.eventoBautismo.create({
      data: { fecha: new Date(d.fecha), lugar: d.lugar, requisitos: d.requisitos },
    });
    revalidatePath("/admin/bautismos");
    revalidatePath("/bautismos");
    return stateOk("Evento de bautismo creado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function actualizarEventoBautismo(id: string, formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaEventoBautismo.safeParse({
      fecha: formData.get("fecha"),
      lugar: formData.get("lugar"),
      requisitos: formData.get("requisitos"),
    });
    if (!parsed.success) return stateError("Verifica los datos del evento.");
    const d = parsed.data;
    await db!.eventoBautismo.update({
      where: { id },
      data: { fecha: new Date(d.fecha), lugar: d.lugar, requisitos: d.requisitos },
    });
    revalidatePath("/admin/bautismos");
    revalidatePath("/bautismos");
    return stateOk("Evento actualizado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarEventoBautismo(id: string): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.eventoBautismo.delete({ where: { id } });
  revalidatePath("/admin/bautismos");
  revalidatePath("/bautismos");
}

export async function cambiarEstadoInscripcionBautismo(
  inscripcionId: string,
  estado: string
): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.inscripcionBautismo.update({ where: { id: inscripcionId }, data: { estado } });
  revalidatePath("/admin/bautismos");
}

export async function eliminarInscripcionBautismo(inscripcionId: string): Promise<void> {
  await asegurarRol("ADMIN");
  await db!.inscripcionBautismo.delete({ where: { id: inscripcionId } });
  revalidatePath("/admin/bautismos");
}