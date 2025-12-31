// ============================================================
// MULTISITE TAB SERVICE - API calls for MultisiteTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { AttachedDomain } from "../../hosting.types";

const BASE = "/hosting/web";

export const multisiteService = {
  // --- Attached Domains ---
  listAttachedDomains: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  getAttachedDomain: (sn: string, domain: string) => 
    ovhGet<AttachedDomain>(`${BASE}/${sn}/attachedDomain/${domain}`),

  createAttachedDomain: (sn: string, data: Partial<AttachedDomain>) => 
    ovhPost<void>(`${BASE}/${sn}/attachedDomain`, data),

  updateAttachedDomain: (sn: string, domain: string, data: Partial<AttachedDomain>) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, data),

  deleteAttachedDomain: (sn: string, domain: string) => 
    ovhDelete<void>(`${BASE}/${sn}/attachedDomain/${domain}`),

  // --- CDN Flush ---
  flushDomainCdn: (sn: string, domain: string, purgeType = "all", pattern = "") => {
    const payload: any = { patternType: purgeType };
    if (purgeType !== "all" && pattern) payload.pattern = pattern;
    if (domain) payload.domain = domain;
    return ovhPost<void>(`${BASE}/${sn}/cdn/flush`, payload);
  },

  // --- SSL ---
  regenerateSsl: (sn: string) => 
    ovhPost<void>(`${BASE}/${sn}/ssl/regenerate`, {}),

  activateDomainSsl: (sn: string, domain: string) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: true }),

  deactivateDomainSsl: (sn: string, domain: string) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: false }),
};

export default multisiteService;
