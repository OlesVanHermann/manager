// ============================================================
// API SERVICES - Liste des services email (Packs)
// Endpoints: /email/exchange, /email/pro, /email/mxplan
// ============================================================

import { ovhGet, ovhIceberg } from "../../../../services/api";
import type { EmailOffer } from "../types";

// ---------- TYPES ----------

export type EmailServiceType = "exchange" | "emailpro" | "mxplan" | "zimbra";
export type ServiceState = "ok" | "suspended" | "expired" | "inCreation";
export type ExchangeOffer = "HOSTED" | "PROVIDER" | "DEDICATED" | "DEDICATED_CLUSTER";

export interface EmailServiceSummary {
  id: string;
  type: EmailServiceType;
  name: string;
  displayName: string;
  offer: EmailOffer;
  offerDetail?: string;           // "HOSTED", "PROVIDER", etc.
  domain: string;
  organization?: string;          // Exchange only
  accountsCount: number;
  maxAccounts?: number;
  state: ServiceState;
  renewalDate?: string;
  expirationDate?: string;
  creationDate?: string;
}

export interface ExchangeServiceDetails {
  domain: string;
  displayName: string;
  offer: ExchangeOffer;
  hostname: string;
  maxReceiveSize: number;
  maxSendSize: number;
  spamAndVirusConfiguration: {
    checkDKIM: boolean;
    checkSPF: boolean;
    deleteSpam: boolean;
    putInJunk: boolean;
    tagSpam: boolean;
  };
  sslExpirationDate?: string;
  state: string;
  taskPendingId?: number;
  webUrl?: string;
}

export interface EmailProServiceDetails {
  domain: string;
  displayName: string;
  hostname: string;
  maxReceiveSize: number;
  maxSendSize: number;
  lastUpdateDate?: string;
  state: string;
  taskPendingId?: number;
  webUrl?: string;
}

export interface MXPlanServiceDetails {
  domain: string;
  allowedAccountSize: number[];
  creationDate: string;
  filerz: number;
  lastUpdate: string;
  lockoutDuration: number;
  lockoutObservationWindow: number;
  lockoutThreshold: number;
  mailingListLimits: number;
  maxPasswordAge: number;
  minPasswordAge: number;
  minPasswordLength: number;
  offer: string;
  state: string;
}

// ---------- EXCHANGE ----------

/**
 * Liste toutes les organisations Exchange
 * GET /email/exchange
 */
export async function getExchangeOrganizations(): Promise<string[]> {
  return ovhGet<string[]>("/email/exchange");
}

/**
 * Liste les services Exchange pour une organisation
 * GET /email/exchange/{organizationName}/service
 */
export async function getExchangeServicesForOrg(
  organizationName: string
): Promise<ExchangeServiceDetails[]> {
  const result = await ovhIceberg<ExchangeServiceDetails>(
    `/email/exchange/${organizationName}/service`
  );
  return result.data;
}

/**
 * Détails d'un service Exchange
 * GET /email/exchange/{organizationName}/service/{exchangeService}
 */
export async function getExchangeServiceDetails(
  organizationName: string,
  exchangeService: string
): Promise<ExchangeServiceDetails> {
  return ovhGet<ExchangeServiceDetails>(
    `/email/exchange/${organizationName}/service/${exchangeService}`
  );
}

/**
 * Liste tous les services Exchange (toutes organisations)
 */
export async function getAllExchangeServices(): Promise<EmailServiceSummary[]> {
  const organizations = await getExchangeOrganizations();
  const allServices: EmailServiceSummary[] = [];

  for (const org of organizations) {
    try {
      const services = await getExchangeServicesForOrg(org);
      for (const svc of services) {
        allServices.push({
          id: svc.domain,
          type: "exchange",
          name: svc.domain,
          displayName: svc.displayName || svc.domain,
          offer: "exchange",
          offerDetail: svc.offer,
          domain: svc.domain,
          organization: org,
          accountsCount: 0, // Will be populated separately
          state: svc.state as ServiceState,
        });
      }
    } catch (e) {
      console.warn(`Failed to get Exchange services for org ${org}:`, e);
    }
  }

  return allServices;
}

