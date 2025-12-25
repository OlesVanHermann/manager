// ============================================================
// IDENTITIES SERVICE - Service API isolé pour l'onglet Identities
// ============================================================

import type { OvhCredentials, IamUser } from "../../iam.types";

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

/** Récupère la liste des logins utilisateurs. */
export async function getUserLogins(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/me/identity/user");
  return result || [];
}

/** Récupère un utilisateur par login. */
export async function getUser(credentials: OvhCredentials, login: string): Promise<IamUser | null> {
  return ovhRequestOptional<IamUser>(credentials, "GET", `/me/identity/user/${encodeURIComponent(login)}`);
}

/** Récupère tous les utilisateurs. */
export async function getUsers(credentials: OvhCredentials): Promise<IamUser[]> {
  const logins = await getUserLogins(credentials);
  const users = await Promise.all(logins.map((login) => getUser(credentials, login)));
  return users.filter((u): u is IamUser => u !== null);
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
