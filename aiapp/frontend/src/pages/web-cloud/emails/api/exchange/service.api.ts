// ============================================================
// API EXCHANGE - Service (informations générales)
// Endpoints 2API: /sws/exchange/{org}/{exchange}/*
// Endpoints APIv6: /email/exchange/{org}/service/{service}/*
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/exchange";

const BASE_2API = "/sws/exchange";

// ---------- TYPES ----------

export interface ExchangeService {
  domain: string;
  displayName: string;
  hostname: string;
  offer: "hosted" | "provider" | "dedicated" | "dedicatedCluster";
  state: "ok" | "suspended" | "inMaintenance";
  sslRenew: boolean;
  renewType: string;
  maxSendSize: number;
  maxReceiveSize: number;
  spamAndVirusConfiguration: {
    checkDKIM: boolean;
    checkSPF: boolean;
    deleteSpam: boolean;
    putInJunk: boolean;
    tagSpam: boolean;
  };
  lastUpdateDate?: string;
  taskPendingId?: number;
  webUrl?: string;
  lockoutDuration?: number;
  lockoutObservationWindow?: number;
  lockoutThreshold?: number;
  minPasswordAge?: number;
  minPasswordLength?: number;
  maxPasswordAge?: number;
  complexityEnabled?: boolean;
  nicType?: string[];
  serverDiagnostic?: {
    commercialVersion: string;
    ip: string;
    isAValid: boolean;
    isAaaaValid: boolean;
    isMxValid: boolean;
    isSrvValid: boolean;
  };
}

export interface ExchangeServiceStats {
  accountsCount: number;
  accountsQuota: number;
  groupsCount: number;
  domainsCount: number;
  resourcesCount: number;
  sharedAccountsCount: number;
}

// ---------- HELPERS ----------

function get2apiPath(serviceId: string): string {
  const [org, exchange] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE_2API}/${org}/${exchange}`;
}

// ---------- 2API CALLS ----------

/**
 * Informations complètes du service Exchange (2API AAPI)
 * Équivalent old_manager: getExchangeDetails (via Aapi)
 */
export async function getServiceDetails(serviceId: string): Promise<ExchangeService & ExchangeServiceStats> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet<ExchangeService & ExchangeServiceStats>(path);
}

/**
 * Mise à jour des conditions de résiliation (2API)
 * Équivalent old_manager: updateDeleteAtExpiration
 */
export async function updateDeleteAtExpiration(
  serviceId: string,
  renewType: {
    automatic?: boolean;
    deleteAtExpiration?: boolean;
    forced?: boolean;
    period?: string;
  }
): Promise<void> {
  const path = get2apiPath(serviceId);
  await ovh2apiPut(`${path}/deleteAtExpiration`, renewType);
}

/**
 * Liste des tâches (2API) - déjà en tasks.api.ts mais ajouté ici pour cohérence
 */
export async function getTasks(
  serviceId: string,
  options?: { count?: number; offset?: number }
): Promise<{ list: { results: Array<{ id: number; todoDate: string; finishDate?: string; function: string; status: string }>; count: number } }> {
  const path = get2apiPath(serviceId);
  return ovh2apiGet(`${path}/tasks`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}

// ============================================================
// APIv6 ENDPOINTS - Appels directs à l'API OVH
// ============================================================

// ---------- APIv6 TYPES ----------

export interface ExchangeServer {
  currentDiskUsage?: number;
  diskSize?: number;
  individual2010MigrationDone: boolean;
  ip: string;
  ipV6?: string;
  isAValid: boolean;
  isAaaaValid: boolean;
  isMxValid: boolean;
  isSrvValid: boolean;
  owaMfa: boolean;
  state: "configurationPending" | "notConfigured" | "ok" | "inMaintenance";
  taskPendingId?: number;
  commercialVersion: string;
  version?: number;
}

export interface DcvEmail {
  name: string;
  displayName: string;
  formattedName: string;
}

// ---------- APIv6 HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- APIv6 CALLS ----------

/**
 * Informations serveur Exchange (APIv6)
 * Équivalent old_manager: getExchangeServer
 */
export async function getServer(serviceId: string): Promise<ExchangeServer> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeServer>(`${basePath}/server`);
}

/**
 * Mise à jour serveur Exchange (APIv6)
 * Équivalent old_manager: updateExchangeServer
 */
export async function updateServer(
  serviceId: string,
  data: Partial<Pick<ExchangeServer, "owaMfa">>
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/server`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Mise à jour configuration service (APIv6)
 * Équivalent old_manager: setConfiguration
 */
export async function updateConfiguration(
  serviceId: string,
  data: Partial<ExchangeService>
): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Appliquer flags sur tous les comptes (APIv6)
 * Équivalent old_manager: updateFlagsOnAllAccounts
 */
export async function updateFlagsOnAllAccounts(serviceId: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/updateFlagsOnAllAccounts`, {
    method: "POST",
  });
}

/**
 * Liste emails DCV pour renouvellement SSL (APIv6)
 * Équivalent old_manager: retrievingDVCEmails
 */
export async function getDcvEmails(serviceId: string): Promise<DcvEmail[]> {
  const basePath = getServicePath(serviceId);
  const emails = await apiFetch<string[]>(`${basePath}/dcvEmails`);

  return emails.map(email => ({
    name: email,
    displayName: email,
    formattedName: email,
  }));
}

/**
 * Renouvellement certificat SSL (APIv6)
 * Équivalent old_manager: renewSsl
 */
export async function renewSSL(serviceId: string, dcvEmail: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/renewSSL`, {
    method: "POST",
    body: JSON.stringify({ dcv: dcvEmail }),
  });
}

/**
 * Récupérer les modèles/schémas de l'API (APIv6)
 * Équivalent old_manager: getModels
 */
export async function getApiModels(): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>("/email/exchange.json");
}
