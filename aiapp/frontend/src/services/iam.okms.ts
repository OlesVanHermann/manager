// ============================================================
// IAM OKMS SERVICE - API Key Management Service OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface Okms {
  id: string;
  name: string;
  region: string;
  status: string;
  createdAt: string;
}

export interface Key {
  id: string;
  name: string;
  type: "symmetric" | "asymmetric";
  algorithm: string;
  size: number;
  state: "active" | "deactivated" | "compromised" | "destroyed";
  createdAt: string;
  expiresAt?: string;
}

export interface Credential {
  id: string;
  name: string;
  description?: string;
  status: "active" | "expired" | "revoked";
  createdAt: string;
  expiresAt: string;
  certificatePem?: string;
}

// ============================================================
// OKMS
// ============================================================

/** Récupère la liste des OKMS. */
export async function getOkmsList(): Promise<string[]> {
  return ovhGet<string[]>("/okms/resource");
}

/** Récupère les détails d'un OKMS. */
export async function getOkms(serviceId: string): Promise<Okms> {
  return ovhGet<Okms>(`/okms/resource/${serviceId}`);
}

// ============================================================
// KEYS
// ============================================================

/** Récupère la liste des clés d'un OKMS. */
export async function getKeys(serviceId: string): Promise<Key[]> {
  const ids = await ovhGet<string[]>(`/okms/resource/${serviceId}/serviceKey`);
  const keys = await Promise.all(
    ids.map((id) => ovhGet<Key>(`/okms/resource/${serviceId}/serviceKey/${id}`))
  );
  return keys;
}

/** Récupère les détails d'une clé. */
export async function getKey(serviceId: string, keyId: string): Promise<Key> {
  return ovhGet<Key>(`/okms/resource/${serviceId}/serviceKey/${keyId}`);
}

/** Crée une nouvelle clé. */
export async function createKey(serviceId: string, data: { name: string; type: string; algorithm: string; size: number }): Promise<Key> {
  return ovhPost<Key>(`/okms/resource/${serviceId}/serviceKey`, data);
}

/** Désactive une clé. */
export async function deactivateKey(serviceId: string, keyId: string): Promise<void> {
  return ovhPut(`/okms/resource/${serviceId}/serviceKey/${keyId}`, { state: "deactivated" });
}

/** Active une clé. */
export async function activateKey(serviceId: string, keyId: string): Promise<void> {
  return ovhPut(`/okms/resource/${serviceId}/serviceKey/${keyId}`, { state: "active" });
}

// ============================================================
// CREDENTIALS
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
export async function createCredential(serviceId: string, data: { name: string; description?: string; validity: number }): Promise<Credential> {
  return ovhPost<Credential>(`/okms/resource/${serviceId}/credential`, data);
}

/** Révoque un credential. */
export async function revokeCredential(serviceId: string, credentialId: string): Promise<void> {
  return ovhDelete(`/okms/resource/${serviceId}/credential/${credentialId}`);
}
