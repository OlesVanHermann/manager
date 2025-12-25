// ============================================================
// SECURITY TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";

// ============ TYPES ============

export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  digitMandatory: boolean;
  letterMandatory: boolean;
  specialMandatory: boolean;
  deniedRawValues?: string[];
}

export interface TwoFactorStatus {
  sms?: { status: "enabled" | "disabled"; phone?: string };
  totp?: { status: "enabled" | "disabled" };
  u2f?: { status: "enabled" | "disabled"; devices?: string[] };
  backupCodes?: { status: "enabled" | "disabled"; remaining?: number };
}

export interface IpRestriction {
  id: number;
  ip: string;
  rule: "accept" | "deny";
  warning: boolean;
}

export interface SshKey {
  keyName: string;
  key: string;
  default: boolean;
}

export interface ActiveSession {
  sessionId: string;
  creationDate: string;
  lastActivity: string;
  ipAddress: string;
  userAgent?: string;
  current: boolean;
}

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ============ PASSWORD API ============

export async function getPasswordPolicy(): Promise<PasswordPolicy> {
  try {
    return await ovhGet<PasswordPolicy>("/me/passwordPolicy");
  } catch {
    return { minLength: 8, maxLength: 30, digitMandatory: true, letterMandatory: true, specialMandatory: false };
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await ovhPost("/me/changePassword", { currentPassword, newPassword });
}

// ============ TWO FACTOR API ============

export async function getTwoFactorStatus(): Promise<TwoFactorStatus> {
  try {
    const [sms, totp, u2f, backupCodes] = await Promise.all([
      ovhGet<{ status: string; phone?: string }>("/me/accessRestriction/sms").catch(() => null),
      ovhGet<{ status: string }>("/me/accessRestriction/totp").catch(() => null),
      ovhGet<{ status: string }>("/me/accessRestriction/u2f").catch(() => null),
      ovhGet<{ status: string; remaining?: number }>("/me/accessRestriction/backupCode").catch(() => null),
    ]);
    return {
      sms: sms ? { status: sms.status as "enabled" | "disabled", phone: sms.phone } : undefined,
      totp: totp ? { status: totp.status as "enabled" | "disabled" } : undefined,
      u2f: u2f ? { status: u2f.status as "enabled" | "disabled" } : undefined,
      backupCodes: backupCodes ? { status: backupCodes.status as "enabled" | "disabled", remaining: backupCodes.remaining } : undefined,
    };
  } catch {
    return {};
  }
}

// ============ IP RESTRICTIONS API ============

export async function getIpRestrictions(): Promise<IpRestriction[]> {
  try {
    const ids = await ovhGet<number[]>("/me/accessRestriction/ip");
    const restrictions = await Promise.all(
      ids.map((id) => ovhGet<IpRestriction>(`/me/accessRestriction/ip/${id}`).catch(() => null))
    );
    return restrictions.filter((r): r is IpRestriction => r !== null);
  } catch {
    return [];
  }
}

export async function addIpRestriction(ip: string, rule: "accept" | "deny", warning: boolean): Promise<IpRestriction> {
  return ovhPost<IpRestriction>("/me/accessRestriction/ip", { ip, rule, warning });
}

export async function deleteIpRestriction(id: number): Promise<void> {
  await ovhDelete(`/me/accessRestriction/ip/${id}`);
}

// ============ SSH KEYS API ============

export async function getSshKeys(): Promise<SshKey[]> {
  try {
    const keyNames = await ovhGet<string[]>("/me/sshKey");
    const keys = await Promise.all(
      keyNames.map((keyName) => ovhGet<SshKey>(`/me/sshKey/${encodeURIComponent(keyName)}`).catch(() => null))
    );
    return keys.filter((k): k is SshKey => k !== null);
  } catch {
    return [];
  }
}

export async function addSshKey(keyName: string, key: string): Promise<SshKey> {
  return ovhPost<SshKey>("/me/sshKey", { keyName, key });
}

export async function deleteSshKey(keyName: string): Promise<void> {
  await ovhDelete(`/me/sshKey/${encodeURIComponent(keyName)}`);
}

// ============ SESSIONS API ============

export async function getActiveSessions(): Promise<ActiveSession[]> {
  try {
    return await ovhGet<ActiveSession[]>("/me/api/session");
  } catch {
    return [];
  }
}

export async function revokeSession(sessionId: string): Promise<void> {
  await ovhDelete(`/me/api/session/${encodeURIComponent(sessionId)}`);
}

export async function revokeAllSessions(): Promise<void> {
  const sessions = await getActiveSessions();
  await Promise.all(
    sessions.filter((s) => !s.current).map((s) => revokeSession(s.sessionId).catch(() => null))
  );
}

// ============ SMS 2FA API ============

export interface SmsRestriction {
  id: number;
  phone: string;
  status: "enabled" | "disabled" | "needCodeValidation" | "needPhoneValidation";
  description?: string;
  creationDate: string;
}

export async function getSmsIds(): Promise<number[]> {
  try { return await ovhGet<number[]>("/me/accessRestriction/sms"); } catch { return []; }
}

export async function getSms(id: number): Promise<SmsRestriction> {
  return ovhGet<SmsRestriction>(`/me/accessRestriction/sms/${id}`);
}

export async function addSms(phone: string): Promise<SmsRestriction> {
  return ovhPost<SmsRestriction>("/me/accessRestriction/sms", { phone });
}

export async function deleteSms(id: number): Promise<void> {
  await ovhDelete(`/me/accessRestriction/sms/${id}`);
}

export async function validateSms(id: number, code: string): Promise<void> {
  await ovhPost(`/me/accessRestriction/sms/${id}/validate`, { code });
}

export async function sendSmsCode(id: number): Promise<void> {
  await ovhPost(`/me/accessRestriction/sms/${id}/sendCode`, {});
}

// ============ TOTP 2FA API ============

export interface TotpRestriction {
  id: number;
  status: "enabled" | "disabled" | "needCodeValidation";
  description?: string;
  creationDate: string;
}

export interface TotpSecret {
  id: number;
  secret: string;
  qrCode?: string;
}

export async function getTotpIds(): Promise<number[]> {
  try { return await ovhGet<number[]>("/me/accessRestriction/totp"); } catch { return []; }
}

export async function getTotp(id: number): Promise<TotpRestriction> {
  return ovhGet<TotpRestriction>(`/me/accessRestriction/totp/${id}`);
}

export async function addTotp(): Promise<TotpSecret> {
  return ovhPost<TotpSecret>("/me/accessRestriction/totp", {});
}

export async function deleteTotp(id: number): Promise<void> {
  await ovhDelete(`/me/accessRestriction/totp/${id}`);
}

export async function validateTotp(id: number, code: string): Promise<void> {
  await ovhPost(`/me/accessRestriction/totp/${id}/validate`, { code });
}

// ============ U2F 2FA API ============

export interface U2fRestriction {
  id: number;
  status: "enabled" | "disabled" | "needCodeValidation";
  description?: string;
  creationDate: string;
}

export interface U2fChallenge {
  id: number;
  challenge: string;
  applicationId?: string;
}

export async function getU2fIds(): Promise<number[]> {
  try { return await ovhGet<number[]>("/me/accessRestriction/u2f"); } catch { return []; }
}

export async function getU2f(id: number): Promise<U2fRestriction> {
  return ovhGet<U2fRestriction>(`/me/accessRestriction/u2f/${id}`);
}

export async function addU2f(): Promise<U2fChallenge> {
  return ovhPost<U2fChallenge>("/me/accessRestriction/u2f", {});
}

export async function deleteU2f(id: number): Promise<void> {
  await ovhDelete(`/me/accessRestriction/u2f/${id}`);
}

// ============ BACKUP CODES API ============

export interface BackupCodeGeneration {
  codes: string[];
}

export async function generateBackupCodes(): Promise<BackupCodeGeneration> {
  return ovhPost<BackupCodeGeneration>("/me/accessRestriction/backupCode", {});
}

export async function validateBackupCodes(code: string): Promise<void> {
  await ovhPost("/me/accessRestriction/backupCode/validate", { code });
}

export async function disableBackupCodes(code: string): Promise<void> {
  await ovhPost("/me/accessRestriction/backupCode/disable", { code });
}

// ============ IP DEFAULT RULE API ============

export interface IpDefaultRule {
  rule: "accept" | "deny";
  warning: boolean;
}

export async function getIpDefaultRule(): Promise<IpDefaultRule> {
  try {
    return await ovhGet<IpDefaultRule>("/me/accessRestriction/ipDefaultRule");
  } catch {
    return { rule: "accept", warning: false };
  }
}
