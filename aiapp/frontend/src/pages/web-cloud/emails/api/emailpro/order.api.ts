// ============================================================
// API EMAIL PRO - Commandes (Order)
// Endpoints: /order/email/pro/{service}/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/order/email/pro";

// ---------- TYPES ----------

export interface OrderPrice {
  currencyCode: string;
  text: string;
  value: number;
}

export interface OrderDetail {
  description: string;
  domain: string;
  quantity: number;
  totalPrice: OrderPrice;
  unitPrice: OrderPrice;
}

export interface Order {
  orderId: number;
  url: string;
  prices: {
    withTax: OrderPrice;
    withoutTax: OrderPrice;
    tax: OrderPrice;
  };
  details: OrderDetail[];
}

// ---------- ACCOUNT ORDER ----------

/**
 * Récupérer les durées disponibles pour commander des comptes
 */
export async function getAvailableDurations(serviceId: string): Promise<string[]> {
  return apiFetch<string[]>(`${BASE}/${serviceId}/account`);
}

/**
 * Options pour commander des comptes supplémentaires
 * Équivalent old_manager: prepareForOrder (emailpro)
 */
export async function getAccountOptions(
  serviceId: string,
  duration: string
): Promise<{
  number: number[];
}> {
  return apiFetch(`${BASE}/${serviceId}/account/${duration}`);
}

/**
 * Commander des comptes supplémentaires
 * Équivalent old_manager: orderAccounts (emailpro)
 */
export async function orderAccounts(
  serviceId: string,
  duration: string,
  data: {
    number: number;
  }
): Promise<Order> {
  return apiFetch<Order>(`${BASE}/${serviceId}/account/${duration}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
