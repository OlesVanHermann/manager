// ============================================================
// REFERENCES TAB HELPERS - Helpers ISOLÉS (DÉFACTORISÉ)
// ============================================================

export const formatDateLong = (d: string): string =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export const formatDateInput = (d: string): string =>
  d ? new Date(d).toISOString().split("T")[0] : "";

export function isNotFoundError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes("404") || msg.includes("not found") || msg.includes("does not exist");
  }
  return false;
}
