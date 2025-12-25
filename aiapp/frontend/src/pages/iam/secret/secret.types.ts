// ============================================================
// SECRET TYPES - Types partagés pour le module Secret Manager
// ============================================================

/** Informations générales d'un Secret Manager */
export interface SecretManager {
  id: string;
  name: string;
  region: string;
  createdAt: string;
}

/** Secret stocké */
export interface Secret {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  versionCount: number;
}

/** Version d'un secret */
export interface SecretVersion {
  id: string;
  secretId: string;
  version: number;
  state: "enabled" | "disabled" | "destroyed";
  createdAt: string;
}

/** Règle d'accès à un secret */
export interface AccessRule {
  id: string;
  secretId: string;
  identityUrn: string;
  permission: "read" | "write" | "admin";
  createdAt: string;
}
