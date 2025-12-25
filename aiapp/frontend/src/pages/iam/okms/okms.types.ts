// ============================================================
// OKMS TYPES - Types partagés pour tous les tabs OKMS
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
