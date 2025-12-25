// ============================================================
// LEVEL TAB SERVICE - Support Levels
// NAV1: general / NAV2: support / NAV3: level
// ISOLÉ - Aucune dépendance vers d'autres tabs
// ============================================================

import type { OvhCredentials, SupportLevel } from "../../support.types";

const API_BASE = "/api/ovh";
const STORAGE_KEY = "ovh_credentials";

// ============ RE-EXPORT TYPES ============

export type { SupportLevel };

// ============ CONSTANTS ============

export const SUPPORT_URLS = {
  comparison: "https://www.ovhcloud.com/fr/support-levels/",
  contact: "https://www.ovhcloud.com/fr/contact/",
  helpCenter: "https://help.ovhcloud.com/csm",
  createTicket: "https://help.ovhcloud.com/csm?id=csm_get_help",
};

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

// ============ API REQUEST ============

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, { method, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ SUPPORT LEVEL API ============

export async function getSupportLevel(credentials: OvhCredentials): Promise<SupportLevel> {
  return ovhRequest<SupportLevel>(credentials, "GET", "/me/supportLevel");
}
