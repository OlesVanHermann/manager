// ============================================================
// OFFER TAB SERVICE - API calls for Offer info display
// Ref: old_manager hosting.service.js + hosting-offer-upgrade
// ============================================================

import { ovhGet } from "../../../../../services/api";

const BASE = "/hosting/web";

// ============ TYPES ============

export interface ServiceInfos {
  serviceId: number;
  status: string;
  domain: string;
  expiration: string;
  creation: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  renew: {
    automatic: boolean;
    forced: boolean;
    period?: string;
    deleteAtExpiration: boolean;
  };
}

export interface OfferCapabilities {
  attachedDomains: number;
  crontab: boolean;
  databases: { available: number; quota: { unit: string; value: number } }[];
  diskSize: { unit: string; value: number };
  dnsZone: boolean;
  emails: { quota: { unit: string; value: number }; available: number };
  envVars: boolean;
  filesBrowser: boolean;
  ftp: { number: number };
  git: boolean;
  hasHostedSsl: boolean;
  hasCdn: boolean;
  highlight: string;
  isCloudWeb: boolean;
  languages: { nodejs: string[]; php: string[]; python: string[]; ruby: string[] };
  moduleOneClick: boolean;
  multisite: boolean;
  privateDatabases: { available: number; quota: { unit: string; value: number } }[];
  runtimes: number;
  sitesRecommended: number;
  ssh: boolean;
  ssl: boolean;
  traffic: { unit: string; value: number | null };
}

export interface AvailableUpgrade {
  planCode: string;
  productName?: string;
}

// ============ SERVICE ============

export const offerService = {
  // Get service infos (expiration, renewal, etc.)
  getServiceInfos: (serviceName: string): Promise<ServiceInfos> =>
    ovhGet<ServiceInfos>(`${BASE}/${serviceName}/serviceInfos`),

  // Get offer capabilities for current offer
  // Validates offer parameter to prevent "Missing offer parameter" API errors
  getOfferCapabilities: (offer: string): Promise<OfferCapabilities> => {
    const trimmedOffer = offer?.trim();
    if (!trimmedOffer) {
      // Return rejected promise - will be caught by .catch(() => null) in component
      return Promise.reject(new Error("Missing offer parameter while calling offerCapabilities"));
    }
    return ovhGet<OfferCapabilities>(`/hosting/web/offerCapabilities`, {
      params: { offer: trimmedOffer }
    } as any);
  },

  // Get available upgrade options
  getAvailableUpgrades: (serviceName: string): Promise<string[]> =>
    ovhGet<string[]>(`/order/upgrade/webHosting/${serviceName}`).catch(() => []),

  // Get hosting catalog for pricing info
  getCatalog: (ovhSubsidiary = "FR"): Promise<any> =>
    ovhGet<any>(`/order/catalog/public/webHosting`, {
      params: { ovhSubsidiary }
    } as any),
};

export default offerService;
