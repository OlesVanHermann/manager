// ============================================================
// CHANGE TAB SERVICE - API calls for hosting offer upgrade
// Ref: old_manager hosting-offer.controller.js
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";

const BASE = "/hosting/web";
const ORDER_BASE = "/order/upgrade/webHosting";

// ============ TYPES ============

export interface AvailableOffer {
  offer: string;
  price: {
    currencyCode: string;
    text: string;
    value: number;
  };
  duration: string;
}

export interface OfferDetails {
  name: string;
  displayName: string;
  diskSize: number;
  traffic: string;
  emailsCount: number;
  databasesCount: number;
  ftpUsersCount: number;
  sslIncluded: boolean;
  cdnIncluded: boolean;
  boostOffer?: string;
  price?: {
    text: string;
    value: number;
  };
}

export interface OrderDetails {
  order: {
    orderId: number;
    url: string;
    prices: {
      withTax: { text: string; value: number };
      withoutTax: { text: string; value: number };
    };
  };
  contracts: Array<{
    name: string;
    url: string;
    content: string;
  }>;
  details: Array<{
    description: string;
    quantity: number;
    totalPrice: { text: string; value: number };
    unitPrice: { text: string; value: number };
  }>;
}

export interface CatalogOffer {
  planCode: string;
  invoiceName: string;
  prices: Array<{
    price: { text: string; value: number };
    pricingMode: string;
    duration: string;
  }>;
  configurations?: Array<{
    name: string;
    values: string[];
  }>;
}

// ============ SERVICE ============

export const changeService = {
  // Get available offers for upgrade
  getAvailableOffers: (serviceName: string): Promise<AvailableOffer[]> =>
    ovhGet<AvailableOffer[]>(`${BASE}/${serviceName}/availableOffer`),

  // List upgrade plan codes
  listUpgradePlans: (serviceName: string): Promise<string[]> =>
    ovhGet<string[]>(`${ORDER_BASE}/${serviceName}`),

  // Get details for a specific upgrade plan
  getUpgradePlanDetails: (
    serviceName: string,
    planCode: string,
    quantity: number = 1
  ): Promise<OrderDetails> =>
    ovhGet<OrderDetails>(`${ORDER_BASE}/${serviceName}/${planCode}`, {
      params: { quantity },
    } as any),

  // Execute the upgrade order
  executeUpgrade: (
    serviceName: string,
    planCode: string,
    quantity: number = 1,
    autoPayWithPreferredPaymentMethod: boolean = false
  ): Promise<{ orderId: number; url: string }> =>
    ovhPost<{ orderId: number; url: string }>(
      `${ORDER_BASE}/${serviceName}/${planCode}`,
      {
        quantity,
        autoPayWithPreferredPaymentMethod,
      }
    ),

  // Get catalog offers for comparison
  getCatalogOffers: (): Promise<CatalogOffer[]> =>
    ovhGet<{ plans: CatalogOffer[] }>("/order/catalog/public/webHosting").then(
      (res) => res.plans || []
    ),

  // Get offer capabilities (for feature comparison)
  getOfferCapabilities: (
    offer: string
  ): Promise<{
    diskSize: number;
    traffic: string;
    emailsQuota: number;
    databasesCount: number;
    ftpUsersCount: number;
    attachedDomains: number;
    languages: string[];
  }> => ovhGet(`/hosting/web/offerCapabilities`, { params: { offer } } as any),
};

export default changeService;
