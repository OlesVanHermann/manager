// ============================================================
// POLICIES SERVICE - Service API isolé pour l'onglet Policies
// ============================================================

import type { OvhCredentials, IamPolicy } from "../../iam.types";

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

/** Récupère la liste des IDs de policies. */
export async function getPolicyIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/iam/policy");
  return result || [];
}

/** Récupère une policy par ID. */
export async function getPolicy(credentials: OvhCredentials, policyId: string): Promise<IamPolicy | null> {
  return ovhRequestOptional<IamPolicy>(credentials, "GET", `/iam/policy/${encodeURIComponent(policyId)}`);
}

/** Récupère toutes les policies. */
export async function getPolicies(credentials: OvhCredentials): Promise<IamPolicy[]> {
  const ids = await getPolicyIds(credentials);
  const policies = await Promise.all(ids.map((id) => getPolicy(credentials, id)));
  return policies.filter((p): p is IamPolicy => p !== null);
}

/** Met à jour les identités d'une policy. */
export async function updatePolicyIdentities(
  credentials: OvhCredentials,
  policyId: string,
  identities: string[]
): Promise<IamPolicy> {
  return ovhRequest<IamPolicy>(credentials, "PUT", `/iam/policy/${encodeURIComponent(policyId)}`, { identities });
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
