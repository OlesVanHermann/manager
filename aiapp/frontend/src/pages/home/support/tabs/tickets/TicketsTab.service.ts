// ============================================================
// TICKETS TAB SERVICE - Service ISOLÉ
// ============================================================

import type { OvhCredentials } from "../../../../../types/auth.types";

const STORAGE_KEY = "ovh_credentials";

export const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
  helpCenter: "https://help.ovhcloud.com/csm",
  createTicket: "https://help.ovhcloud.com/csm?id=csm_get_help",
};

export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
