"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { asegurarRol } from "@/lib/actions/guard";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";

const esquemaTransaccion = z.object({
  tipo: z.enum(["INGRESO", "EGRESO"]),
  categoriaId: z.string().min(1),
  monto: z.coerce.number().int().min(1, "El monto debe ser mayor a 0."),
  fecha: z.string().min(1),
  nota: z.string().max(1000).optional().or(z.literal("")),
});

export async function crearTransaccion(formData: FormData): Promise<ActionState> {
  try {
    const usuario = await asegurarRol("ADMIN", "CONTABILIDAD");
    const parsed = esquemaTransaccion.safeParse({
      tipo: formData.get("tipo"),
      categoriaId: formData.get("categoriaId"),
      monto: formData.get("monto"),
      fecha: formData.get("fecha"),
      nota: formData.get("nota"),
    });
    if (!parsed.success) return stateError(parsed.error.issues[0]?.message ?? "Verifica los datos.");
    const d = parsed.data;
    const cat = await db!.categoriaTransaccion.findUnique({ where: { id: d.categoriaId } });
    if (!cat || cat.tipo !== d.tipo) return stateError("Categoría incompatible con el tipo.");

    await db!.transaccion.create({
      data: {
        tipo: d.tipo,
        categoriaId: d.categoriaId,
        monto: d.monto,
        fecha: new Date(d.fecha),
        nota: d.nota || null,
        registradoPor: usuario.id,
      },
    });
    revalidatePath("/admin/contabilidad");
    return stateOk("Transacción registrada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarTransaccion(id: string): Promise<void> {
  await asegurarRol("ADMIN", "CONTABILIDAD");
  await db!.transaccion.delete({ where: { id } });
  revalidatePath("/admin/contabilidad");
}

const esquemaCategoria = z.object({
  tipo: z.enum(["INGRESO", "EGRESO"]),
  nombre: z.string().min(2).max(100),
});

export async function crearCategoria(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "CONTABILIDAD");
    const parsed = esquemaCategoria.safeParse({ tipo: formData.get("tipo"), nombre: formData.get("nombre") });
    if (!parsed.success) return stateError("Verifica los datos de la categoría.");
    const maxOrden = await db!.categoriaTransaccion.aggregate({
      where: { tipo: parsed.data.tipo },
      _max: { orden: true },
    });
    await db!.categoriaTransaccion.create({
      data: {
        tipo: parsed.data.tipo,
        nombre: parsed.data.nombre,
        orden: (maxOrden._max.orden ?? 0) + 1,
      },
    });
    revalidatePath("/admin/contabilidad");
    return stateOk("Categoría creada.");
  } catch {
    return stateError("Esa categoría ya existe.");
  }
}

export async function eliminarCategoria(id: string): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "CONTABILIDAD");
    const usada = await db!.transaccion.count({ where: { categoriaId: id } });
    if (usada > 0) return stateError("No se puede eliminar: tiene transacciones asociadas.");
    await db!.categoriaTransaccion.delete({ where: { id } });
    revalidatePath("/admin/contabilidad");
    return stateOk("Categoría eliminada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}