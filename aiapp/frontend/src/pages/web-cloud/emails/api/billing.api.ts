// ============================================================
// API BILLING - Facturation et renouvellement des comptes
// Endpoints: /sws/.../accounts, /sws/.../accounts/renew
// ============================================================

import { ovh2apiGet, ovh2apiPut, ovhGet } from "../../../../services/api";
import type { EmailServiceType } from "./services.api";

// ---------- TYPES ----------

export type RenewPeriod = "MONTHLY" | "YEARLY" | "DELETE_AT_EXPIRATION";
export type LicenseType = "standard" | "basic" | "enterprise";
export type AccountState = "ok" | "suspended" | "creating" | "deleting" | "reopening";

export interface AccountBilling {
  primaryEmailAddress: string;
  displayName?: string;
  login: string;
  domain: string;
  accountLicense: LicenseType;
  renewPeriod: RenewPeriod;
  deleteAtExpiration: boolean;
  outlookLicense: boolean;
  quota: number;
  usedQuota: number;
  state: AccountState;
  creationDate?: string;
  expirationDate?: string;
  configured: boolean;
  spamAndVirusConfiguration?: {
    checkDKIM: boolean;
    checkSPF: boolean;
  };
}

export interface AccountBillingList {
  count: number;
  list: {
    results: AccountBilling[];
  };
}

export interface UpdateRenewRequest {
  primaryEmailAddress: string;
  renewPeriod?: RenewPeriod;
  deleteAtExpiration?: boolean;
}

export interface ServiceBillingInfo {
  serviceName: string;
  serviceType: EmailServiceType;
  renewalDate?: string;
  expirationDate?: string;
  renewPeriod?: RenewPeriod;
  deleteAtExpiration?: boolean;
}

// ---------- EXCHANGE BILLING ----------

/**
 * Liste les comptes Exchange avec infos facturation
 * GET /sws/exchange/{organization}/{exchange}/accounts
 */
export async function getExchangeAccountsBilling(
  organization: string,
  exchangeService: string,
  options?: {
    count?: number;
    offset?: number;
    search?: string;
    configurableOnly?: 0 | 1;
    typeLicence?: string;
  }
): Promise<AccountBillingList> {
  const params: Record<string, string | number> = {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    configurableOnly: options?.configurableOnly ?? 0,
  };
  if (options?.search) params.search = options.search;
  if (options?.typeLicence) params.typeLicence = options.typeLicence;

  return ovh2apiGet<AccountBillingList>(
    `/sws/exchange/${organization}/${exchangeService}/accounts`,
    params
  );
}

/**
 * Met à jour le renouvellement des comptes Exchange
 * PUT /sws/exchange/{organization}/{exchange}/accounts/renew
 */
export async function updateExchangeAccountsRenew(
  organization: string,
  exchangeService: string,
  accounts: UpdateRenewRequest[]
): Promise<void> {
  await ovh2apiPut(
    `/sws/exchange/${organization}/${exchangeService}/accounts/renew`,
    { modelList: accounts }
  );
}

// ---------- EMAIL PRO BILLING ----------

/**
 * Liste les comptes Email Pro avec infos facturation
 * GET /sws/emailpro/{service}/accounts
 */
export async function getEmailProAccountsBilling(
  service: string,
  options?: {
    count?: number;
    offset?: number;
    search?: string;
    configurableOnly?: 0 | 1;
    typeLicence?: string;
    isMXPlan?: boolean;
  }
): Promise<AccountBillingList> {
  const params: Record<string, string | number | boolean> = {
    count: options?.count ?? 25,
    offset: options?.offset ?? 0,
    configurableOnly: options?.configurableOnly ?? 0,
  };
  if (options?.search) params.search = options.search;
  if (options?.typeLicence) params.typeLicence = options.typeLicence;
  if (options?.isMXPlan !== undefined) params.isMXPlan = options.isMXPlan;

  return ovh2apiGet<AccountBillingList>(
    `/sws/emailpro/${service}/accounts`,
    params as Record<string, string | number>
  );
}

