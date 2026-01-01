// ============================================================
// CDN TAB SERVICE - API calls for CdnTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
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
      quantity: 1,
    }),

  // ============ APIv6 MANQUANTS (from old_manager) ============

  // Flush cache via request action
  flushCacheRequest: (sn: string) =>
    ovhPost<any>(`${BASE}/${sn}/request`, { action: "FLUSH_CACHE" }),

  // Terminate CDN
  terminateCdn: (sn: string) =>
    ovhPost<void>(`${BASE}/${sn}/cdn/terminate`, {}),

  // CDN service info
  getCdnServiceInfo: (sn: string) =>
    ovhGet<any>(`${BASE}/${sn}/cdn/serviceInfos`),

  // Update CDN service info (for termination on expiration)
  updateCdnServiceInfo: (sn: string, renew: { automatic: boolean; forced: boolean; period?: string }) =>
    ovhPost<void>(`${BASE}/${sn}/cdn/serviceInfosUpdate`, { renew }),

  // Get CDN operations
  getCdnOperations: (sn: string) =>
    ovhGet<Array<{ id: number; function: string; status: string }>>(`${BASE}/${sn}/cdn/operation`),

  // Get CDN operation details
  getCdnOperation: (sn: string, operationId: number) =>
    ovhGet<any>(`${BASE}/${sn}/cdn/operation/${operationId}`),

  // Poll CDN operation
  pollCdnOperation: async (sn: string, operationId: number, interval = 5000, maxAttempts = 60) => {
    for (let i = 0; i < maxAttempts; i++) {
      const op = await ovhGet<any>(`${BASE}/${sn}/cdn/operation/${operationId}`);
      if (op.status === "done" || op.status === "canceled") return op;
      if (op.status === "error") throw new Error("Operation failed");
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error("Timeout waiting for CDN operation");
  },

  // ============ SHARED CDN v2 (from old_manager hosting-cdn-shared-settings.service.js) ============

  // List available options for a Shared CDN service
  getSharedCDNAvailableOptions: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/cdn/availableOptions`).catch(() => []),

  // List all domains for a Shared CDN service
  getSharedCDNDomains: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/cdn/domain`).catch(() => []),

  // Get details for a domain on a Shared CDN service
  getSharedCDNDomainDetails: (sn: string, domainName: string) =>
    ovhGet<{
      domain: string;
      status: string;
      type: string;
    }>(`${BASE}/${sn}/cdn/domain/${domainName}`),

  // List all options for a domain
  getCDNDomainsOptions: (sn: string, domainName: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/cdn/domain/${domainName}/option`).catch(() => []),

  // Add new option to domain
  addNewOptionToDomain: (sn: string, domainName: string, data: {
    config?: any;
    enabled?: boolean;
    name: string;
    pattern?: string;
    type?: string;
  }) =>
    ovhPost<void>(`${BASE}/${sn}/cdn/domain/${domainName}/option`, data),

  // Reset an option to its default value
  resetCDNOptionToDefault: (sn: string, domainName: string, optionName: string) =>
    ovhDelete<void>(`${BASE}/${sn}/cdn/domain/${domainName}/option/${optionName}`),

  // Get details for an option on a domain
  getCDNDomainOptionDetails: (sn: string, domainName: string, optionName: string) =>
    ovhGet<{
      config: any;
      enabled: boolean;
      name: string;
      pattern: string;
      type: string;
    }>(`${BASE}/${sn}/cdn/domain/${domainName}/option/${optionName}`),

  // Update an option on a domain
  updateCDNDomainOption: (sn: string, domainName: string, optionName: string, data: {
    config?: any;
    enabled?: boolean;
    pattern?: string;
  }) =>
    ovhPut<void>(`${BASE}/${sn}/cdn/domain/${domainName}/option/${optionName}`, data),

  // Delete an option on a domain
  deleteCDNDomainOption: (sn: string, domainName: string, optionName: string) =>
    ovhDelete<void>(`${BASE}/${sn}/cdn/domain/${domainName}/option/${optionName}`),

  // Flush cache content on CDN for a domain (purge with query params)
  flushCDNDomainCache: (sn: string, domainName: string, purgeType = "all", pattern?: string) => {
    const params = new URLSearchParams();
    params.append("patternType", purgeType);
    if (pattern) params.append("pattern", pattern);
    return ovhPost<void>(`${BASE}/${sn}/cdn/domain/${domainName}/purge?${params.toString()}`, {});
  },

  // Apply CDN settings to prod (refresh)
  applyCdnSettings: (sn: string, domainName: string) =>
    ovhPost<void>(`${BASE}/${sn}/cdn/domain/${domainName}/refresh`, {}),

  // ============ HELPER: Get all CDN domains with details ============
  getAllSharedCDNDomainsDetails: async (sn: string) => {
    const domains = await ovhGet<string[]>(`${BASE}/${sn}/cdn/domain`).catch(() => []);
    if (domains.length === 0) return [];
    return Promise.all(
      domains.map((domain: string) =>
        ovhGet<any>(`${BASE}/${sn}/cdn/domain/${domain}`)
      )
    );
  },

  // ============ HELPER: Get all options for a domain with details ============
  getAllCDNDomainOptionsDetails: async (sn: string, domainName: string) => {
    const options = await ovhGet<string[]>(`${BASE}/${sn}/cdn/domain/${domainName}/option`).catch(() => []);
    if (options.length === 0) return [];
    return Promise.all(
      options.map((opt: string) =>
        ovhGet<any>(`${BASE}/${sn}/cdn/domain/${domainName}/option/${opt}`)
      )
    );
  },

  // ============ UPGRADE APIs (from old_manager hosting-cdn-shared-settings.service.js) ============

  // Execute upgrade to new Shared CDN (CDNv2)
  upgradeToSharedCDN: (
    serviceId: number,
    planCode: string,
    autoPayWithPreferredPaymentMethod = false,
    duration = "P1M",
    pricingMode = "default",
    quantity = 1
  ) =>
    ovhPost<{ orderId: number; url: string }>(`/services/${serviceId}/upgrade/${planCode}/execute`, {
      autoPayWithPreferredPaymentMethod,
      duration,
      pricingMode,
      quantity,
    }),

  // Get order status (from old_manager getOrderStatus)
  getOrderStatus: (orderId: number) =>
    ovhGet<string>(`/me/order/${orderId}/status`),

  // Get available upgrade plancodes (from old_manager getAvailableUpgradePlancodes)
  getAvailableUpgradePlancodes: (serviceId: number) =>
    ovhGet<Array<{
      planCode: string;
      prices: Array<{ capacities: string[]; duration: string; pricingMode: string; minimumQuantity: number }>;
    }>>(`/services/${serviceId}/upgrade`).catch(() => []),

  // Get service options (from old_manager getAvailableOptions)
  getServiceOptions: (parentServiceId: number) =>
    ovhGet<Array<{
      serviceId: number;
      billing: { plan: { code: string } };
    }>>(`/services/${parentServiceId}/options`).catch(() => []),

  // Simulate cart for upgrade (from old_manager simulateCartForUpgrade)
  simulateUpgrade: (serviceId: number, planCode: string, duration = "P1M", pricingMode = "default", quantity = 1) =>
    ovhPost<{ order: { price: { value: number; text: string } } }>(`/services/${serviceId}/upgrade/${planCode}/simulate`, {
      duration,
      pricingMode,
      quantity,
    }),
};

export default cdnService;
