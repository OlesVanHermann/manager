// ============================================================
// SERVICE: ANYCAST - API calls pour DNS Anycast
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";

interface AnycastStatus {
  active: boolean;
  expirationDate?: string;
}

interface AnycastPrice {
  duration: string;
  priceHT: number;
  priceTTC: number;
  currency: string;
}

interface OrderResult {
  orderId: number;
  url: string;
}

/**
 * Service for DNS Anycast operations
 */
export const anycastService = {
  /**
   * Get Anycast status for a domain
   * GET /domain/{domain}/option - Identique old_manager + DnsServersTab.service.ts
   * Returns array of active options, check if "dnsAnycast" is present
   */
  async getAnycastStatus(domain: string): Promise<AnycastStatus> {
    try {
      // Pattern identique old_manager: GET /domain/{domain}/option
      const options = await ovhGet<string[]>(`/domain/${encodeURIComponent(domain)}/option`);
      const active = options.includes("dnsAnycast");

      // If active, get service details for expiration date
      if (active) {
        try {
          const details = await this.getAnycastDetails(domain);
          return {
            active: true,
            expirationDate: details.expiration,
          };
        } catch {
          // Service details not available, but anycast is still active
          return { active: true };
        }
      }

      return { active: false };
    } catch {
      // API error or option endpoint not available
      return { active: false };
    }
  },

  /**
   * Get Anycast pricing
   * GET /order/domain/zone/{zoneName}/dnsAnycast
   * Returns empty array if no valid durations available (no mock data)
   */
  async getAnycastPrices(zoneName: string): Promise<AnycastPrice[]> {
    try {
      // Get available durations
      const durations = await ovhGet<string[]>(
        `/order/domain/zone/${encodeURIComponent(zoneName)}/dnsAnycast`
      );

      // No durations available
      if (!durations || durations.length === 0) {
        return [];
      }

      // Get price for each duration
      const prices: AnycastPrice[] = [];
      for (const duration of durations) {
        try {
          const priceInfo = await ovhGet<{
            prices: { withoutTax: { value: number }; withTax: { value: number }; currency: string }[];
          }>(`/order/domain/zone/${encodeURIComponent(zoneName)}/dnsAnycast/${duration}`);

          if (priceInfo.prices && priceInfo.prices.length > 0) {
            prices.push({
              duration,
              priceHT: priceInfo.prices[0].withoutTax.value,
              priceTTC: priceInfo.prices[0].withTax.value,
              currency: priceInfo.prices[0].currency || "EUR",
            });
          }
        } catch {
          // Skip this duration if pricing fails
        }
      }

      return prices;
    } catch {
      // API error - return empty array (no mock data to avoid invalid order attempts)
      return [];
    }
  },

  /**
   * Order DNS Anycast
   * POST /order/domain/zone/{zoneName}/dnsAnycast/{duration}
   */
  async orderAnycast(zoneName: string, duration: string): Promise<OrderResult> {
    const response = await ovhPost<{ orderId: number; url: string }>(
      `/order/domain/zone/${encodeURIComponent(zoneName)}/dnsAnycast/${duration}`,
      {}
    );
    return response;
  },

  /**
   * Get DNS Anycast service details
   * GET /domain/zone/{zone}/option/anycast/serviceInfos - Identique old_manager
   */
  async getAnycastDetails(zone: string): Promise<{
    expiration: string;
    creation: string;
    renew: { automatic: boolean; deleteAtExpiration: boolean; period?: string };
    contactAdmin: string;
    contactTech: string;
    contactBilling: string;
  }> {
    return ovhGet(`/domain/zone/${encodeURIComponent(zone)}/option/anycast/serviceInfos`);
  },

  /**
   * Terminate DNS Anycast
   * PUT /domain/zone/{zone}/option/anycast/serviceInfos - Identique old_manager
   */
  async terminateAnycast(zone: string): Promise<void> {
    await ovhPut(`/domain/zone/${encodeURIComponent(zone)}/option/anycast/serviceInfos`, {
      renew: {
        automatic: false,
        deleteAtExpiration: true,
      },
    });
  },

  /**
   * Renew Anycast (re-enable auto-renew)
   * PUT /domain/zone/{zone}/option/anycast/serviceInfos - Identique old_manager
   */
  async renewAnycast(zone: string): Promise<void> {
    await ovhPut(`/domain/zone/${encodeURIComponent(zone)}/option/anycast/serviceInfos`, {
      renew: {
        automatic: true,
        deleteAtExpiration: false,
      },
    });
  },
};
