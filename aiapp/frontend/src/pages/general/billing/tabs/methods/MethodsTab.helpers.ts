// ============================================================
// METHODS TAB HELPERS - Helpers ISOLÉS (DÉFACTORISÉ)
// ============================================================

// Format date mois/année
export const formatDateMonth = (d: string | null): string | null =>
  d ? new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;
