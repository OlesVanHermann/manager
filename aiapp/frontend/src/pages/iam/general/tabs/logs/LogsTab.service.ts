// ============================================================
// LOGS SERVICE - Service API isolé pour l'onglet Logs
// ============================================================

import type { OvhCredentials } from "../../../iam.types";

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
// TYPES LOCAUX
// ============================================================

export interface IamLogEntry {
  date: string;
  identity: string;
  action: string;
  resource: string;
  result: "allowed" | "denied";
  details?: string;
}

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère les logs IAM (simulé - à adapter selon l'API réelle). */
export async function getLogs(
  credentials: OvhCredentials,
  _filter?: "all" | "allowed" | "denied"
): Promise<IamLogEntry[]> {
  // Note: L'API IAM logs n'existe peut-être pas encore
  // Retourne un tableau vide en attendant l'implémentation réelle
  const result = await ovhRequestOptional<IamLogEntry[]>(credentials, "GET", "/iam/logs");
  return result || [];
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
export function formatDate(dateStr: string, locale: string = "fr-FR", includeTime = true): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return date.toLocaleDateString(locale, options);
}
