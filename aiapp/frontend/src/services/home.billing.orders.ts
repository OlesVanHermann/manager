// ============================================================
// ORDERS SERVICE - Commandes OVHcloud
// Utilise le helper centralisé api.ts
// ============================================================

import { ovhGet } from "./api";
import type { OvhCredentials } from "../types/auth.types";

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

export interface OrderWithStatus extends Order {
  status: string;
}

// ============ COMMANDES (/me/order) ============

/** Récupère la liste des IDs de commandes, filtrée par période optionnelle. */
export async function getOrderIds(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<number[]>(`/me/order${query}`);
}

/** Récupère le détail d'une commande par son ID. */
export async function getOrder(credentials: OvhCredentials, orderId: number): Promise<Order> {
  return ovhGet<Order>(`/me/order/${orderId}`);
}

/** Récupère le statut d'une commande. */
export async function getOrderStatus(credentials: OvhCredentials, orderId: number): Promise<OrderStatus> {
  return ovhGet<OrderStatus>(`/me/order/${orderId}/status`);
}

/** Récupère la liste des IDs de détails d'une commande. */
export async function getOrderDetails(credentials: OvhCredentials, orderId: number): Promise<number[]> {
  return ovhGet<number[]>(`/me/order/${orderId}/details`);
}

/** Récupère un détail spécifique d'une commande. */
export async function getOrderDetail(credentials: OvhCredentials, orderId: number, detailId: number): Promise<OrderDetail> {
  return ovhGet<OrderDetail>(`/me/order/${orderId}/details/${detailId}`);
}

// ============ COMMANDES AVEC STATUT ============

/** Récupère les commandes avec leur statut, chargement par batch de 10. */
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