// ---------- EMAIL PRO ----------

/**
 * Liste les services Email Pro
 * GET /email/pro
 */
export async function getEmailProServices(): Promise<string[]> {
  return ovhGet<string[]>("/email/pro");
}

/**
 * Détails d'un service Email Pro
 * GET /email/pro/{service}
 */
export async function getEmailProServiceDetails(
  service: string
): Promise<EmailProServiceDetails> {
  return ovhGet<EmailProServiceDetails>(`/email/pro/${service}`);
}

/**
 * Liste tous les services Email Pro avec détails
 */
export async function getAllEmailProServices(): Promise<EmailServiceSummary[]> {
  const serviceIds = await getEmailProServices();
  const services: EmailServiceSummary[] = [];

  for (const id of serviceIds) {
    try {
      const details = await getEmailProServiceDetails(id);
      services.push({
        id,
        type: "emailpro",
        name: id,
        displayName: details.displayName || id,
        offer: "email-pro",
        domain: details.domain,
        accountsCount: 0,
        state: details.state as ServiceState,
      });
    } catch (e) {
      console.warn(`Failed to get EmailPro service ${id}:`, e);
    }
  }

  return services;
}

// ---------- MX PLAN ----------

/**
 * Liste les services MX Plan
 * GET /email/mxplan
 */
export async function getMXPlanServices(): Promise<string[]> {
  return ovhGet<string[]>("/email/mxplan");
}

/**
 * Détails d'un service MX Plan
 * GET /email/mxplan/{service}
 */
export async function getMXPlanServiceDetails(
  service: string
): Promise<MXPlanServiceDetails> {
  return ovhGet<MXPlanServiceDetails>(`/email/mxplan/${service}`);
}

/**
 * Liste tous les services MX Plan avec détails
 */
export async function getAllMXPlanServices(): Promise<EmailServiceSummary[]> {
  const serviceIds = await getMXPlanServices();
  const services: EmailServiceSummary[] = [];

  for (const id of serviceIds) {
    try {
      const details = await getMXPlanServiceDetails(id);
      services.push({
        id,
        type: "mxplan",
        name: id,
        displayName: id,
        offer: "mx-plan",
        offerDetail: details.offer,
        domain: details.domain,
        accountsCount: 0,
        state: details.state as ServiceState,
        creationDate: details.creationDate,
      });
    } catch (e) {
      console.warn(`Failed to get MXPlan service ${id}:`, e);
    }
  }

  return services;
}

// ---------- ALL SERVICES ----------

/**
 * Liste tous les services email (Exchange, EmailPro, MXPlan)
 * Agrégation de toutes les offres
 */
export async function getAllEmailServices(): Promise<EmailServiceSummary[]> {
  const [exchange, emailpro, mxplan] = await Promise.all([
    getAllExchangeServices().catch(() => []),
    getAllEmailProServices().catch(() => []),
    getAllMXPlanServices().catch(() => []),
  ]);

  return [...exchange, ...emailpro, ...mxplan];
}

/**
 * Compte le nombre de comptes pour un service
 */
export async function getServiceAccountsCount(
  service: EmailServiceSummary
): Promise<number> {
  try {
    switch (service.type) {
      case "exchange": {
        const accounts = await ovhGet<string[]>(
          `/email/exchange/${service.organization}/service/${service.id}/account`
        );
        return accounts.length;
      }
      case "emailpro": {
        const accounts = await ovhGet<string[]>(
          `/email/pro/${service.id}/account`
        );
        return accounts.length;
      }
      case "mxplan": {
        const accounts = await ovhGet<string[]>(
          `/email/mxplan/${service.id}/account`
        );
        return accounts.length;
      }
      default:
        return 0;
    }
  } catch {
    return 0;
  }
}
