// ============================================================
// KEYS SERVICE - Service API isolé pour l'onglet Keys
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { Key } from "../../okms.types";

// ============================================================
// API FUNCTIONS
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
export async function createKey(
  serviceId: string,
  data: { name: string; type: string; algorithm: string; size: number }
): Promise<Key> {
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
