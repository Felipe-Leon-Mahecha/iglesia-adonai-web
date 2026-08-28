"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { obtenerSesion } from "@/lib/role";
import { sendEmail } from "@/lib/mail";
import { SITE } from "@/lib/site";
import type { ActionState } from "@/lib/actions/types";
import { stateOk, stateError } from "@/lib/actions/types";

export async function iniciarSesion(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");

  try {
    await signIn("credentials", { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Correo o contraseña incorrectos." };
    }
    throw error;
  }
  redirect(callbackUrl);
}

export async function iniciarSesionGoogle(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");
  await signIn("google", { redirectTo: callbackUrl });
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/" });
}

const esquemaNuevaContrasena = z
  .object({
    actual: z.string().min(1),
    nueva: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirma: z.string().min(1),
  })
  .refine((d) => d.nueva === d.confirma, { message: "Las contraseñas no coinciden." });

export async function cambiarContrasena(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const sesion = await obtenerSesion();
  if (!sesion) return stateError("Debes iniciar sesión.");

  const parsed = esquemaNuevaContrasena.safeParse({
    actual: formData.get("actual"),
    nueva: formData.get("nueva"),
    confirma: formData.get("confirma"),
  });
  if (!parsed.success) {
    const mensaje = parsed.error.issues[0]?.message ?? "Verifica los datos.";
    return stateError(mensaje);
  }

  if (!db) return stateError("Base de datos no disponible.");
  const usuario = await db.user.findUnique({ where: { id: sesion.user.id } });
  if (!usuario?.passwordHash) {
    return stateError("Tu cuenta se maneja con Google y no tiene contraseña.");
  }

  const coincide = await bcrypt.compare(parsed.data.actual, usuario.passwordHash);
  if (!coincide) return stateError("La contraseña actual no es correcta.");

  const nuevoHash = await bcrypt.hash(parsed.data.nueva, 10);
  await db.user.update({ where: { id: usuario.id }, data: { passwordHash: nuevoHash } });
  return stateOk("Contraseña actualizada correctamente.");
}

const VIGENCIA_RESET = 1000 * 60 * 30;

function tokenReset(): string {
  return randomBytes(32).toString("hex");
}

export async function solicitarResetContrasena(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!db) return stateOk("Si el correo existe, recibirás un mensaje con las instrucciones.");

  const usuario = await db.user.findUnique({ where: { email } });
  if (!usuario) return stateOk("Si el correo existe, recibirás un mensaje con las instrucciones.");

  const token = tokenReset();
  await db.verificationToken.deleteMany({ where: { identifier: email } });
  await db.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + VIGENCIA_RESET) },
  });

  const enlace = `${SITE.url}/recuperar-contrasena/${token}`;
  const enviado = await sendEmail({
    to: email,
    subject: "Recupera tu contraseña · ADONAI",
    html: `
<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
  <div style="background:#10233f;color:#e8d1a3;padding:20px 28px;font-size:20px;font-weight:bold">ADONAI · Recuperar contraseña</div>
  <div style="padding:24px 28px">
    <p style="margin:0 0 16px;color:#18181b">Recibimos una solicitud para restablecer tu contraseña. El enlace es válido por 30 minutos.</p>
    <a href="${enlace}" style="display:inline-block;background:#e04453;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Restablecer contraseña</a>
    <p style="margin-top:16px;color:#52525b;font-size:13px">Si no fuiste tú, ignora este correo.</p>
  </div>
</div></body></html>`,
  });
  if (!enviado) console.warn(`[reset] Enlace temporal en desarrollo: ${enlace}`);
  return stateOk("Si el correo existe, recibirás un mensaje con las instrucciones.");
}

const esquemaRestablecer = z
  .object({
    token: z.string().min(1),
    nueva: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirma: z.string().min(1),
  })
  .refine((d) => d.nueva === d.confirma, { message: "Las contraseñas no coinciden." });

export async function restablecerContrasena(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = esquemaRestablecer.safeParse({
    token: formData.get("token"),
    nueva: formData.get("nueva"),
    confirma: formData.get("confirma"),
  });
  if (!parsed.success) {
    const mensaje = parsed.error.issues[0]?.message ?? "Verifica los datos.";
    return stateError(mensaje);
  }
  if (!db) return stateError("Base de datos no disponible.");

  const registro = await db.verificationToken.findFirst({
    where: { token: parsed.data.token },
  });
  if (!registro || registro.expires < new Date()) {
    return stateError("El enlace es inválido o ya expiró. Solicita uno nuevo.");
  }

  const hash = await bcrypt.hash(parsed.data.nueva, 10);
  await db.user.update({ where: { email: registro.identifier }, data: { passwordHash: hash } });
  await db.verificationToken.deleteMany({ where: { identifier: registro.identifier } });
  return stateOk("Contraseña restablecida. Ya puedes iniciar sesión.");
}