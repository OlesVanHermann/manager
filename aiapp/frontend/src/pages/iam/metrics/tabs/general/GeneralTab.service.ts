// ============================================================
// GENERAL TAB SERVICE - Service isolé pour l'onglet General
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import type { MetricsService } from "../metrics.types";

// ============================================================
// HELPERS (isolés pour ce tab)
// ============================================================

/** Calcule le pourcentage de quota utilisé. */
export function getQuotaPercent(current: number, max: number): number {
  return Math.round((current / max) * 100);
}

/** Retourne la classe CSS selon le pourcentage d'utilisation. */
export function getQuotaClass(percent: number): string {
  if (percent >= 90) return "danger";
  if (percent >= 70) return "warning";
  return "";
}

/** Formate un nombre en français. */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num);
}

/** Formate une date en français. */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

// ============================================================
// SERVICE OBJECT (alternative export)
// ============================================================

export const generalService = {
  getQuotaPercent,
  getQuotaClass,
  formatNumber,
  formatDate,
};
