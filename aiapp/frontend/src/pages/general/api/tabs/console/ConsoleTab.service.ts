// ============================================================
// CONSOLE TAB SERVICE - API Console
// NAV1: general / NAV2: api / NAV3: console
// ISOLÉ - Aucune dépendance vers d'autres tabs
// ============================================================

import type { OvhCredentials } from "../../api.types";

// ============ CONSTANTS ============

export const STORAGE_KEY = "ovh_credentials";
export const API_BASE = "/api/ovh";

// ============ HELPERS ============

export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
