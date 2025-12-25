// ============================================================
// VOUCHERS TAB HELPERS - Helpers ISOLÉS (DÉFACTORISÉ)
// ============================================================

export const formatDate = (d: string): string =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function isNotFoundError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes("404") || msg.includes("not found") || msg.includes("does not exist");
  }
  return false;
}
