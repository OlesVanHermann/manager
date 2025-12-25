// ============================================================
// SERVICES TAB HELPERS - Helpers ISOLÉS (DÉFACTORISÉ)
// ============================================================

// Format date pour affichage FR
export const formatDate = (d: string): string =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
