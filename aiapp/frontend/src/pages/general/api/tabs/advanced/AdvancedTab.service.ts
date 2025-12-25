// ============================================================
// ADVANCED TAB SERVICE - API Debug & Settings
// NAV1: general / NAV2: api / NAV3: advanced
// ISOLÉ - Aucune dépendance vers d'autres tabs
// ============================================================

import type { OvhCredentials, OvhUser } from "../../api.types";

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

export function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
