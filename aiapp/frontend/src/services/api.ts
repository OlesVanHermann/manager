// ============================================================
// API HELPER - Centralisation des appels OVH
// Avec logging automatique vers /api/logs
// ============================================================

import { log } from './logger';

const API_BASE = "/api/ovh";
const API2_BASE = "https://www.ovh.com/engine/2api-m";
const APIV6_DIRECT = "https://www.ovh.com/engine/apiv6";
const STORAGE_KEY = "ovh_credentials";
const AUTH_URL = "https://www.ovh.com/auth/?onsuccess=" + encodeURIComponent(window.location.origin + "/");

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

export function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
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
  const creds = options?.credentials ?? getCredentials();
  const startTime = performance.now();
  
  if (!creds) {
    if (options?.skipAuthRedirect) throw new Error("Non authentifié");
    redirectToAuth();
    throw new Error("Redirection auth");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": creds.appKey,
    "X-Ovh-App-Secret": creds.appSecret,
  };
  if (creds.consumerKey) headers["X-Ovh-Consumer-Key"] = creds.consumerKey;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    log.api('api', method, path, 0, Math.round(performance.now() - startTime), String(err));
    throw err;
  }

  const ms = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const errorMsg = error.message || `Erreur HTTP ${response.status}`;
    log.api('api', method, path, response.status, ms, errorMsg);
    
    if (response.status === 401) {
      if (options?.skipAuthRedirect) throw new Error("Non authentifié");
      redirectToAuth();
      throw new Error("Redirection auth");
    }
    
    throw new Error(errorMsg);
  }

  log.api('api', method, path, response.status, ms);
  return response.json();
}

export async function ovhGet<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("GET", path, options);
}

export async function ovhPost<T>(path: string, body: unknown, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("POST", path, { body, ...options });
}

export async function ovhPostNoBody<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("POST", path, options);
}

export async function ovhPut<T>(path: string, body: unknown, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("PUT", path, { body, ...options });
}

export async function ovhDelete<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhFetch<T>("DELETE", path, options);
}

// ============ 2API DIRECTE ============

export async function ovh2apiFetch<T>(
  method: string,
  path: string,
  options?: {
    body?: unknown;
    params?: Record<string, string | number>;
    skipAuthRedirect?: boolean;
  }
): Promise<T> {
  const startTime = performance.now();
  let url = `${API2_BASE}${path}`;
  if (options?.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      searchParams.append(key, String(value));
    }
    url += `?${searchParams.toString()}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    log.api('2api', method, path, 0, Math.round(performance.now() - startTime), String(err));
    throw err;
  }

  const ms = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const errorMsg = error.message || `Erreur HTTP ${response.status}`;
    log.api('2api', method, path, response.status, ms, errorMsg);
    
    if (response.status === 401) {
      if (options?.skipAuthRedirect) throw new Error("Non authentifié");
      redirectToAuth();
      throw new Error("Redirection auth");
    }
    
    throw new Error(errorMsg);
  }

  log.api('2api', method, path, response.status, ms);
  return response.json();
}

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

export async function ovh2apiPut<T>(
  path: string,
  body: unknown,
  options?: { skipAuthRedirect?: boolean }
): Promise<T> {
  return ovh2apiFetch<T>("PUT", path, { body, ...options });
}

// ============ APIv6 DIRECTE ============

export async function ovhDirectFetch<T>(
  method: string,
  path: string,
  options?: { body?: unknown; skipAuthRedirect?: boolean; }
): Promise<T> {
  const startTime = performance.now();
  
  let response: Response;
  try {
    response = await fetch(`${APIV6_DIRECT}${path}`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    log.api('apiv6-direct', method, path, 0, Math.round(performance.now() - startTime), String(err));
    throw err;
  }

  const ms = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const errorMsg = error.message || `Erreur HTTP ${response.status}`;
    log.api('apiv6-direct', method, path, response.status, ms, errorMsg);
    
    if (response.status === 401) {
      if (options?.skipAuthRedirect) throw new Error("Non authentifié");
      redirectToAuth();
      throw new Error("Redirection auth");
    }
    
    throw new Error(errorMsg);
  }

  log.api('apiv6-direct', method, path, response.status, ms);
  return response.json();
}

export async function ovhDirectGet<T>(path: string, options?: { skipAuthRedirect?: boolean }): Promise<T> {
  return ovhDirectFetch<T>("GET", path, options);
}

export const ovhApi = { get: ovhGet, post: ovhPost, put: ovhPut, delete: ovhDelete };
export const apiClient = { get: ovhGet, post: ovhPost, put: ovhPut, delete: ovhDelete };
