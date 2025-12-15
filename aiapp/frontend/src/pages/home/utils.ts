// ============================================================
// HOME UTILS - Helpers partagés pour le dashboard
// ============================================================

// ============ TYPES ============

export interface UserInfo {
  firstname?: string;
  name?: string;
  nichandle?: string;
  isTrusted?: boolean;
}

// ============ CONSTANTES ============

const STORAGE_KEY = "ovh_user";

export const SERVICE_TYPE_MAP: Record<string, string> = {
  "Noms de domaine": "domain",
  "Hebergements Web": "hosting",
  "Emails": "email",
  "VPS": "vps",
  "Serveurs dedies": "dedicated",
  "Public Cloud": "cloud",
  "IP": "ip",
  "Logs Data Platform": "dbaas",
};

// ============ HELPERS ============

/** Récupère les infos utilisateur depuis le sessionStorage. */
export function getUser(): UserInfo | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
