// ============================================================
// REFERENCES TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";

// ============ TYPES ============

export interface PurchaseOrder {
  id: number;
  reference: string;
  creationDate: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  status: string;
  type: string;
}

export interface PurchaseOrderCreate {
  reference: string;
  startDate: string;
  endDate?: string;
  type?: string;
}

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

// ============ PURCHASE ORDERS API ============

export async function getPurchaseOrderIds(): Promise<number[]> {
  return ovhGet<number[]>("/me/billing/purchaseOrder");
}

export async function getPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return ovhGet<PurchaseOrder>(`/me/billing/purchaseOrder/${id}`);
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const ids = await getPurchaseOrderIds();
  const orders = await Promise.all(ids.map((id) => getPurchaseOrder(id).catch(() => null)));
  return orders
    .filter((o): o is PurchaseOrder => o !== null)
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
}

export async function createPurchaseOrder(data: PurchaseOrderCreate): Promise<PurchaseOrder> {
  return ovhPost<PurchaseOrder>("/me/billing/purchaseOrder", data);
}

export async function updatePurchaseOrder(id: number, data: Partial<PurchaseOrderCreate> & { active?: boolean }): Promise<PurchaseOrder> {
  return ovhPut<PurchaseOrder>(`/me/billing/purchaseOrder/${id}`, data);
}
