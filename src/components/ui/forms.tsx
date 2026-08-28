"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, pendingLabel = "Enviando…", className }: { children: React.ReactNode; pendingLabel?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className ?? "btn-primary w-full"}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormResulto({ estado }: { estado: { ok: boolean; error?: string; mensaje?: string } }) {
  if (!estado.ok && !estado.error) return null;
  return (
    <div
      role="status"
      className={
        estado.ok && !estado.error
          ? "rounded-lg border border-teal/30 bg-teal-soft px-4 py-3 text-sm text-teal"
          : "rounded-lg border border-coral/30 bg-coral-soft px-4 py-3 text-sm text-coral"
      }
    >
      {estado.ok ? (estado.mensaje ?? "Listo.") : estado.error}
    </div>
  );
}