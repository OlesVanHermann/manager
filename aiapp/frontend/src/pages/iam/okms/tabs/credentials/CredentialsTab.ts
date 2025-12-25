// ============================================================
// CREDENTIALS SERVICE - Service API isolé pour l'onglet Credentials
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { Credential } from "../../okms.types";

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère la liste des credentials d'un OKMS. */
export async function getCredentials(serviceId: string): Promise<Credential[]> {
  const ids = await ovhGet<string[]>(`/okms/resource/${serviceId}/credential`);
  const credentials = await Promise.all(
    ids.map((id) => ovhGet<Credential>(`/okms/resource/${serviceId}/credential/${id}`))
  );
  return credentials;
}

/** Récupère les détails d'un credential. */
export async function getCredential(serviceId: string, credentialId: string): Promise<Credential> {
  return ovhGet<Credential>(`/okms/resource/${serviceId}/credential/${credentialId}`);
}

/** Crée un nouveau credential. */
export async function createCredential(
  serviceId: string,
  data: { name: string; description?: string; validity: number }
): Promise<Credential> {
  return ovhPost<Credential>(`/okms/resource/${serviceId}/credential`, data);
}

/** Révoque un credential. */
export async function revokeCredential(serviceId: string, credentialId: string): Promise<void> {
  return ovhDelete(`/okms/resource/${serviceId}/credential/${credentialId}`);
}
