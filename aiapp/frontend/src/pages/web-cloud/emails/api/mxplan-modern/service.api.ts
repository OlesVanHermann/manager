// ============================================================
// API MXPLAN MODERN - Service (informations générales)
// Endpoints APIv6: /email/mxplan/{service}/*
// Endpoints 2API: /sws/emailpro/{service}/* avec isMXPlan=true
// ============================================================

import { apiFetch, ovh2apiGet, ovh2apiPut } from "../../../../../services/api";

const BASE = "/email/mxplan";
const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface MxPlanModernService {
  domain: string;
  displayName: string;
  hostname: string;
  state: "ok" | "suspended" | "inMaintenance";
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
}

export interface MxPlanModernServiceStats {
  accountsCount: number;
  accountsQuota: number;
  domainsCount: number;
}

// ---------- APIv6 CALLS ----------

/**
 * Informations du service MXPlan (APIv6)
 */
export async function get(serviceId: string): Promise<MxPlanModernService> {
  return apiFetch<MxPlanModernService>(`${BASE}/${serviceId}`);
}

/**
 * Mise à jour du service (APIv6)
 */
export async function update(
  serviceId: string,
  data: Partial<MxPlanModernService>
): Promise<void> {
  await apiFetch(`${BASE}/${serviceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Récupérer le domaine associé au service MXPlan
 * Équivalent old_manager: retrievingAssociatedDomainName
 */
export async function getAssociatedDomain(serviceId: string): Promise<string> {
  const domains = await apiFetch<string[]>(`${BASE}/${serviceId}/domain`);
  return domains[0] || "";
}

// ---------- 2API CALLS ----------

/**
 * Informations complètes du service MXPlan (2API)
 * Équivalent old_manager: getSelected avec isMXPlan=true
 */
export async function getServiceDetails(
  serviceId: string
): Promise<MxPlanModernService & MxPlanModernServiceStats> {
  return ovh2apiGet<MxPlanModernService & MxPlanModernServiceStats>(
    `${BASE_2API}/${serviceId}`,
    { isMXPlan: 1 }
  );
}

/**
 * Mise à jour des conditions de résiliation (2API)
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
  await ovh2apiPut(`${BASE_2API}/${serviceId}/deleteAtExpiration`, {
    ...renewType,
    isMXPlan: true,
  });
}

/**
 * Récupérer les modèles/schémas de l'API (APIv6)
 */
export async function getApiModels(): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>("/email/mxplan.json");
}
