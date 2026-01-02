// ============================================================
// API ORDERS - Commandes de comptes et historique
// Endpoints: /order/email/..., /me/order
// ============================================================

import { ovhGet, ovhPost, ovh2apiGet } from "../../../../services/api";
import type { EmailServiceType } from "./services.api";
import type { LicenseType } from "./billing.api";

// ---------- TYPES ----------

export type OrderStatus = "notPaid" | "unpaid" | "paid" | "cancelled" | "refunded" | "expired";

export interface OrderPrice {
  currencyCode: string;
  text: string;
  value: number;
}

export interface OrderContract {
  name: string;
  url: string;
  content?: string;
}

export interface AccountOrderOptions {
  durations: string[];
  prices: {
    [duration: string]: {
      price: OrderPrice;
      priceInUcents: number;
      tax: OrderPrice;
    };
  };
  contracts: OrderContract[];
}

export interface AccountOrderRequest {
  number: number;
  licence?: LicenseType;
  storageQuota?: number;
}

export interface OrderResult {
  orderId: number;
  url: string;
  prices: {
    withTax: OrderPrice;
    withoutTax: OrderPrice;
    tax: OrderPrice;
  };
  contracts: OrderContract[];
}

export interface Order {
  orderId: number;
  date: string;
  expirationDate?: string;
  password?: string;
  pdfUrl: string;
  priceWithTax: OrderPrice;
  priceWithoutTax: OrderPrice;
  retractionDate?: string;
  tax: OrderPrice;
  url: string;
}

export interface OrderDetail {
  description: string;
  detailType: string;
  domain: string;
  orderDetailId: number;
  quantity: string;
  totalPrice: OrderPrice;
  unitPrice: OrderPrice;
}

// ---------- EXCHANGE ORDER ----------

/**
 * Liste les durées disponibles pour commander des comptes Exchange
 * GET /order/email/exchange/{organization}/service/{exchange}/account
 */
export async function getExchangeAccountOrderDurations(
  organization: string,
  exchangeService: string
): Promise<string[]> {
  return ovhGet<string[]>(
    `/order/email/exchange/${organization}/service/${exchangeService}/account`
  );
}

/**
 * Récupère les options de commande pour une durée donnée
 * GET /order/email/exchange/{organization}/service/{exchange}/account/{duration}
 */
export async function getExchangeAccountOrderOptions(
  organization: string,
  exchangeService: string,
  duration: string,
  params?: { number?: number; licence?: LicenseType; storageQuota?: number }
): Promise<AccountOrderOptions> {
  let url = `/order/email/exchange/${organization}/service/${exchangeService}/account/${duration}`;
  const queryParams: string[] = [];
  if (params?.number) queryParams.push(`number=${params.number}`);
  if (params?.licence) queryParams.push(`licence=${params.licence}`);
  if (params?.storageQuota) queryParams.push(`storageQuota=${params.storageQuota}`);
  if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

  return ovhGet<AccountOrderOptions>(url);
}

/**
 * Commande des comptes Exchange
 * POST /order/email/exchange/{organization}/service/{exchange}/account/{duration}
 */
export async function orderExchangeAccounts(
  organization: string,
  exchangeService: string,
  duration: string,
  data: AccountOrderRequest
): Promise<OrderResult> {
  return ovhPost<OrderResult>(
    `/order/email/exchange/${organization}/service/${exchangeService}/account/${duration}`,
    data
  );
}

// ---------- EMAIL PRO ORDER ----------

/**
 * Liste les durées disponibles pour commander des comptes Email Pro
 * GET /order/email/pro/{service}/account
 */
export async function getEmailProAccountOrderDurations(
  service: string
): Promise<string[]> {
  return ovhGet<string[]>(`/order/email/pro/${service}/account`);
}

/**
 * Récupère les options de commande Email Pro
 * GET /order/email/pro/{service}/account/{duration}
 */
export async function getEmailProAccountOrderOptions(
  service: string,
  duration: string,
  params?: { number?: number }
): Promise<AccountOrderOptions> {
  let url = `/order/email/pro/${service}/account/${duration}`;
  if (params?.number) url += `?number=${params.number}`;

  return ovhGet<AccountOrderOptions>(url);
}

/**
 * Commande des comptes Email Pro
 * POST /order/email/pro/{service}/account/{duration}
 */
export async function orderEmailProAccounts(
  service: string,
  duration: string,
  data: { number: number }
): Promise<OrderResult> {
  return ovhPost<OrderResult>(
    `/order/email/pro/${service}/account/${duration}`,
    data
  );
}

// ---------- 2API ORDER LIST ----------

/**
 * Liste les commandes en attente via 2API
 * GET /sws/emailpro/{exchange}/accounts/orders
 */
export async function getEmailProPendingOrders(
  service: string,
  isMXPlan = false
): Promise<Order[]> {
  return ovh2apiGet<Order[]>(
    `/sws/emailpro/${service}/accounts/orders`,
    { isMXPlan: isMXPlan ? 1 : 0 }
  );
}

