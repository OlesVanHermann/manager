// ============================================================
// API EMAIL PRO - Service (informations générales)
// Endpoints 2API: /sws/emailpro/{service}/*
// ============================================================

import { ovh2apiGet, ovh2apiPut } from "../../../../../services/api";

const BASE_2API = "/sws/emailpro";

// ---------- TYPES ----------

export interface EmailProService {
  domain: string;
  displayName: string;
  hostname: string;
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
  serverDiagnostic?: {
    commercialVersion: string;
    ip: string;
    isAValid: boolean;
    isAaaaValid: boolean;
    isMxValid: boolean;
    isSrvValid: boolean;
  };
}

export interface EmailProServiceStats {
  accountsCount: number;
  accountsQuota: number;
  domainsCount: number;
}

// ---------- 2API CALLS ----------

/**
 * Informations complètes du service Email Pro (2API AAPI)
 * Équivalent old_manager: getEmailProDetails
 */
export async function getServiceDetails(serviceId: string): Promise<EmailProService & EmailProServiceStats> {
  return ovh2apiGet<EmailProService & EmailProServiceStats>(`${BASE_2API}/${serviceId}`);
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
  await ovh2apiPut(`${BASE_2API}/${serviceId}/deleteAtExpiration`, renewType);
}

/**
 * Liste des tâches (2API) - alias vers tasks.api.ts
 */
export async function getTasks(
  serviceId: string,
  options?: { count?: number; offset?: number }
): Promise<{ list: { results: Array<{ id: number; todoDate: string; finishDate?: string; function: string; status: string }>; count: number } }> {
  return ovh2apiGet(`${BASE_2API}/${serviceId}/tasks`, {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
  });
}
