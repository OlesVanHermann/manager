// ============================================================
// API UTILS - Helpers partagés pour la page API
// ============================================================

import type { OvhCredentials, OvhUser } from "../../../types/auth.types";

// ============ CONSTANTES ============

export const STORAGE_KEY = "ovh_credentials";
export const API_BASE = "/api/ovh";

// ============ HELPERS ============

/** Récupère les credentials OVH depuis le sessionStorage. */
export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

/** Récupère les infos utilisateur depuis le sessionStorage. */
export function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}
