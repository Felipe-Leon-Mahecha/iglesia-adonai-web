export const ROLES = {
  ADMIN: "ADMIN",
  CONTABILIDAD: "CONTABILIDAD",
  LOGISTICA: "LOGISTICA",
  ALABANZA: "ALABANZA",
  EDITOR: "EDITOR",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Pastor / Admin",
  CONTABILIDAD: "Contabilidad",
  LOGISTICA: "Logística",
  ALABANZA: "Alabanza",
  EDITOR: "Editor de contenido",
};

export const SERVICIO_TIPOS = [
  { id: "DOMINGO", label: "Domingo", maxCanciones: 6 },
  { id: "MIERCOLES", label: "Miércoles noche", maxCanciones: 3 },
  { id: "ESPECIAL", label: "Especial", maxCanciones: 6 },
] as const;

export const ROLES_SERVICIO = [
  "Sonido",
  "Video",
  "Streaming",
  "Ujier",
  "Música",
  "Recepción",
] as const;

export const ESTADOS_MENSAJE = ["PENDIENTE", "ATENDIDO"] as const;

export const ESTADOS_BAUTISMO = [
  { id: "NUEVO", label: "Nuevo" },
  { id: "CONTACTADO", label: "Contactado" },
  { id: "TOMO_CHARLA", label: "Tomó charla" },
  { id: "CONFIRMADO", label: "Confirmado" },
] as const;

export const ESTADOS_CASAS_OASIS = [
  { id: "INSCRITO", label: "Inscrito" },
  { id: "CONTACTADO", label: "Contactado" },
  { id: "ACTIVO", label: "Activo" },
  { id: "COMPLETADO", label: "Completado" },
] as const;

export const CATEGORIA_MENSAJE_LABELS: Record<string, string> = {
  JOVENES: "Jóvenes",
  ASESORIA_FAMILIAR: "Asesoría familiar",
  ORACION: "Ayuda espiritual / oración",
  VISITANTE: "Nuevo / visitante",
  OTRO: "Otro",
};

export function categoriaLabel(id: string): string {
  return CATEGORIA_MENSAJE_LABELS[id] ?? id;
}

export function servicioTipoLabel(id: string): string {
  return SERVICIO_TIPOS.find((t) => t.id === id)?.label ?? id;
}

export function roleLabel(id: string): string {
  return ROLE_LABELS[id] ?? id;
}