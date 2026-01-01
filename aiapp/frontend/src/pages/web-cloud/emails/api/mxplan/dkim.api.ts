// ============================================================
// API MX PLAN - DKIM (DomainKeys Identified Mail)
// Endpoints: /email/domain/{domain}/dkim/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanDkim {
  activeSelector?: string;
  selectors: Array<{
    cname: string;
    cnameIsValid: boolean;
    customerRecord?: string;
    lastUpdate?: string;
    recordType: string;
    selectorName: string;
    status: "disabled" | "enabling" | "enabled" | "disabling" | "waitingRecord" | "ready" | "toGenerate";
    targetRecord?: string;
    taskPendingId?: number;
  }>;
  status: "disabled" | "enabling" | "enabled" | "disabling" | "waitingRecord" | "ready" | "toGenerate";
}

// ---------- DKIM API ----------

/**
 * État DKIM du domaine (APIv6)
 * Équivalent old_manager: getDkim
 */
export async function get(domain: string): Promise<MxPlanDkim> {
  return apiFetch<MxPlanDkim>(`${BASE}/${domain}/dkim`);
}

/**
 * Activer DKIM (APIv6)
 * Équivalent old_manager: enableDkim
 */
export async function enable(domain: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/dkim/enable`, {
    method: "PUT",
  });
}

/**
 * Désactiver DKIM (APIv6)
 * Équivalent old_manager: disableDkim
 */
export async function disable(domain: string): Promise<void> {
  await apiFetch(`${BASE}/${domain}/dkim/disable`, {
    method: "PUT",
  });
}

/**
 * Vérifier si DKIM est actif
 */
export async function isEnabled(domain: string): Promise<boolean> {
  const dkim = await get(domain);
  return dkim.status === "enabled";
}
