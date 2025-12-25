// ============================================================
// SECRET TYPES - Types partagés pour tous les tabs Secret
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
