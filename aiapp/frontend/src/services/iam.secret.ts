// ============================================================
// IAM SECRET SERVICE - API Secret Manager OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface SecretManager {
  id: string;
  name: string;
  region: string;
  createdAt: string;
}

export interface Secret {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  versionsCount: number;
}

export interface SecretVersion {
  id: string;
  secretId: string;
  secretName: string;
  version: number;
  createdAt: string;
  status: "enabled" | "disabled" | "destroyed";
}

export interface AccessRule {
  id: string;
  identity: string;
  identityType: "user" | "service_account" | "group";
  permission: "read" | "write" | "admin";
  createdAt: string;
}

// ============================================================
// SECRET MANAGER
// ============================================================

/** Récupère la liste des Secret Managers. */
export async function getSecretManagers(): Promise<string[]> {
  return ovhGet<string[]>("/secretManager");
}

/** Récupère les détails d'un Secret Manager. */
export async function getSecretManager(serviceId: string): Promise<SecretManager> {
  return ovhGet<SecretManager>(`/secretManager/${serviceId}`);
}

// ============================================================
// SECRETS
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
export async function createSecret(serviceId: string, data: { name: string; description?: string }): Promise<Secret> {
  return ovhPost<Secret>(`/secretManager/${serviceId}/secret`, data);
}

/** Supprime un secret. */
export async function deleteSecret(serviceId: string, secretId: string): Promise<void> {
  return ovhDelete(`/secretManager/${serviceId}/secret/${secretId}`);
}

// ============================================================
// VERSIONS
// ============================================================

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

// ============================================================
// ACCESS RULES
// ============================================================

/** Récupère les règles d'accès d'un Secret Manager. */
export async function getAccessRules(serviceId: string): Promise<AccessRule[]> {
  return ovhGet<AccessRule[]>(`/secretManager/${serviceId}/access`);
}

/** Accorde un accès à un Secret Manager. */
export async function grantAccess(serviceId: string, data: { identity: string; permission: string }): Promise<AccessRule> {
  return ovhPost<AccessRule>(`/secretManager/${serviceId}/access`, data);
}

/** Révoque un accès à un Secret Manager. */
export async function revokeAccess(serviceId: string, ruleId: string): Promise<void> {
  return ovhDelete(`/secretManager/${serviceId}/access/${ruleId}`);
}
