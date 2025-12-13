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
  secret?: string;
}

export interface TotpSecret {
  id: number;
  qrcodeUrl: string;
  secret: string;
}

export interface U2fRestriction {
  id: number;
  status: "enabled" | "disabled" | "needCodeValidation";
  description?: string;
  lastUsedDate?: string;
  creationDate: string;
}

export interface U2fChallenge {
  id: number;
  applicationId: string;
  request: {
    challenge: string;
    version: string;
  };
}

export interface BackupCode {
  remaining: number;
  creationDate: string;
  status?: "enabled" | "disabled";
}

export interface BackupCodeGeneration {
  codes: string[];
}

export interface IpRestriction {
  id: number;
  ip: string;
  rule: "accept" | "deny";
  warning: boolean;
}

export interface IpDefaultRule {
  rule: "accept" | "deny";
  warning: boolean;
}

export interface TwoFactorStatus {
  sms: SmsRestriction[];
  totp: TotpRestriction[];
  u2f: U2fRestriction[];
  backupCode: BackupCode | null;
  isEnabled: boolean;
}

// ============ API REQUEST HELPER ============

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

export async function addSms(credentials: OvhCredentials, phone: string): Promise<SmsRestriction> {
  return ovhRequest<SmsRestriction>(credentials, "POST", "/me/accessRestriction/sms", { phone });
}

export async function updateSms(credentials: OvhCredentials, id: number, description: string): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", `/me/accessRestriction/sms/${id}`, { description });
}

export async function deleteSms(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "DELETE", `/me/accessRestriction/sms/${id}`);
}

export async function enableSms(credentials: OvhCredentials, id: number, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/sms/${id}/enable`, { code });
}

export async function disableSms(credentials: OvhCredentials, id: number, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/sms/${id}/disable`, { code });
}

export async function validateSms(credentials: OvhCredentials, id: number, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/sms/${id}/validate`, { code });
}

export async function sendSmsCode(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/sms/${id}/sendCode`);
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

export async function addTotp(credentials: OvhCredentials): Promise<TotpSecret> {
  return ovhRequest<TotpSecret>(credentials, "POST", "/me/accessRestriction/totp");
}

export async function updateTotp(credentials: OvhCredentials, id: number, description: string): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", `/me/accessRestriction/totp/${id}`, { description });
}

export async function deleteTotp(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "DELETE", `/me/accessRestriction/totp/${id}`);
}

export async function enableTotp(credentials: OvhCredentials, id: number, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/totp/${id}/enable`, { code });
}

export async function disableTotp(credentials: OvhCredentials, id: number, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/totp/${id}/disable`, { code });
}

export async function validateTotp(credentials: OvhCredentials, id: number, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/totp/${id}/validate`, { code });
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

export async function addU2f(credentials: OvhCredentials): Promise<U2fChallenge> {
  return ovhRequest<U2fChallenge>(credentials, "POST", "/me/accessRestriction/u2f");
}

export async function updateU2f(credentials: OvhCredentials, id: number, description: string): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", `/me/accessRestriction/u2f/${id}`, { description });
}

export async function deleteU2f(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "DELETE", `/me/accessRestriction/u2f/${id}`);
}

export async function enableU2f(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/u2f/${id}/enable`);
}

export async function disableU2f(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/u2f/${id}/disable`);
}

export async function validateU2f(
  credentials: OvhCredentials,
  id: number,
  attestationObject: string,
  clientDataJSON: string,
  rawId: string
): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/accessRestriction/u2f/${id}/validate`, {
    attestationObject,
    clientDataJSON,
    rawId,
  });
}

// ============ BACKUP CODES ============

export async function getBackupCode(credentials: OvhCredentials): Promise<BackupCode | null> {
  return ovhRequestOptional<BackupCode>(credentials, "GET", "/me/accessRestriction/backupCode");
}

export async function generateBackupCodes(credentials: OvhCredentials): Promise<BackupCodeGeneration> {
  return ovhRequest<BackupCodeGeneration>(credentials, "POST", "/me/accessRestriction/backupCode");
}

export async function deleteBackupCodes(credentials: OvhCredentials): Promise<void> {
  await ovhRequest<void>(credentials, "DELETE", "/me/accessRestriction/backupCode");
}

export async function enableBackupCodes(credentials: OvhCredentials, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", "/me/accessRestriction/backupCode/enable", { code });
}

export async function disableBackupCodes(credentials: OvhCredentials, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", "/me/accessRestriction/backupCode/disable", { code });
}

export async function validateBackupCodes(credentials: OvhCredentials, code: string): Promise<void> {
  await ovhRequest<void>(credentials, "POST", "/me/accessRestriction/backupCode/validate", { code });
}

// ============ IP RESTRICTIONS ============

export async function getIpRestrictions(credentials: OvhCredentials): Promise<IpRestriction[]> {
  const result = await ovhRequestOptional<IpRestriction[]>(credentials, "GET", "/me/accessRestriction/ip");
  return result || [];
}

export async function addIpRestriction(
  credentials: OvhCredentials,
  ip: string,
  rule: "accept" | "deny",
  warning: boolean
): Promise<IpRestriction> {
  return ovhRequest<IpRestriction>(credentials, "POST", "/me/accessRestriction/ip", { ip, rule, warning });
}

export async function updateIpRestriction(
  credentials: OvhCredentials,
  id: number,
  rule: "accept" | "deny",
  warning: boolean
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", `/me/accessRestriction/ip/${id}`, { rule, warning });
}

export async function deleteIpRestriction(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "DELETE", `/me/accessRestriction/ip/${id}`);
}

export async function getIpDefaultRule(credentials: OvhCredentials): Promise<IpDefaultRule> {
  const result = await ovhRequestOptional<IpDefaultRule>(credentials, "GET", "/me/accessRestriction/ipDefaultRule");
  return result || { rule: "accept", warning: false };
}

export async function updateIpDefaultRule(
  credentials: OvhCredentials,
  rule: "accept" | "deny",
  warning: boolean
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", "/me/accessRestriction/ipDefaultRule", { rule, warning });
}

// ============ ALL 2FA STATUS ============

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
