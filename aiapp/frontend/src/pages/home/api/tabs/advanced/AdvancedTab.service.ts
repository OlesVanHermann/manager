// ============================================================
// ADVANCED TAB SERVICE - Service ISOLÉ
// ============================================================

import type { OvhCredentials, OvhUser } from "../../../../../types/auth.types";

export const STORAGE_KEY = "ovh_credentials";
export const API_BASE = "/api/ovh";

export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}
