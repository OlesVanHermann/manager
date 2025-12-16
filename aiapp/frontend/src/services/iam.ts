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
  path: string
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

  const response = await fetch(url, { method, headers });

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
  return ovhRequestOptional<IamUser>(credentials, "GET", `/me/identity/user/${login}`);
}

export async function getUsers(credentials: OvhCredentials): Promise<IamUser[]> {
  const logins = await getUserLogins(credentials);
  const users = await Promise.all(
    logins.map((login) => getUser(credentials, login))
  );
  return users.filter((u): u is IamUser => u !== null);
}

// ============ POLICIES ============

export async function getPolicyIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/iam/policy");
  return result || [];
}

export async function getPolicy(credentials: OvhCredentials, policyId: string): Promise<IamPolicy | null> {
  return ovhRequestOptional<IamPolicy>(credentials, "GET", `/iam/policy/${policyId}`);
}

export async function getPolicies(credentials: OvhCredentials): Promise<IamPolicy[]> {
  const ids = await getPolicyIds(credentials);
  const policies = await Promise.all(
    ids.map((id) => getPolicy(credentials, id))
  );
  return policies.filter((p): p is IamPolicy => p !== null);
}

// ============ RESOURCE GROUPS ============

export async function getResourceGroupIds(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/iam/resourceGroup");
  return result || [];
}

export async function getResourceGroup(credentials: OvhCredentials, groupId: string): Promise<IamResourceGroup | null> {
  return ovhRequestOptional<IamResourceGroup>(credentials, "GET", `/iam/resourceGroup/${groupId}`);
}

export async function getResourceGroups(credentials: OvhCredentials): Promise<IamResourceGroup[]> {
  const ids = await getResourceGroupIds(credentials);
  const groups = await Promise.all(
    ids.map((id) => getResourceGroup(credentials, id))
  );
  return groups.filter((g): g is IamResourceGroup => g !== null);
}

// ============ LOGS ============

export async function getLogs(credentials: OvhCredentials): Promise<IamLog[]> {
  const result = await ovhRequestOptional<IamLog[]>(credentials, "GET", "/iam/logs");
  return result || [];
}
