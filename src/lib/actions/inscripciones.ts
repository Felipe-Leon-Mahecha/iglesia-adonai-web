"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { notificarInscripcion } from "@/lib/mail";
import { formatFecha } from "@/lib/utils";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";

const esquemaBautismo = z.object({
  nombre: z.string().min(2, "Escribe tu nombre.").max(120),
  edad: z.coerce.number().int().min(8, "La edad debe ser un número válido.").max(120),
  contacto: z.string().min(3, "Escribe un WhatsApp o correo válido.").max(200),
  tomoCharla: z.enum(["si", "no"]),
  comentario: z.string().max(2000).optional().or(z.literal("")),
});

export async function inscribirseBautismo(
  eventoId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = esquemaBautismo.safeParse({
    nombre: formData.get("nombre"),
    edad: formData.get("edad"),
    contacto: formData.get("contacto"),
    tomoCharla: formData.get("tomoCharla"),
    comentario: formData.get("comentario"),
  });
  if (!parsed.success) {
    return stateError(parsed.error.issues[0]?.message ?? "Verifica los campos.");
  }

  const { nombre, edad, contacto, tomoCharla, comentario } = parsed.data;

  if (db) {
    await db.inscripcionBautismo.create({
      data: {
        eventoBautismoId: eventoId,
        nombre,
        edad,
        contacto,
        tomoCharla: tomoCharla === "si",
        comentario: comentario || null,
      },
    });
  }

  await notificarInscripcion("Nueva inscripción a bautismos", {
    Nombre: nombre,
    Edad: String(edad),
    Contacto: contacto,
    "Tomó charla de preparación": tomoCharla === "si" ? "Sí" : "No",
    Comentario: comentario || "—",
  });

  return stateOk(
    tomoCharla === "si"
      ? "¡Inscripción recibida! Te contactaremos con la información del evento."
      : "¡Inscripción recibida! Te contactaremos para agendar la charla de preparación."
  );
}

const esquemaCasas = z.object({
  nombre: z.string().min(2, "Escribe tu nombre.").max(120),
  contacto: z.string().min(3, "Escribe un WhatsApp o correo válido.").max(200),
  comentario: z.string().max(2000).optional().or(z.literal("")),
});

export async function inscribirseCasasOasis(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const cohorteId = String(formData.get("cohorteId") ?? "");
  if (!cohorteId) return stateError("Selecciona una cohorte.");
  const parsed = esquemaCasas.safeParse({
    nombre: formData.get("nombre"),
    contacto: formData.get("contacto"),
    comentario: formData.get("comentario"),
  });
  if (!parsed.success) {
    return stateError(parsed.error.issues[0]?.message ?? "Verifica los campos.");
  }

  const { nombre, contacto, comentario } = parsed.data;

  let cohorteFecha: Date | null = null;
  if (db) {
    const cohorte = await db.cohorteCasasOasis.findUnique({
      where: { id: cohorteId },
      select: { fechaInicio: true, cupo: true, _count: { select: { inscripciones: true } } },
    });
    if (!cohorte) return stateError("La cohorte seleccionada ya no está disponible.");
    if (cohorte._count.inscripciones >= cohorte.cupo) {
      return stateError("El cupo de esta cohorte ya está lleno.");
    }
    await db.inscripcionCasasOasis.create({
      data: { cohorteId, nombre, contacto, comentario: comentario || null },
    });
    cohorteFecha = cohorte.fechaInicio;
  }

  await notificarInscripcion("Nueva inscripción a Casas Oasis", {
    Nombre: nombre,
    Contacto: contacto,
    "Cohorte (inicia)": cohorteFecha ? formatFecha(cohorteFecha) : "[PENDIENTE]",
    Comentario: comentario || "—",
  });

  return stateOk("¡Inscripción confirmada! Nos comunicaremos contigo antes del inicio.");
}

const esquemaEvento = z.object({
  nombre: z.string().min(2, "Escribe tu nombre.").max(120),
  contacto: z.string().min(3, "Escribe un WhatsApp o correo válido.").max(200),
  comentario: z.string().max(2000).optional().or(z.literal("")),
});

export async function inscribirseEvento(
  eventoId: string,
  titulo: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = esquemaEvento.safeParse({
    nombre: formData.get("nombre"),
    contacto: formData.get("contacto"),
    comentario: formData.get("comentario"),
  });
  if (!parsed.success) {
    return stateError(parsed.error.issues[0]?.message ?? "Verifica los campos.");
  }

  const { nombre, contacto, comentario } = parsed.data;

  if (db) {
    await db.inscripcionEvento.create({
      data: { eventoId, nombre, contacto, comentario: comentario || null },
    });
  }

  await notificarInscripcion(`Inscripción a evento: ${titulo}`, {
    Nombre: nombre,
    Contacto: contacto,
    Comentario: comentario || "—",
  });

  return stateOk("¡Inscripción confirmada! Te esperamos.");
}