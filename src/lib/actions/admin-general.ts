"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { asegurarRol } from "@/lib/actions/guard";
import { stateError, stateOk, type ActionState } from "@/lib/actions/types";
import { slugify } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function marcarMensaje(campo: "estado", valor: string, id: string): Promise<void> {
  await asegurarRol("ADMIN");
  if (campo === "estado") {
    await db!.mensajeContacto.update({ where: { id }, data: { estado: valor } });
  }
  revalidatePath("/admin/inbox");
}

const esquemaMensajes = z.object({ estado: z.string().min(1) });

export async function cambiarEstadoMensajes(ids: string[], estado: string): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaMensajes.safeParse({ estado });
    if (!parsed.success || ids.length === 0) return stateError("Selecciona mensajes y un estado.");
    await db!.mensajeContacto.updateMany({ where: { id: { in: ids } }, data: { estado } });
    revalidatePath("/admin/inbox");
    return stateOk("Estado actualizado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

const esquemaUsuario = z.object({
  nombre: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).optional().or(z.literal("")),
});

export async function crearUsuarioAction(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const parsed = esquemaUsuario.safeParse({
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) return stateError("Verifica los campos del usuario.");
    const { nombre, email, password } = parsed.data;
    const roles = z
      .enum(["ADMIN", "CONTABILIDAD", "LOGISTICA", "ALABANZA", "EDITOR"])
      .array()
      .safeParse(formData.getAll("roles"));
    if (!roles.success) return stateError("Rol inválido.");

    const existente = await db!.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existente) return stateError("Ya existe un usuario con ese correo.");

    await db!.user.create({
      data: {
        name: nombre,
        email: email.toLowerCase(),
        passwordHash: password ? await bcrypt.hash(password, 10) : null,
        roles: roles.data,
      },
    });
    revalidatePath("/admin/usuarios");
    return stateOk("Usuario creado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function actualizarRolesUsuario(usuarioId: string, roles: string[]): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN");
    const rolesValidos = z
      .enum(["ADMIN", "CONTABILIDAD", "LOGISTICA", "ALABANZA", "EDITOR"])
      .array()
      .safeParse(roles);
    if (!rolesValidos.success) return stateError("Rol inválido.");
    await db!.user.update({ where: { id: usuarioId }, data: { roles: rolesValidos.data } });
    revalidatePath("/admin/usuarios");
    return stateOk("Roles actualizados.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarUsuario(usuarioId: string): Promise<void> {
  const yo = await asegurarRol("ADMIN");
  if (yo.id === usuarioId) return;
  await db!.user.delete({ where: { id: usuarioId } });
  revalidatePath("/admin/usuarios");
}

const esquemaEvento = z.object({
  titulo: z.string().min(2).max(200),
  descripcion: z.string().min(5).max(8000),
  lugar: z.string().max(200).optional().or(z.literal("")),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  fechaFin: z.string().optional().or(z.literal("")),
  imagen: z.string().max(1000).optional().or(z.literal("")),
  requiereInscripcion: z.enum(["si", "no"]),
  publicado: z.enum(["si", "no"]),
});

export async function crearEventoAction(formData: FormData, id?: string): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "EDITOR");
    const parsed = esquemaEvento.safeParse({
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion"),
      lugar: formData.get("lugar"),
      fecha: formData.get("fecha"),
      fechaFin: formData.get("fechaFin"),
      imagen: formData.get("imagen"),
      requiereInscripcion: formData.get("requiereInscripcion"),
      publicado: formData.get("publicado"),
    });
    if (!parsed.success) return stateError(parsed.error.issues[0]?.message ?? "Verifica los datos.");
    const d = parsed.data;
    const data = {
      titulo: d.titulo,
      descripcion: d.descripcion,
      lugar: d.lugar || null,
      fecha: new Date(d.fecha),
      fechaFin: d.fechaFin ? new Date(d.fechaFin) : null,
      imagen: d.imagen || null,
      requiereInscripcion: d.requiereInscripcion === "si",
      publicado: d.publicado === "si",
    };

    if (id) {
      const evento = await db!.evento.findUnique({ where: { id }, select: { slug: true } });
      await db!.evento.update({ where: { id }, data: { ...data, slug: evento?.slug ?? slugify(d.titulo) } });
      return stateOk("Evento actualizado.");
    }

    const slug = slugify(d.titulo);
    const existente = await db!.evento.findUnique({ where: { slug } });
    await db!.evento.create({ data: { ...data, slug: existente ? `${slug}-${Date.now() % 10000}` : slug } });
    revalidatePath("/admin/contenido");
    return stateOk("Evento creado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarEvento(id: string): Promise<void> {
  await asegurarRol("ADMIN", "EDITOR");
  await db!.evento.delete({ where: { id } });
  revalidatePath("/admin/contenido");
}

const esquemaSermon = z.object({
  titulo: z.string().min(2).max(200),
  serie: z.string().min(1).max(200),
  textoBiblico: z.string().max(200).optional().or(z.literal("")),
  fecha: z.string().min(1),
  imagen: z.string().max(1000).optional().or(z.literal("")),
  linkAudio: z.string().max(1000).optional().or(z.literal("")),
  linkVideo: z.string().max(1000).optional().or(z.literal("")),
  publicado: z.enum(["si", "no"]),
});

export async function crearSermonAction(formData: FormData, id?: string): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "EDITOR");
    const parsed = esquemaSermon.safeParse({
      titulo: formData.get("titulo"),
      serie: formData.get("serie"),
      textoBiblico: formData.get("textoBiblico"),
      fecha: formData.get("fecha"),
      imagen: formData.get("imagen"),
      linkAudio: formData.get("linkAudio"),
      linkVideo: formData.get("linkVideo"),
      publicado: formData.get("publicado"),
    });
    if (!parsed.success) return stateError(parsed.error.issues[0]?.message ?? "Verifica los datos.");
    const d = parsed.data;
    const data = {
      titulo: d.titulo,
      serie: d.serie,
      textoBiblico: d.textoBiblico || null,
      fecha: new Date(d.fecha),
      imagen: d.imagen || null,
      linkAudio: d.linkAudio || null,
      linkVideo: d.linkVideo || null,
      publicado: d.publicado === "si",
    };
    if (id) {
      await db!.sermon.update({ where: { id }, data });
      return stateOk("Sermón actualizado.");
    }
    await db!.sermon.create({ data });
    revalidatePath("/admin/contenido");
    return stateOk("Sermón creado.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarSermon(id: string): Promise<void> {
  await asegurarRol("ADMIN", "EDITOR");
  await db!.sermon.delete({ where: { id } });
  revalidatePath("/admin/contenido");
}

const esquemaFoto = z.object({ url: z.string().url(), descripcion: z.string().max(300).optional().or(z.literal("")) });

export async function agregarFotoGaleria(formData: FormData): Promise<ActionState> {
  try {
    await asegurarRol("ADMIN", "EDITOR");
    const parsed = esquemaFoto.safeParse({
      url: formData.get("url"),
      descripcion: formData.get("descripcion"),
    });
    if (!parsed.success) return stateError("La URL no es válida.");
    await db!.fotoGaleria.create({
      data: { url: parsed.data.url, descripcion: parsed.data.descripcion || null },
    });
    revalidatePath("/admin/contenido");
    return stateOk("Foto agregada.");
  } catch (e) {
    return stateError((e as Error).message);
  }
}

export async function eliminarFotoGaleria(id: string): Promise<void> {
  await asegurarRol("ADMIN", "EDITOR");
  await db!.fotoGaleria.delete({ where: { id } });
  revalidatePath("/admin/contenido");
}