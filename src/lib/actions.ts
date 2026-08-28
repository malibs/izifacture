export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export function failure(error: string): ActionResult {
  return { ok: false, error };
}
