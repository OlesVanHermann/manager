// ============================================================
// GROUPS SERVICE - Service API isolé pour l'onglet Groups
// ============================================================

import type { OvhCredentials, IamResourceGroup } from "../../iam.types";

const API_BASE = "/api/ovh";

// ============================================================
// API REQUEST (défactorisé)
// ============================================================

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string,
  body?: unknown
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

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

async function ovhRequestOptional<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T | null> {
  try {
    return await ovhRequest<T>(credentials, method, path);
  } catch {
    return null;
  }
}

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère la liste des IDs de resource groups. */
export async function getResourceGroupIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/iam/resourceGroup");
  return result || [];
}

/** Récupère un resource group par ID. */
export async function getResourceGroup(credentials: OvhCredentials, groupId: string): Promise<IamResourceGroup | null> {
  return ovhRequestOptional<IamResourceGroup>(credentials, "GET", `/iam/resourceGroup/${encodeURIComponent(groupId)}`);
}

/** Récupère tous les resource groups. */
export async function getResourceGroups(credentials: OvhCredentials): Promise<IamResourceGroup[]> {
  const ids = await getResourceGroupIds(credentials);
  const groups = await Promise.all(ids.map((id) => getResourceGroup(credentials, id)));
  return groups.filter((g): g is IamResourceGroup => g !== null);
}

// ============================================================
// HELPERS (défactorisés)
// ============================================================

const STORAGE_KEY = "ovh_credentials";

/** Récupère les credentials OVH depuis le sessionStorage. */
export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/** Formate une date ISO en format localisé. */
export function formatDate(dateStr: string, locale: string = "fr-FR", includeTime = false): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return date.toLocaleDateString(locale, options);
}
