// ============================================================
// API MX PLAN - Service (informations générales du domaine email)
// Endpoints: /email/domain/{domain}/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MxPlanSummary {
  account: number;
  mailingList: number;
  redirection: number;
  responder: number;
}

export interface MxPlanQuota {
  account: number;
  mailingList: number;
  redirection: number;
  responder: number;
}

export interface MxPlanServiceInfos {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo?: string;
  expiration: string;
  possibleRenewPeriod?: number[];
  renew?: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    period?: number;
  };
  renewalType: string;
  serviceId: number;
  status: string;
}

export interface DnsRecord {
  fieldType: string;
  target: string;
  ttl?: number;
  priority?: number;
}

export interface DnsMXFilter {
  customTarget?: string;
  mxFilter: "CUSTOM" | "FULL_FILTERING" | "NO_FILTERING" | "REDIRECT" | "SIMPLE_FILTERING";
  subdomains?: string;
}

// ---------- SERVICE INFO ----------

/**
 * Informations du service (APIv6)
 * Équivalent old_manager: getServiceInfos
 */
export async function getServiceInfos(domain: string): Promise<MxPlanServiceInfos> {
  return apiFetch<MxPlanServiceInfos>(`${BASE}/${domain}/serviceInfos`);
}

/**
 * Résumé du domaine (APIv6)
 * Équivalent old_manager: getSummary
 */
export async function getSummary(domain: string): Promise<MxPlanSummary> {
  return apiFetch<MxPlanSummary>(`${BASE}/${domain}/summary`);
}

/**
 * Quotas du domaine (APIv6)
 * Équivalent old_manager: getQuotas
 */
export async function getQuota(domain: string): Promise<MxPlanQuota> {
  return apiFetch<MxPlanQuota>(`${BASE}/${domain}/quota`);
}

// ---------- DNS ----------

/**
 * Filtre DNS MX actuel (APIv6)
 * Équivalent old_manager: getDnsFilter
 */
export async function getDnsMXFilter(domain: string): Promise<DnsMXFilter> {
  return apiFetch<DnsMXFilter>(`${BASE}/${domain}/dnsMXFilter`);
}

/**
 * Changer le filtre DNS MX (APIv6)
 * Équivalent old_manager: setDnsFilter
 */
export async function changeDnsMXFilter(
  domain: string,
  data: {
    customTarget?: string;
    mxFilter: "CUSTOM" | "FULL_FILTERING" | "NO_FILTERING" | "REDIRECT" | "SIMPLE_FILTERING";
    subdomains?: string;
  }
): Promise<void> {
  await apiFetch(`${BASE}/${domain}/changeDnsMXFilter`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Enregistrements MX actuels (APIv6)
 * Équivalent old_manager: getMxRecords
 */
export async function getDnsMXRecords(domain: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${domain}/dnsMXRecords`);
}

/**
 * Enregistrements DNS recommandés (APIv6)
 * Équivalent old_manager: getRecommendedDNSRecords
 */
export async function getRecommendedDNSRecords(domain: string): Promise<DnsRecord[]> {
  return apiFetch<DnsRecord[]>(`${BASE}/${domain}/recommendedDNSRecords`);
}