// ---------- ME/ORDER ----------

/**
 * Liste toutes les commandes du compte
 * GET /me/order
 */
export async function getMyOrders(
  options?: { from?: string; to?: string }
): Promise<number[]> {
  let url = "/me/order";
  const params: string[] = [];
  if (options?.from) params.push(`date.from=${options.from}`);
  if (options?.to) params.push(`date.to=${options.to}`);
  if (params.length > 0) url += `?${params.join("&")}`;

  return ovhGet<number[]>(url);
}

/**
 * Récupère les détails d'une commande
 * GET /me/order/{orderId}
 */
export async function getOrder(orderId: number): Promise<Order> {
  return ovhGet<Order>(`/me/order/${orderId}`);
}

/**
 * Récupère les lignes de détail d'une commande
 * GET /me/order/{orderId}/details
 */
export async function getOrderDetails(orderId: number): Promise<number[]> {
  return ovhGet<number[]>(`/me/order/${orderId}/details`);
}

/**
 * Récupère une ligne de détail
 * GET /me/order/{orderId}/details/{detailId}
 */
export async function getOrderDetailInfo(
  orderId: number,
  detailId: number
): Promise<OrderDetail> {
  return ovhGet<OrderDetail>(`/me/order/${orderId}/details/${detailId}`);
}

/**
 * Récupère le statut d'une commande
 * GET /me/order/{orderId}/status
 */
export async function getOrderStatus(orderId: number): Promise<OrderStatus> {
  return ovhGet<OrderStatus>(`/me/order/${orderId}/status`);
}

// ---------- AGGREGATED ORDER FUNCTIONS ----------

/**
 * Récupère les options de commande pour un service
 */
export async function getAccountOrderOptionsForService(
  serviceType: EmailServiceType,
  serviceId: string,
  duration: string,
  organization?: string,
  params?: { number?: number; licence?: LicenseType }
): Promise<AccountOrderOptions> {
  switch (serviceType) {
    case "exchange":
      if (!organization) throw new Error("Organization required for Exchange");
      return getExchangeAccountOrderOptions(organization, serviceId, duration, params);
    case "emailpro":
      return getEmailProAccountOrderOptions(serviceId, duration, params);
    default:
      throw new Error(`Account ordering not supported for ${serviceType}`);
  }
}

/**
 * Commande des comptes pour un service
 */
export async function orderAccountsForService(
  serviceType: EmailServiceType,
  serviceId: string,
  duration: string,
  data: AccountOrderRequest,
  organization?: string
): Promise<OrderResult> {
  switch (serviceType) {
    case "exchange":
      if (!organization) throw new Error("Organization required for Exchange");
      return orderExchangeAccounts(organization, serviceId, duration, data);
    case "emailpro":
      return orderEmailProAccounts(serviceId, duration, { number: data.number });
    default:
      throw new Error(`Account ordering not supported for ${serviceType}`);
  }
}

// ---------- HISTORY HELPERS ----------

export interface OrderHistoryItem {
  orderId: number;
  date: string;
  status: OrderStatus;
  description: string;
  amount: number;
  currency: string;
  pdfUrl?: string;
  domain?: string;
  type: "purchase" | "upgrade" | "renewal" | "other";
}

/**
 * Récupère l'historique des commandes email avec détails
 */
export async function getEmailOrderHistory(
  options?: { from?: string; to?: string; limit?: number }
): Promise<OrderHistoryItem[]> {
  const orderIds = await getMyOrders(options);
  const limitedIds = options?.limit
    ? orderIds.slice(0, options.limit)
    : orderIds.slice(0, 50); // Default limit

  const history: OrderHistoryItem[] = [];

  for (const orderId of limitedIds) {
    try {
      const [order, status] = await Promise.all([
        getOrder(orderId),
        getOrderStatus(orderId),
      ]);

      // Récupérer le premier détail pour avoir le domain
      const detailIds = await getOrderDetails(orderId);
      let description = "";
      let domain = "";
      let type: OrderHistoryItem["type"] = "other";

      if (detailIds.length > 0) {
        const detail = await getOrderDetailInfo(orderId, detailIds[0]);
        description = detail.description;
        domain = detail.domain;

        // Détecter le type
        const descLower = description.toLowerCase();
        if (descLower.includes("exchange") || descLower.includes("email")) {
          if (descLower.includes("renew") || descLower.includes("renewal")) {
            type = "renewal";
          } else if (descLower.includes("upgrade")) {
            type = "upgrade";
          } else {
            type = "purchase";
          }
        }
      }

      history.push({
        orderId,
        date: order.date,
        status,
        description,
        amount: order.priceWithTax.value,
        currency: order.priceWithTax.currencyCode,
        pdfUrl: order.pdfUrl,
        domain,
        type,
      });
    } catch (e) {
      console.warn(`Failed to get order ${orderId}:`, e);
    }
  }

  return history;
}
