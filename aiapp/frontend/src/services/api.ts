// ============================================================
// API HELPER - Centralisation des appels OVH
// Avec logging automatique vers /api/logs
// ============================================================

import { log } from './logger';

const API_BASE = "/api/ovh";
const API2_BASE = "/api/2api";  // Proxy nginx - évite CORS
const APIV6_DIRECT = "/api/apiv6";  // Proxy nginx - évite CORS
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
    apiVersion?: string;
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

// Options type partagé pour les appels API (apiVersion est ignoré mais accepté pour compatibilité)
type ApiOptions = {
  skipAuthRedirect?: boolean;
  apiVersion?: string;
  params?: Record<string, string | number | boolean>;
};

export async function ovhGet<T>(path: string, options?: ApiOptions): Promise<T> {
  let url = path;
  if (options?.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }
  return ovhFetch<T>("GET", url, options);
}

export async function ovhPost<T>(path: string, body: unknown, options?: ApiOptions): Promise<T> {
  return ovhFetch<T>("POST", path, { body, ...options });
}

export async function ovhPostNoBody<T>(path: string, options?: ApiOptions): Promise<T> {
  return ovhFetch<T>("POST", path, options);
}

export async function ovhPut<T>(path: string, body: unknown, options?: ApiOptions): Promise<T> {
  return ovhFetch<T>("PUT", path, { body, ...options });
}

export async function ovhDelete<T>(path: string, options?: ApiOptions): Promise<T> {
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

// ============ ALIAS POUR COMPATIBILITÉ ============
// Les fichiers API utilisent apiFetch - alias vers ovhFetch
export const apiFetch = ovhFetch;
export const api2Fetch = ovh2apiFetch;

// ============ 2API HELPERS COMPLETS ============
export const ovh2api = {
  get: ovh2apiGet,
  post: ovh2apiPost,
  put: ovh2apiPut,
  fetch: ovh2apiFetch,
};

// Helper pour 2API DELETE (avec body optionnel - identique old_manager)
export async function ovh2apiDelete<T>(
  path: string,
  body?: unknown,
  options?: { skipAuthRedirect?: boolean }
): Promise<T> {
  return ovh2apiFetch<T>("DELETE", path, { body, ...options });
}

// ============ ICEBERG PAGINATION (from old_manager) ============

export interface IcebergResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface IcebergOptions {
  page?: number;
  pageSize?: number;
  sort?: string;
  sortOrder?: "ASC" | "DESC";
  filters?: Array<{ field: string; comparator: string; value: string }>;
}

/**
 * Iceberg pagination helper - matches old_manager behavior
 * Uses X-Pagination headers for server-side pagination
 */
export async function ovhIceberg<T>(
  path: string,
  options: IcebergOptions = {}
): Promise<IcebergResult<T>> {
  const { page = 1, pageSize = 25, sort, sortOrder = "ASC", filters } = options;
  const creds = getCredentials();
  const startTime = performance.now();

  if (!creds) {
    redirectToAuth();
    throw new Error("Redirection auth");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": creds.appKey,
    "X-Ovh-App-Secret": creds.appSecret,
    "X-Pagination-Mode": "CachedObjectList-Pages",
    "X-Pagination-Size": String(pageSize),
    "X-Pagination-Number": String(page),
  };

  if (creds.consumerKey) headers["X-Ovh-Consumer-Key"] = creds.consumerKey;
  if (sort) {
    headers["X-Pagination-Sort"] = sort;
    headers["X-Pagination-Sort-Order"] = sortOrder;
  }
  if (filters && filters.length > 0) {
    headers["X-Pagination-Filter"] = filters
      .map(f => `${f.field}:${f.comparator}=${f.value}`)
      .join(",");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers,
    });
  } catch (err) {
    log.api("iceberg", "GET", path, 0, Math.round(performance.now() - startTime), String(err));
    throw err;
  }

  const ms = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    const errorMsg = error.message || `Erreur HTTP ${response.status}`;
    log.api("iceberg", "GET", path, response.status, ms, errorMsg);

    if (response.status === 401) {
      redirectToAuth();
      throw new Error("Redirection auth");
    }

    throw new Error(errorMsg);
  }

  log.api("iceberg", "GET", path, response.status, ms);

  const data = await response.json();
  const totalCount = parseInt(response.headers.get("X-Pagination-Elements") || "0", 10);
  const actualPage = parseInt(response.headers.get("X-Pagination-Number") || String(page), 10);

  return {
    data: data as T[],
    totalCount,
    page: actualPage,
    pageSize,
  };
}

/**
 * Helper to fetch all pages using Iceberg
 */
export async function ovhIcebergAll<T>(
  path: string,
  options: Omit<IcebergOptions, "page"> = {}
): Promise<T[]> {
  const pageSize = options.pageSize || 100;
  let page = 1;
  let allData: T[] = [];
  let totalCount = 0;

  do {
    const result = await ovhIceberg<T>(path, { ...options, page, pageSize });
    allData = allData.concat(result.data);
    totalCount = result.totalCount;
    page++;
  } while (allData.length < totalCount);

  return allData;
}
