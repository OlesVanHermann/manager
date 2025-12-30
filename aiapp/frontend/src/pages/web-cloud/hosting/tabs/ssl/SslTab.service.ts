// ============================================================
// SSL TAB SERVICE - API calls for SslTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { AttachedDomain, SslCertificate } from "../../hosting.types";

const BASE = "/hosting/web";

export const sslService = {
  // --- SSL Certificate ---
  getSsl: (sn: string) => 
    ovhGet<SslCertificate>(`${BASE}/${sn}/ssl`).catch(() => null),

  getSslDomains: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/ssl/domains`).catch(() => []),

  regenerateSsl: (sn: string) => 
    ovhPost<void>(`${BASE}/${sn}/ssl/regenerate`, {}),

  deleteSsl: (sn: string) => 
    ovhDelete<void>(`${BASE}/${sn}/ssl`),

  // --- Let's Encrypt ---
  generateLetsEncrypt: (sn: string) => 
    ovhPost<void>(`${BASE}/${sn}/ssl`, { type: "letsEncrypt" }),

  // --- Import SSL ---
  importSsl: (sn: string, certificate: string, key: string, chain?: string) => 
    ovhPost<void>(`${BASE}/${sn}/ssl`, { certificate, key, chain }),

  // --- Order SSL ---
  orderSsl: (sn: string, type: string, certificate?: string, key?: string, chain?: string) => {
    if (type === "import" && certificate && key) {
      return ovhPost<void>(`${BASE}/${sn}/ssl`, { certificate, key, chain });
    }
    return ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { 
      planCode: `ssl-${type.toLowerCase()}`, 
      quantity: 1 
    });
  },

  orderSectigo: (sn: string, type: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { 
      planCode: `ssl-${type.toLowerCase()}`, 
      quantity: 1 
    }),

  // --- Domain SSL ---
  listAttachedDomains: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  getAttachedDomain: (sn: string, domain: string) => 
    ovhGet<AttachedDomain>(`${BASE}/${sn}/attachedDomain/${domain}`),

  activateDomainSsl: (sn: string, domain: string) => 
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: true }),

  deactivateDomainSsl: (sn: string, domain: string) => 
    ovhDelete<void>(`${BASE}/${sn}/attachedDomain/${domain}/ssl`),
};

export default sslService;
