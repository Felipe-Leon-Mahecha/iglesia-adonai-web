"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { notificarMensajeContacto } from "@/lib/mail";
import { categoriaLabel } from "@/lib/catalog";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";

const esquema = z.object({
  nombre: z.string().min(2, "Escribe tu nombre.").max(120),
  contacto: z.string().min(3, "Escribe un WhatsApp o correo válido.").max(200),
  mensaje: z.string().min(5, "Cuéntanos un poco más.").max(3000),
});

export async function guardarMensajeContacto(
  categoria: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = esquema.safeParse({
    nombre: formData.get("nombre"),
    contacto: formData.get("contacto"),
    mensaje: formData.get("mensaje"),
  });
  if (!parsed.success) {
    return stateError(parsed.error.issues[0]?.message ?? "Verifica los campos.");
  }

  const { nombre, contacto, mensaje } = parsed.data;

  if (db) {
    await db.mensajeContacto.create({
      data: { nombre, contacto, categoria, mensaje },
    });
  }

  await notificarMensajeContacto({
    nombre,
    contacto,
    categoria: categoriaLabel(categoria),
    mensaje,
  });

  return stateOk("¡Recibido! Te responderemos pronto.");
}