/**
 * Met à jour le renouvellement des comptes Email Pro
 * PUT /sws/emailpro/{service}/accounts/renew
 */
export async function updateEmailProAccountsRenew(
  service: string,
  accounts: UpdateRenewRequest[],
  isMXPlan = false
): Promise<void> {
  await ovh2apiPut(
    `/sws/emailpro/${service}/accounts/renew`,
    { modelList: accounts, isMXPlan }
  );
}

// ---------- SERVICE EXPIRATION ----------

/**
 * Gère la suppression à expiration pour Exchange
 * PUT /sws/exchange/{organization}/{exchange}/deleteAtExpiration
 */
export async function updateExchangeDeleteAtExpiration(
  organization: string,
  exchangeService: string,
  deleteAtExpiration: boolean,
  renewType?: { automatic?: boolean; period?: RenewPeriod }
): Promise<void> {
  await ovh2apiPut(
    `/sws/exchange/${organization}/${exchangeService}/deleteAtExpiration`,
    { deleteAtExpiration, ...renewType }
  );
}

/**
 * Gère la suppression à expiration pour Email Pro
 * PUT /sws/emailpro/{service}/deleteAtExpiration
 */
export async function updateEmailProDeleteAtExpiration(
  service: string,
  deleteAtExpiration: boolean,
  renewType?: { automatic?: boolean; period?: RenewPeriod },
  isMXPlan = false
): Promise<void> {
  await ovh2apiPut(
    `/sws/emailpro/${service}/deleteAtExpiration`,
    { deleteAtExpiration, isMXPlan, ...renewType }
  );
}

// ---------- SERVICE INFO ----------

/**
 * Récupère les infos de service pour facturation
 * GET /email/exchange/{org}/service/{svc}/serviceInfos
 */
export async function getExchangeServiceInfo(
  organization: string,
  exchangeService: string
): Promise<{
  domain: string;
  serviceId: number;
  creation: string;
  expiration: string;
  renew?: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    period?: string;
  };
  status: string;
}> {
  return ovhGet(`/email/exchange/${organization}/service/${exchangeService}/serviceInfos`);
}

/**
 * Récupère les infos de service Email Pro
 * GET /email/pro/{service}/serviceInfos
 */
export async function getEmailProServiceInfo(
  service: string
): Promise<{
  domain: string;
  serviceId: number;
  creation: string;
  expiration: string;
  renew?: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    period?: string;
  };
  status: string;
}> {
  return ovhGet(`/email/pro/${service}/serviceInfos`);
}

// ---------- AGGREGATED BILLING ----------

/**
 * Récupère tous les comptes avec leur facturation pour un service
 * (Dispatcher selon le type de service)
 */
export async function getAccountsBillingForService(
  serviceType: EmailServiceType,
  serviceId: string,
  organization?: string,
  options?: { count?: number; offset?: number; search?: string }
): Promise<AccountBilling[]> {
  let result: AccountBillingList;

  switch (serviceType) {
    case "exchange":
      if (!organization) throw new Error("Organization required for Exchange");
      result = await getExchangeAccountsBilling(organization, serviceId, options);
      break;
    case "emailpro":
      result = await getEmailProAccountsBilling(serviceId, options);
      break;
    case "mxplan":
      result = await getEmailProAccountsBilling(serviceId, { ...options, isMXPlan: true });
      break;
    default:
      return [];
  }

  return result.list.results;
}

/**
 * Met à jour le renouvellement pour un service
 */
export async function updateAccountsRenewForService(
  serviceType: EmailServiceType,
  serviceId: string,
  accounts: UpdateRenewRequest[],
  organization?: string
): Promise<void> {
  switch (serviceType) {
    case "exchange":
      if (!organization) throw new Error("Organization required for Exchange");
      await updateExchangeAccountsRenew(organization, serviceId, accounts);
      break;
    case "emailpro":
      await updateEmailProAccountsRenew(serviceId, accounts);
      break;
    case "mxplan":
      await updateEmailProAccountsRenew(serviceId, accounts, true);
      break;
    default:
      throw new Error(`Unsupported service type: ${serviceType}`);
  }
}
