// ============================================================
// IAM SERVICE - Identity & Access Management OVHcloud
// ============================================================

import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

// ============ TYPES ============

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

// ============ API REQUEST ============

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

async function ovhRequestOptional<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T | null> {
  try {
    return await ovhRequest<T>(credentials, method, path);
  } catch {
    return null;
  }
}

// ============ USERS / IDENTITIES ============

export async function getUserLogins(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/me/identity/user");
  return result || [];
}

export async function getUser(credentials: OvhCredentials, login: string): Promise<IamUser | null> {
  return ovhRequestOptional<IamUser>(credentials, "GET", `/me/identity/user/${encodeURIComponent(login)}`);
}

export async function getUsers(credentials: OvhCredentials): Promise<IamUser[]> {
  const logins = await getUserLogins(credentials);
  const users = await Promise.all(logins.map((login) => getUser(credentials, login)));
  return users.filter((u): u is IamUser => u !== null);
}

// ============ GROUPS ============

export async function getGroupNames(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/me/identity/group");
  return result || [];
}

export async function getGroup(credentials: OvhCredentials, name: string): Promise<IamGroup | null> {
  return ovhRequestOptional<IamGroup>(credentials, "GET", `/me/identity/group/${encodeURIComponent(name)}`);
}

export async function getGroups(credentials: OvhCredentials): Promise<IamGroup[]> {
  const names = await getGroupNames(credentials);
  const groups = await Promise.all(names.map((name) => getGroup(credentials, name)));
  return groups.filter((g): g is IamGroup => g !== null);
}

// ============ SERVICE ACCOUNTS (OAuth2 Clients) ============

export async function getServiceAccountIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/me/api/oauth2/client");
  return result || [];
}

export async function getServiceAccount(credentials: OvhCredentials, clientId: string): Promise<IamServiceAccount | null> {
  return ovhRequestOptional<IamServiceAccount>(credentials, "GET", `/me/api/oauth2/client/${encodeURIComponent(clientId)}`);
}

export async function getServiceAccounts(credentials: OvhCredentials): Promise<IamServiceAccount[]> {
  const ids = await getServiceAccountIds(credentials);
  const accounts = await Promise.all(ids.map((id) => getServiceAccount(credentials, id)));
  return accounts.filter((a): a is IamServiceAccount => a !== null);
}

// ============ POLICIES ============

export async function getPolicyIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/iam/policy");
  return result || [];
}

export async function getPolicy(credentials: OvhCredentials, policyId: string): Promise<IamPolicy | null> {
  return ovhRequestOptional<IamPolicy>(credentials, "GET", `/iam/policy/${encodeURIComponent(policyId)}`);
}

export async function getPolicies(credentials: OvhCredentials): Promise<IamPolicy[]> {
  const ids = await getPolicyIds(credentials);
  const policies = await Promise.all(ids.map((id) => getPolicy(credentials, id)));
  return policies.filter((p): p is IamPolicy => p !== null);
}

export async function updatePolicyIdentities(
  credentials: OvhCredentials,
  policyId: string,
  identities: string[]
): Promise<IamPolicy> {
  return ovhRequest<IamPolicy>(credentials, "PUT", `/iam/policy/${encodeURIComponent(policyId)}`, { identities });
}

// ============ RESOURCE GROUPS ============

export async function getResourceGroupIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/iam/resourceGroup");
  return result || [];
}

export async function getResourceGroup(credentials: OvhCredentials, groupId: string): Promise<IamResourceGroup | null> {
  return ovhRequestOptional<IamResourceGroup>(credentials, "GET", `/iam/resourceGroup/${encodeURIComponent(groupId)}`);
}

export async function getResourceGroups(credentials: OvhCredentials): Promise<IamResourceGroup[]> {
  const ids = await getResourceGroupIds(credentials);
  const groups = await Promise.all(ids.map((id) => getResourceGroup(credentials, id)));
  return groups.filter((g): g is IamResourceGroup => g !== null);
}

// ============ LOGS ============

export async function getLogs(credentials: OvhCredentials): Promise<IamLog[]> {
  const result = await ovhRequestOptional<IamLog[]>(credentials, "GET", "/iam/logs");
  return result || [];
}
