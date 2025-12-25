// ============================================================
// CONTACTS REQUESTS TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";

// ============ TYPES ============

export interface ContactChangeRequest {
  id: number;
  serviceName: string;
  contactType: "admin" | "billing" | "tech";
  fromAccount: string;
  toAccount: string;
  status: "pending" | "accepted" | "refused" | "expired";
  creationDate: string;
  lastUpdateDate?: string;
  token?: string;
}

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "En attente",
    accepted: "Acceptée",
    refused: "Refusée",
    expired: "Expirée",
  };
  return labels[status] || status;
}

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    pending: "contacts-requests-badge-warning",
    accepted: "contacts-requests-badge-success",
    refused: "contacts-requests-badge-error",
    expired: "contacts-requests-badge-neutral",
  };
  return classes[status] || "contacts-requests-badge-neutral";
}

// ============ CONTACT REQUESTS API ============

export async function getContactChangeRequestIds(): Promise<number[]> {
  try {
    return await ovhGet<number[]>("/me/task/contactChange");
  } catch {
    return [];
  }
}

export async function getContactChangeRequest(id: number): Promise<ContactChangeRequest | null> {
  try {
    return await ovhGet<ContactChangeRequest>(`/me/task/contactChange/${id}`);
  } catch {
    return null;
  }
}

export async function getContactChangeRequests(): Promise<ContactChangeRequest[]> {
  const ids = await getContactChangeRequestIds();
  const requests = await Promise.all(ids.map((id) => getContactChangeRequest(id)));
  return requests
    .filter((r): r is ContactChangeRequest => r !== null)
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
}

export async function acceptContactChangeRequest(id: number, token: string): Promise<void> {
  await ovhPost(`/me/task/contactChange/${id}/accept`, { token });
}

export async function refuseContactChangeRequest(id: number, token: string): Promise<void> {
  await ovhPost(`/me/task/contactChange/${id}/refuse`, { token });
}

// ============ ALIASES ============

export async function getContactChanges(): Promise<ContactChangeRequest[]> {
  return getContactChangeRequests();
}

export async function acceptContactChange(id: number, token: string): Promise<void> {
  return acceptContactChangeRequest(id, token);
}

export async function refuseContactChange(id: number, token: string): Promise<void> {
  return refuseContactChangeRequest(id, token);
}
