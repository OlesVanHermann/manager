import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

// ============ TYPES ============

export interface Order {
  orderId: number;
  date: string;
  expirationDate: string;
  password: string;
  pdfUrl: string;
  priceWithTax: { currencyCode: string; text: string; value: number };
  priceWithoutTax: { currencyCode: string; text: string; value: number };
  retractionDate?: string;
  tax: { currencyCode: string; text: string; value: number };
  url: string;
}

export interface OrderStatus {
  status: "cancelled" | "cancelling" | "checking" | "delivered" | "delivering" | "documentsRequested" | "notPaid" | "unknown";
}

export interface OrderDetail {
  detailId: number;
  description: string;
  domain: string;
  quantity: number;
  totalPrice: { currencyCode: string; text: string; value: number };
  unitPrice: { currencyCode: string; text: string; value: number };
}

// ============ API REQUEST ============

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, { method, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ ORDERS ============

export async function getOrderIds(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhRequest<number[]>(credentials, "GET", `/me/order${query}`);
}

export async function getOrder(credentials: OvhCredentials, orderId: number): Promise<Order> {
  return ovhRequest<Order>(credentials, "GET", `/me/order/${orderId}`);
}

export async function getOrderStatus(credentials: OvhCredentials, orderId: number): Promise<OrderStatus> {
  return ovhRequest<OrderStatus>(credentials, "GET", `/me/order/${orderId}/status`);
}

export async function getOrderDetails(credentials: OvhCredentials, orderId: number): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", `/me/order/${orderId}/details`);
}

export async function getOrderDetail(credentials: OvhCredentials, orderId: number, detailId: number): Promise<OrderDetail> {
  return ovhRequest<OrderDetail>(credentials, "GET", `/me/order/${orderId}/details/${detailId}`);
}

// ============ ORDERS WITH STATUS ============

export interface OrderWithStatus extends Order {
  status: string;
}

export async function getOrders(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<OrderWithStatus[]> {
  const orderIds = await getOrderIds(credentials, options);
  const idsToFetch = options?.limit ? orderIds.slice(0, options.limit) : orderIds;
  
  const orders: OrderWithStatus[] = [];
  const batchSize = 10;
  
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (id) => {
        try {
          const [order, status] = await Promise.all([
            getOrder(credentials, id),
            getOrderStatus(credentials, id).catch(() => ({ status: "unknown" as const })),
          ]);
          return { ...order, status: status.status };
        } catch {
          return null;
        }
      })
    );
    orders.push(...results.filter((o): o is OrderWithStatus => o !== null));
  }
  
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
