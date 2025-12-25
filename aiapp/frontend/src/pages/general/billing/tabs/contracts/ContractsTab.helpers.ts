// ============================================================
// CONTRACTS TAB HELPERS - Helpers ISOLÉS (DÉFACTORISÉ)
// ============================================================

export const formatDateLong = (d: string): string =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
