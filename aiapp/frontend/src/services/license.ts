// ============================================================
// LICENSE SERVICE - API Licences OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

// ============================================================
// TYPES
// ============================================================

export interface LicenseCount { type: string; count: number; icon: string; }
export interface WindowsLicense { id: string; ip: string; version: string; sqlVersion?: string; status: string; createdAt: string; }
export interface CpanelLicense { id: string; ip: string; version: string; status: string; createdAt: string; }
export interface PleskLicense { id: string; ip: string; version: string; domainNumber: number; status: string; createdAt: string; }
export interface SqlServerLicense { id: string; ip: string; version: string; licenseId: string; status: string; createdAt: string; }
export interface VirtuozzoLicense { id: string; ip: string; version: string; containerNumber: number; status: string; createdAt: string; }
export interface DirectAdminLicense { id: string; ip: string; version: string; os: string; status: string; createdAt: string; }
export interface CloudLinuxLicense { id: string; ip: string; version: string; status: string; createdAt: string; }
export interface Task { id: number; action: string; status: "done" | "doing" | "todo" | "error" | "cancelled"; startDate?: string; doneDate?: string; }

// ============================================================
// DASHBOARD
// ============================================================

export async function getLicenseCounts(): Promise<LicenseCount[]> {
  const [windows, cpanel, plesk, sqlserver, virtuozzo, directadmin, cloudlinux] = await Promise.all([
    ovhGet<string[]>("/license/windows").catch(() => []),
    ovhGet<string[]>("/license/cpanel").catch(() => []),
    ovhGet<string[]>("/license/plesk").catch(() => []),
    ovhGet<string[]>("/license/sqlserver").catch(() => []),
    ovhGet<string[]>("/license/virtuozzo").catch(() => []),
    ovhGet<string[]>("/license/directadmin").catch(() => []),
    ovhGet<string[]>("/license/cloudlinux").catch(() => []),
  ]);
  return [
    { type: "windows", count: windows.length, icon: "🪟" },
    { type: "cpanel", count: cpanel.length, icon: "🎛️" },
    { type: "plesk", count: plesk.length, icon: "🔧" },
    { type: "sqlserver", count: sqlserver.length, icon: "🗄️" },
    { type: "virtuozzo", count: virtuozzo.length, icon: "📦" },
    { type: "directadmin", count: directadmin.length, icon: "⚙️" },
    { type: "cloudlinux", count: cloudlinux.length, icon: "☁️" },
  ];
}

// ============================================================
// WINDOWS
// ============================================================

export async function getWindowsLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/windows"); }
export async function getWindowsLicense(licenseId: string): Promise<WindowsLicense> { return ovhGet<WindowsLicense>(`/license/windows/${licenseId}`); }

// ============================================================
// CPANEL
// ============================================================

export async function getCpanelLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/cpanel"); }
export async function getCpanelLicense(licenseId: string): Promise<CpanelLicense> { return ovhGet<CpanelLicense>(`/license/cpanel/${licenseId}`); }

// ============================================================
// PLESK
// ============================================================

export async function getPleskLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/plesk"); }
export async function getPleskLicense(licenseId: string): Promise<PleskLicense> { return ovhGet<PleskLicense>(`/license/plesk/${licenseId}`); }

// ============================================================
// SQLSERVER
// ============================================================

export async function getSqlServerLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/sqlserver"); }
export async function getSqlServerLicense(licenseId: string): Promise<SqlServerLicense> { return ovhGet<SqlServerLicense>(`/license/sqlserver/${licenseId}`); }

// ============================================================
// VIRTUOZZO
// ============================================================

export async function getVirtuozzoLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/virtuozzo"); }
export async function getVirtuozzoLicense(licenseId: string): Promise<VirtuozzoLicense> { return ovhGet<VirtuozzoLicense>(`/license/virtuozzo/${licenseId}`); }

// ============================================================
// DIRECTADMIN
// ============================================================

export async function getDirectAdminLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/directadmin"); }
export async function getDirectAdminLicense(licenseId: string): Promise<DirectAdminLicense> { return ovhGet<DirectAdminLicense>(`/license/directadmin/${licenseId}`); }

// ============================================================
// CLOUDLINUX
// ============================================================

export async function getCloudLinuxLicenses(): Promise<string[]> { return ovhGet<string[]>("/license/cloudlinux"); }
export async function getCloudLinuxLicense(licenseId: string): Promise<CloudLinuxLicense> { return ovhGet<CloudLinuxLicense>(`/license/cloudlinux/${licenseId}`); }

// ============================================================
// TASKS (générique)
// ============================================================

export async function getTasks(licenseType: string, licenseId: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/license/${licenseType}/${licenseId}/tasks`);
  const tasks = await Promise.all(ids.map((id) => ovhGet<Task>(`/license/${licenseType}/${licenseId}/tasks/${id}`)));
  return tasks.sort((a, b) => { const da = a.startDate ? new Date(a.startDate).getTime() : 0; const db = b.startDate ? new Date(b.startDate).getTime() : 0; return db - da; });
}
