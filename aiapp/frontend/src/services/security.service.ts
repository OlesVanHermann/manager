import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

// ============ TYPES ============

export interface SmsRestriction {
  id: number;
  phoneNumber: string;
  status: "enabled" | "disabled" | "needCodeValidation" | "needEmailValidation";
  description?: string;
  lastUsedDate?: string;
  creationDate: string;
}

export interface TotpRestriction {
  id: number;
  status: "enabled" | "disabled" | "needCodeValidation";
  description?: string;
  lastUsedDate?: string;
  creationDate: string;
}

export interface U2fRestriction {
  id: number;
  status: "enabled" | "disabled" | "needCodeValidation";
  description?: string;
  lastUsedDate?: string;
  creationDate: string;
}

export interface BackupCode {
  remaining: number;
  creationDate: string;
}

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

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============ SMS 2FA ============

export async function getSmsIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/me/accessRestriction/sms");
}

export async function getSms(credentials: OvhCredentials, id: number): Promise<SmsRestriction> {
  return ovhRequest<SmsRestriction>(credentials, "GET", `/me/accessRestriction/sms/${id}`);
}

export async function getAllSms(credentials: OvhCredentials): Promise<SmsRestriction[]> {
  const ids = await getSmsIds(credentials);
  const results = await Promise.all(
    ids.map(id => getSms(credentials, id).catch(() => null))
  );
  return results.filter((r): r is SmsRestriction => r !== null);
}

// ============ TOTP 2FA ============

export async function getTotpIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/me/accessRestriction/totp");
}

export async function getTotp(credentials: OvhCredentials, id: number): Promise<TotpRestriction> {
  return ovhRequest<TotpRestriction>(credentials, "GET", `/me/accessRestriction/totp/${id}`);
}

export async function getAllTotp(credentials: OvhCredentials): Promise<TotpRestriction[]> {
  const ids = await getTotpIds(credentials);
  const results = await Promise.all(
    ids.map(id => getTotp(credentials, id).catch(() => null))
  );
  return results.filter((r): r is TotpRestriction => r !== null);
}

// ============ U2F (Security Key) ============

export async function getU2fIds(credentials: OvhCredentials): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/me/accessRestriction/u2f");
}

export async function getU2f(credentials: OvhCredentials, id: number): Promise<U2fRestriction> {
  return ovhRequest<U2fRestriction>(credentials, "GET", `/me/accessRestriction/u2f/${id}`);
}

export async function getAllU2f(credentials: OvhCredentials): Promise<U2fRestriction[]> {
  const ids = await getU2fIds(credentials);
  const results = await Promise.all(
    ids.map(id => getU2f(credentials, id).catch(() => null))
  );
  return results.filter((r): r is U2fRestriction => r !== null);
}

// ============ BACKUP CODES ============

export async function getBackupCode(credentials: OvhCredentials): Promise<BackupCode | null> {
  try {
    return await ovhRequest<BackupCode>(credentials, "GET", "/me/accessRestriction/backupCode");
  } catch {
    return null;
  }
}

// ============ ALL 2FA STATUS ============

export interface TwoFactorStatus {
  sms: SmsRestriction[];
  totp: TotpRestriction[];
  u2f: U2fRestriction[];
  backupCode: BackupCode | null;
  isEnabled: boolean;
}

export async function getTwoFactorStatus(credentials: OvhCredentials): Promise<TwoFactorStatus> {
  const [sms, totp, u2f, backupCode] = await Promise.all([
    getAllSms(credentials),
    getAllTotp(credentials),
    getAllU2f(credentials),
    getBackupCode(credentials),
  ]);

  const enabledSms = sms.filter(s => s.status === "enabled");
  const enabledTotp = totp.filter(t => t.status === "enabled");
  const enabledU2f = u2f.filter(u => u.status === "enabled");

  return {
    sms,
    totp,
    u2f,
    backupCode,
    isEnabled: enabledSms.length > 0 || enabledTotp.length > 0 || enabledU2f.length > 0,
  };
}
