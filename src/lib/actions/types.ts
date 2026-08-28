export type ActionState = {
  ok: boolean;
  error?: string;
  mensaje?: string;
};

export function stateOk(mensaje: string): ActionState {
  return { ok: true, mensaje };
}

export function stateError(error: string): ActionState {
  return { ok: false, error };
}