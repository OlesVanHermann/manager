// ============================================================
// API HELPER - Centralisation des appels OVH
// 
// 2 modes d'accès :
// - APIv6 via proxy nginx : /api/ovh/* → https://eu.api.ovh.com/1.0/*
// - 2API directe avec cookies : https://www.ovh.com/engine/2api-m/*
// ============================================================

// ============ CONFIGURATION ============

const API_BASE = "/api/ovh";
const API2_BASE = "https://www.ovh.com/engine/2api-m";
const APIV6_DIRECT = "https://www.ovh.com/engine/apiv6";
const STORAGE_KEY = "ovh_credentials";

// URL de redirection auth OVH (EU)
const AUTH_URL = "https://www.ovh.com/auth/?onsuccess=" + encodeURIComponent(window.location.origin + "/");

// ============ TYPES ============

export interface OvhCredentials {
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// ============ CREDENTIALS HELPERS ============

export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeCredentials(credentials: OvhCredentials): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function clearCredentials(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getCredentials() !== null;
}

// ============ REDIRECT AUTH ============

export function redirectToAuth(): void {
  clearCredentials();
  window.location.href = AUTH_URL;
}

// ============ APIv6 VIA PROXY NGINX ============

export async function ovhFetch<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    credentials?: OvhCredentials;
    skipAuthRedirect?: boolean;
  }
): Promise<T> {
  // Récupérer les credentials (fournis ou depuis sessionStorage)
  const creds = options?.credentials ?? getCredentials();
  
  if (!creds) {
    if (options?.skipAuthRedirect) {
      throw new Error("Non authentifié");
    }
    redirectToAuth();
    throw new Error("Redirection auth");
  }

  // Construire les headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": creds.appKey,
    "X-Ovh-App-Secret": creds.appSecret,
  };

  if (creds.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = creds.consumerKey;
  }

  // Effectuer la requête
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  // Gestion 401 : redirection vers auth
  if (response.status === 401) {
    if (options?.skipAuthRedirect) {
      throw new Error("Non authentifié");
    }
    redirectToAuth();
    throw new Error("Redirection auth");
  }

  // Gestion autres erreurs
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const apiError: ApiError = {
      status: response.status,
      message: error.message || `Erreur HTTP ${response.status}`,
      code: error.code,
    };
    throw apiError;
  }

  return response.json();
}

// ============ APIv6 RACCOURCIS ============

export async function ovhGet<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("GET", path, options);
}

export async function ovhPost<T>(path: string, body: unknown, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("POST", path, { body, ...options });
}

export async function ovhPut<T>(path: string, body: unknown, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("PUT", path, { body, ...options });
}

export async function ovhDelete<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("DELETE", path, options);
}

// ============ 2API DIRECTE (COOKIES SESSION) ============

export async function ovh2apiFetch<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    params?: Record<string, string | number>;
    skipAuthRedirect?: boolean;
  }
): Promise<T> {
  // Construire l'URL avec query params
  let url = `${API2_BASE}${path}`;
  if (options?.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      searchParams.append(key, String(value));
    }
    url += `?${searchParams.toString()}`;
  }

  // Effectuer la requête avec cookies
  const response = await fetch(url, {
    method,
    credentials: "include", // OBLIGATOIRE pour cookies session
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  // Gestion 401 : redirection vers auth
  if (response.status === 401) {
    if (options?.skipAuthRedirect) {
      throw new Error("Non authentifié");
    }
    redirectToAuth();
    throw new Error("Redirection auth");
  }

  // Gestion autres erreurs
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const apiError: ApiError = {
      status: response.status,
      message: error.message || `Erreur HTTP ${response.status}`,
      code: error.code,
    };
    throw apiError;
  }

  return response.json();
}

// ============ 2API RACCOURCIS ============

export async function ovh2apiGet<T>(
  path: string,
  params?: Record<string, string | number>,
  options?: { skipAuthRedirect?: boolean }
): Promise<T> {
  return ovh2apiFetch<T>("GET", path, { params, ...options });
}

export async function ovh2apiPost<T>(
  path: string,
  body: unknown,
  options?: { skipAuthRedirect?: boolean }
): Promise<T> {
  return ovh2apiFetch<T>("POST", path, { body, ...options });
}

// ============ APIv6 DIRECTE (COOKIES SESSION) ============

export async function ovhDirectFetch<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    skipAuthRedirect?: boolean;
  }
): Promise<T> {
  const response = await fetch(`${APIV6_DIRECT}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    if (options?.skipAuthRedirect) {
      throw new Error("Non authentifié");
    }
    redirectToAuth();
    throw new Error("Redirection auth");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const apiError: ApiError = {
      status: response.status,
      message: error.message || `Erreur HTTP ${response.status}`,
      code: error.code,
    };
    throw apiError;
  }

  return response.json();
}

export async function ovhDirectGet<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhDirectFetch<T>("GET", path, options);
}
