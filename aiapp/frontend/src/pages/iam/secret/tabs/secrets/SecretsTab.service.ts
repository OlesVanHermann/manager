// ============================================================
// SECRETS SERVICE - Service API isolé pour l'onglet Secrets
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { Secret } from "../../secret.types";

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère la liste des secrets d'un Secret Manager. */
export async function getSecrets(serviceId: string): Promise<Secret[]> {
  const ids = await ovhGet<string[]>(`/secretManager/${serviceId}/secret`);
  const secrets = await Promise.all(
    ids.map((id) => ovhGet<Secret>(`/secretManager/${serviceId}/secret/${id}`))
  );
  return secrets;
}

/** Récupère les détails d'un secret. */
export async function getSecret(serviceId: string, secretId: string): Promise<Secret> {
  return ovhGet<Secret>(`/secretManager/${serviceId}/secret/${secretId}`);
}

/** Crée un nouveau secret. */
export async function createSecret(
  serviceId: string,
  data: { name: string; description?: string }
): Promise<Secret> {
  return ovhPost<Secret>(`/secretManager/${serviceId}/secret`, data);
}

/** Supprime un secret. */
export async function deleteSecret(serviceId: string, secretId: string): Promise<void> {
  return ovhDelete(`/secretManager/${serviceId}/secret/${secretId}`);
}
