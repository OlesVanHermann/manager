// ============================================================
// CDN TAB SERVICE - API calls for CdnTab
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { AttachedDomain } from "../../hosting.types";

const BASE = "/hosting/web";

export const cdnService = {
  // --- CDN Info ---
  getCdnInfo: (sn: string) => 
    ovhGet<any>(`${BASE}/${sn}/cdn`).catch(() => null),

  // --- Flush CDN ---
  flushCdn: (sn: string) => 
    ovhPost<void>(`${BASE}/${sn}/cdn/flush`, {}),

  flushCdnDomain: (sn: string, domain: string) => 
    ovhPost<void>(`${BASE}/${sn}/cdn/flush`, { domain }),

  flushCdnPattern: (sn: string, domain: string, purgeType: string, pattern?: string) => {
    const payload: any = { patternType: purgeType };
    if (purgeType !== "all" && pattern) payload.pattern = pattern;
    if (domain) payload.domain = domain;
    return ovhPost<void>(`${BASE}/${sn}/cdn/flush`, payload);
  },

  // --- Attached Domains ---
  getAttachedDomains: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  getAttachedDomainInfo: (sn: string, domain: string) => 
    ovhGet<AttachedDomain>(`${BASE}/${sn}/attachedDomain/${domain}`),

  // --- Activate/Deactivate CDN per domain ---
  activateCdnDomain: (sn: string, domain: string) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { cdn: "active" }),

  deactivateCdnDomain: (sn: string, domain: string) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { cdn: "none" }),

  // --- Order CDN ---
  orderCdn: (sn: string, type: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { 
      planCode: `cdn-${type}`, 
      quantity: 1 
    }),
};

export default cdnService;
