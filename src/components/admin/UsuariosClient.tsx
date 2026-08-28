"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, UserPlus, Trash2, ShieldCheck } from "lucide-react";
import { crearUsuarioAction, actualizarRolesUsuario, eliminarUsuario } from "@/lib/actions/admin-general";
import { SubmitButton, FormResulto } from "@/components/ui/forms";
import { EmptyState, Td, Th } from "@/components/admin/ui";
import { ROLES, ROLE_LABELS, roleLabel } from "@/lib/catalog";
import { formatFecha } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/types";

const estadoInicial: ActionState = { ok: false };
const OPCIONES = [ROLES.ADMIN, ROLES.CONTABILIDAD, ROLES.LOGISTICA, ROLES.ALABANZA, ROLES.EDITOR];

export type UsuarioRow = { id: string; name: string; email: string; roles: string[]; createdAt: string };

export function UsuariosClient({ usuarios, yoId }: { usuarios: UsuarioRow[]; yoId: string }) {
  const router = useRouter();
  const [estado, formAction] = useActionState(
    (_prev: ActionState, fd: FormData) => crearUsuarioAction(fd),
    estadoInicial
  );
  const [abrirNuevo, setAbrirNuevo] = useState(false);

  async function cambiarRol(u: UsuarioRow, rol: string, on: boolean) {
    const roles = on ? [...new Set([...u.roles, rol])] : u.roles.filter((r) => r !== rol);
    const res = await actualizarRolesUsuario(u.id, roles);
    if (res.ok) router.refresh();
  }

  async function borrar(u: UsuarioRow) {
    if (!confirm(`¿Eliminar a ${u.name}? Esta acción no se puede deshacer.`)) return;
    await eliminarUsuario(u.id);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <button type="button" onClick={() => setAbrirNuevo((v) => !v)} className="btn-teal">
        <Plus className="h-4 w-4" /> {abrirNuevo ? "Cerrar" : "Nuevo usuario"}
      </button>

      {abrirNuevo && (
        <form action={formAction} className="card">
          <h2 className="font-display text-lg font-bold text-navy">Crear usuario del staff</h2>
          <p className="mt-1 text-xs text-navy/60">
            La contraseña se usa para entrar al portal. Recomendamos correos @adonai.com.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="u-nombre" className="label">Nombre</label>
              <input id="u-nombre" name="nombre" required className="input" />
            </div>
            <div>
              <label htmlFor="u-email" className="label">Correo</label>
              <input id="u-email" name="email" type="email" required className="input" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="u-password" className="label">Contraseña (mínimo 8 caracteres)</label>
              <input id="u-password" name="password" type="password" required minLength={8} className="input" autoComplete="new-password" />
            </div>
            <div className="sm:col-span-2">
              <span className="label">Roles</span>
              <div className="flex flex-wrap gap-3">
                {OPCIONES.map((r) => (
                  <label key={r} className="label-inline inline-flex items-center gap-2">
                    <input type="checkbox" name="roles" value={r} className="accent-teal" /> {roleLabel(r)}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <SubmitButton className="btn-navy">
              <UserPlus className="h-4 w-4" /> Crear usuario
            </SubmitButton>
            <FormResulto estado={estado} />
          </div>
        </form>
      )}

      {usuarios.length === 0 ? (
        <EmptyState titulo="Sin usuarios" detalle="Crea el primer usuario del staff." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-navy/10 bg-[#fafafa]">
              <tr>
                <Th>Usuario</Th>
                <Th>Roles</Th>
                <Th>Creado</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <Td>
                    <p className="font-semibold text-navy">
                      {u.name} {u.id === yoId && <span className="font-normal text-navy/40">(tú)</span>}
                    </p>
                    <p className="text-xs text-navy/50">{u.email}</p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {OPCIONES.map((r) => (
                        <label key={r} className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${u.roles.includes(r) ? "border-navy bg-navy text-white" : "border-mist bg-white text-navy/50 hover:border-navy/30"}`}>
                          <input
                            type="checkbox"
                            checked={u.roles.includes(r)}
                            onChange={(e) => cambiarRol(u, r, e.target.checked)}
                            className="sr-only"
                          />
                          <ShieldCheck className="h-3 w-3" />
                          {ROLE_LABELS[r] ?? r}
                        </label>
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <span className="text-xs text-navy/50">{formatFecha(u.createdAt)}</span>
                  </Td>
                  <Td>
                    {u.id !== yoId && (
                      <button type="button" onClick={() => borrar(u)} className="rounded-lg p-2 text-navy/40 transition-colors hover:bg-coral-soft hover:text-coral" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}