import { Resend } from "resend";
import { SITE } from "@/lib/site";

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY no configurado. No se envió: "${opts.subject}" -> ${opts.to}`);
    return false;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: `${SITE.nombre} <no-reply@${new URL(SITE.url).hostname}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  if (error) console.error("[email] Error al enviar:", error);
  return !error;
}

function plantilla(titulo: string, filas: Array<[string, string]>, detalle?: string): string {
  return `
<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
  <div style="background:#10233f;color:#e8d1a3;padding:20px 28px;font-size:20px;font-weight:bold">
    ${SITE.nombre} · Notificación
  </div>
  <div style="padding:24px 28px">
    <h2 style="color:#10233f;margin:0 0 16px">${titulo}</h2>
    <table style="width:100%;border-collapse:collapse">
      ${filas
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 12px 8px 0;color:#71717a;white-space:nowrap;vertical-align:top;font-size:13px">${k}</td>
            <td style="padding:8px 0;color:#18181b;font-size:13px;word-break:break-word">${v}</td></tr>`
        )
        .join("")}
    </table>
    ${detalle ? `<p style="margin-top:16px;color:#52525b;font-size:13px">${detalle}</p>` : ""}
  </div>
  <div style="background:#f4f4f5;padding:14px 28px;font-size:11px;color:#a1a1aa">
    Mensaje enviado desde ${SITE.url} · Revisa todas las solicitudes en el portal interno.
  </div>
</div></body></html>`;
}

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function notificar(titulo: string, filas: Array<[string, string]>, detalle?: string) {
  return sendEmail({
    to: SITE.contacto.emailPastores,
    subject: `${titulo} · ${SITE.nombre}`,
    html: plantilla(
      titulo,
      filas.map(([k, v]) => [k, escapar(v)]),
      detalle ? escapar(detalle) : undefined
    ),
  });
}

export function notificarMensajeContacto(d: {
  nombre: string;
  contacto: string;
  categoria: string;
  mensaje: string;
}) {
  return notificar("Nuevo mensaje de contacto", [
    ["Categoría", d.categoria],
    ["Nombre", d.nombre],
    ["Contacto", d.contacto],
    ["Mensaje", d.mensaje],
  ]);
}

export function notificarInscripcion(titulo: string, d: Record<string, string>) {
  return notificar(titulo, Object.entries(d));
}