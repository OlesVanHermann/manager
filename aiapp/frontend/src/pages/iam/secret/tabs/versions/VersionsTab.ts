// ============================================================
// VERSIONS SERVICE - Service API isolé pour l'onglet Versions
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { Secret, SecretVersion } from "../../secret.types";

// ============================================================
// API FUNCTIONS
// ============================================================

/** Récupère la liste des secrets (helper interne). */
async function getSecrets(serviceId: string): Promise<Secret[]> {
  const ids = await ovhGet<string[]>(`/secretManager/${serviceId}/secret`);
  const secrets = await Promise.all(
    ids.map((id) => ovhGet<Secret>(`/secretManager/${serviceId}/secret/${id}`))
  );
  return secrets;
}

/** Récupère toutes les versions de tous les secrets. */
export async function getVersions(serviceId: string): Promise<SecretVersion[]> {
  const secrets = await getSecrets(serviceId);
  const allVersions: SecretVersion[] = [];
  for (const secret of secrets) {
    const versionIds = await ovhGet<string[]>(`/secretManager/${serviceId}/secret/${secret.id}/version`);
    for (const versionId of versionIds) {
      const version = await ovhGet<SecretVersion>(`/secretManager/${serviceId}/secret/${secret.id}/version/${versionId}`);
      allVersions.push({ ...version, secretName: secret.name });
    }
  }
  return allVersions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Récupère les versions d'un secret spécifique. */
export async function getSecretVersions(serviceId: string, secretId: string): Promise<SecretVersion[]> {
  const versionIds = await ovhGet<string[]>(`/secretManager/${serviceId}/secret/${secretId}/version`);
  const versions = await Promise.all(
    versionIds.map((id) => ovhGet<SecretVersion>(`/secretManager/${serviceId}/secret/${secretId}/version/${id}`))
  );
  return versions.sort((a, b) => b.version - a.version);
}
