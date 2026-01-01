// ============================================================
// SSL TAB SERVICE - API calls for SslTab
// (from old_manager hosting-ssl.service.js)
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { AttachedDomain, SslCertificate } from "../../hosting.types";

const BASE = "/hosting/web";

export const sslService = {
  // --- SSL Certificate (from old_manager retrievingCertificate) ---
  getSsl: (sn: string) =>
    ovhGet<SslCertificate>(`${BASE}/${sn}/ssl`).catch(() => null),

  // Get linked domains (from old_manager retrievingLinkedDomains)
  getSslDomains: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/ssl/domains`).catch(() => []),

  // Get validation report (from old_manager retrievingCertificateValidationReport)
  getSslReport: (sn: string) =>
    ovhGet<any>(`${BASE}/${sn}/ssl/report`).catch(() => null),

  // Regenerate SSL (from old_manager regeneratingCertificate)
  regenerateSsl: (sn: string) =>
    ovhPost<void>(`${BASE}/${sn}/ssl/regenerate`, {}),

  // Delete SSL (from old_manager deletingCertificate)
  deleteSsl: (sn: string) =>
    ovhDelete<void>(`${BASE}/${sn}/ssl`),

  // --- Create SSL Certificate (from old_manager creatingCertificate) ---
  // For custom certificate import
  createSsl: (sn: string, certificate: string, key: string, chain?: string) =>
    ovhPost<void>(`${BASE}/${sn}/ssl`, {
      certificate,
      key,
      ...(chain && { chain }),
    }),

  // --- Let's Encrypt ---
  generateLetsEncrypt: (sn: string) =>
    ovhPost<void>(`${BASE}/${sn}/ssl`, {}),

  // --- Import SSL (alias for createSsl) ---
  importSsl: (sn: string, certificate: string, key: string, chain?: string) =>
    sslService.createSsl(sn, certificate, key, chain),

  // --- Order SSL (via cart) ---
  orderSsl: (sn: string, type: string, certificate?: string, key?: string, chain?: string) => {
    if (type === "import" && certificate && key) {
      return sslService.createSsl(sn, certificate, key, chain);
    }
    return ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, {
      planCode: `ssl-${type.toLowerCase()}`,
      quantity: 1,
    });
  },

  orderSectigo: (sn: string, type: string) =>
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, {
      planCode: `ssl-${type.toLowerCase()}`,
      quantity: 1,
    }),

  // --- Domain SSL ---
  listAttachedDomains: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  getAttachedDomain: (sn: string, domain: string) =>
    ovhGet<AttachedDomain>(`${BASE}/${sn}/attachedDomain/${domain}`),

  activateDomainSsl: (sn: string, domain: string) =>
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: true }),

  deactivateDomainSsl: (sn: string, domain: string) =>
    ovhPut<void>(`${BASE}/${sn}/attachedDomain/${domain}`, { ssl: false }),

  // --- SSL Certificate Status helpers (from old_manager getStatuses) ---
  canBeHandled: (status: string) => {
    const statuses: Record<string, { canBeHandled: boolean }> = {
      CREATED: { canBeHandled: true },
      CREATING: { canBeHandled: false },
      DELETING: { canBeHandled: false },
      IMPORTING: { canBeHandled: false },
      REGENERATING: { canBeHandled: false },
    };
    return statuses[status?.toUpperCase()]?.canBeHandled ?? false;
  },
};

export default sslService;
