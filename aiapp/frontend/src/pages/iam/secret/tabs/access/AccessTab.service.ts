// ============================================================
// ACCESS SERVICE - Service API isolé pour l'onglet Access
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { AccessRule } from "../../secret.types";

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère les règles d'accès d'un Secret Manager. */
export async function getAccessRules(serviceId: string): Promise<AccessRule[]> {
  return ovhGet<AccessRule[]>(`/secretManager/${serviceId}/access`);
}

/** Accorde un accès à un Secret Manager. */
export async function grantAccess(
  serviceId: string,
  data: { identity: string; permission: string }
): Promise<AccessRule> {
  return ovhPost<AccessRule>(`/secretManager/${serviceId}/access`, data);
}

/** Révoque un accès à un Secret Manager. */
export async function revokeAccess(serviceId: string, ruleId: string): Promise<void> {
  return ovhDelete(`/secretManager/${serviceId}/access/${ruleId}`);
}
