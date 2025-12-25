// ============================================================
// GENERAL TAB SERVICE - Service isolé pour l'onglet General
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================
// Note: Ce tab reçoit les infos en props depuis index.tsx,
// donc pas de méthodes API ici. Fichier créé pour cohérence.
// ============================================================

import type { Hsm } from "../hsm.types";

// ============================================================
// HELPERS (isolés pour ce tab)
// ============================================================

/** Formate une date en français. */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

/** Retourne la classe CSS pour un état HSM. */
export function getStateClass(state: string): string {
  const classes: Record<string, string> = {
    active: "badge-success",
    inactive: "badge-warning",
    error: "badge-error",
  };
  return classes[state] || "badge-neutral";
}

// ============================================================
// SERVICE OBJECT (alternative export)
// ============================================================

export const generalService = {
  formatDate,
  getStateClass,
};
