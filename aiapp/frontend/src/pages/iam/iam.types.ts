// ============================================================
// IAM TYPES - Types partagés pour tous les tabs IAM Core
// ============================================================

import type { OvhCredentials } from "../../types/auth.types";

export type { OvhCredentials };

export interface IamUser {
  login: string;
  email: string;
  status: "OK" | "DISABLED" | "PASSWORD_CHANGE_REQUIRED";
  creation: string;
  lastUpdate?: string;
  group?: string;
  description?: string;
  urn?: string;
}

export interface IamGroup {
  name: string;
  description?: string;
  role?: string;
  creation?: string;
  lastUpdate?: string;
  urn?: string;
}

export interface IamServiceAccount {
  clientId: string;
  name?: string;
  description?: string;
  identity: string;
  flow?: string;
}

export interface IamPolicy {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  readOnly: boolean;
  identities?: string[];
  resources?: Array<{ urn: string }>;
  permissions?: { allow?: Array<{ action: string }>; except?: Array<{ action: string }> };
}

export interface IamResourceGroup {
  id: string;
  name: string;
  resources?: string[];
  createdAt: string;
  updatedAt?: string;
  owner: string;
  readOnly: boolean;
}

export interface IamLog {
  createdAt: string;
  action: string;
  identityUrn: string;
  resourceUrn: string;
  allowed: boolean;
  policyId?: string;
}
