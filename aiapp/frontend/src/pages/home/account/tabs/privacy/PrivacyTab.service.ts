// ============================================================
// PRIVACY TAB SERVICE - Service ISOLÉ pour la gestion RGPD
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";

// ============ TYPES ============

export interface PrivacyCapabilities {
  canRequestErasure: boolean;
}

export interface PrivacyRequest {
  id: number;
  status: "in_progress" | "confirm_verification_code" | "completed" | "cancelled" | "blocked";
  creationDate: string;
  completionDate?: string;
}

// ============ HELPERS LOCAUX ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ============ API ============

/** Récupère les capacités RGPD du compte */
export async function getPrivacyCapabilities(): Promise<PrivacyCapabilities> {
  try {
    return await ovhGet<PrivacyCapabilities>("/me/privacy/requests/capabilities");
  } catch {
    return { canRequestErasure: true };
  }
}

/** Récupère toutes les demandes RGPD */
export async function getAllPrivacyRequests(): Promise<PrivacyRequest[]> {
  try {
    const ids = await ovhGet<number[]>("/me/privacy/requests");
    if (!ids || ids.length === 0) return [];
    const requests = await Promise.all(
      ids.map((id) => ovhGet<PrivacyRequest>(`/me/privacy/requests/${id}`).catch(() => null))
    );
    return requests.filter((r): r is PrivacyRequest => r !== null);
  } catch {
    return [];
  }
}

/** Crée une demande d'effacement */
export async function createErasureRequest(): Promise<PrivacyRequest> {
  return ovhPost<PrivacyRequest>("/me/privacy/requests", { type: "erasure" });
}

/** Envoie l'email de confirmation */
export async function sendErasureConfirmationEmail(requestId: string): Promise<void> {
  await ovhPost(`/me/privacy/requests/${requestId}/sendConfirmationEmail`, {});
}

/** Confirme la demande d'effacement avec le code */
export async function confirmErasure(requestId: string, code: string): Promise<void> {
  await ovhPost(`/me/privacy/requests/${requestId}/confirm`, { token: code });
}

/** Annule une demande d'effacement */
export async function cancelErasureRequest(requestId: string): Promise<void> {
  await ovhDelete(`/me/privacy/requests/${requestId}`);
}
