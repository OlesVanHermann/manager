// ============================================================
// MODULES TAB SERVICE - API calls for ModulesTab
// (from old_manager hosting-module.service.js)
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { Module } from "../../hosting.types";

const BASE = "/hosting/web";

export const modulesService = {
  // --- Installed Modules ---
  listModules: (sn: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/module`),

  getModule: (sn: string, id: number) =>
    ovhGet<Module>(`${BASE}/${sn}/module/${id}`),

  // Install module with all params from old_manager
  installModule: (sn: string, data: {
    moduleId: number;
    domain: string;
    path?: string;
    adminName?: string;
    adminPassword?: string;
    language?: string;
    dependencies?: Array<{ name: string; password?: string; port?: string; prefix?: string; user?: string }>;
  }) =>
    ovhPost<void>(`${BASE}/${sn}/module`, data),

  deleteModule: (sn: string, id: number) =>
    ovhDelete<void>(`${BASE}/${sn}/module/${id}`),

  // Change password - old_manager sends empty body
  changeModulePassword: (sn: string, id: number) =>
    ovhPost<void>(`${BASE}/${sn}/module/${id}/changePassword`, {}),

  // --- Available Modules (from old_manager getModulesList) ---
  // Get active modules list
  getAvailableModules: (active = true) =>
    ovhGet<number[]>("/hosting/web/moduleList", {
      params: { active },
    } as any).catch(() => []),

  // Get latest modules list (from old_manager getModulesLatestList)
  getLatestModules: () =>
    ovhGet<number[]>("/hosting/web/moduleList", {
      params: { active: true, latest: true },
    } as any).catch(() => []),

  // Get module info by ID (from old_manager getAvailableModule)
  getModuleInfo: (moduleId: number) =>
    ovhGet<{
      id: number;
      name: string;
      version: string;
      author: string;
      active: boolean;
      adminNameType: string;
      branch: string;
      keywords: string[];
      language: string[];
      languageRequirement: any;
      latest: boolean;
      size: { value: number; unit: string };
    }>(`/hosting/web/moduleList/${moduleId}`).catch(() => null),

  // --- Helper: Get all installed modules with details ---
  getAllModulesDetails: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/module`).catch(() => []);
    if (ids.length === 0) return [];
    return Promise.all(
      ids.map((id: number) => ovhGet<Module>(`${BASE}/${sn}/module/${id}`))
    );
  },

  // --- Helper: Get all available modules with details ---
  getAllAvailableModulesDetails: async (active = true, latest = false) => {
    const ids = await ovhGet<number[]>("/hosting/web/moduleList", {
      params: { active, ...(latest && { latest }) },
    } as any).catch(() => []);
    if (ids.length === 0) return [];
    return Promise.all(
      ids.map((id: number) => ovhGet<any>(`/hosting/web/moduleList/${id}`))
    );
  },

  // --- Databases for module installation (from old_manager getDatabases) ---
  getMysqlDatabases: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/database`, {
      params: { type: "mysql" },
    } as any).catch(() => []),

  getDatabase: (sn: string, name: string) =>
    ovhGet<any>(`${BASE}/${sn}/database/${name}`),

  // --- Database creation capabilities (from old_manager getDatabasesCapabilities) ---
  getDatabasesCapabilities: (sn: string) =>
    ovhGet<any[]>(`${BASE}/${sn}/databaseCreationCapabilities`).catch(() => []),

  // --- Attached domains for module installation (from old_manager getAttachedDomains) ---
  getAttachedDomains: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/attachedDomain`),

  getAttachedDomainPath: (sn: string, domain: string) =>
    ovhGet<{ path: string }>(`${BASE}/${sn}/attachedDomain/${domain}`),
};

export default modulesService;
