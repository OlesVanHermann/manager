// ============================================================
// MODULES TAB SERVICE - API calls for ModulesTab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { Module } from "../../hosting.types";

const BASE = "/hosting/web";

export const modulesService = {
  // --- Modules ---
  listModules: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/module`),

  getModule: (sn: string, id: number) => 
    ovhGet<Module>(`${BASE}/${sn}/module/${id}`),

  installModule: (sn: string, data: {
    moduleId: number;
    domain: string;
    path?: string;
    adminName?: string;
    adminPassword?: string;
    language?: string;
  }) => 
    ovhPost<void>(`${BASE}/${sn}/module`, data),

  deleteModule: (sn: string, id: number) => 
    ovhDelete<void>(`${BASE}/${sn}/module/${id}`),

  changeModulePassword: (sn: string, id: number, password: string) => 
    ovhPost<void>(`${BASE}/${sn}/module/${id}/changePassword`, { password }),

  // --- Available Modules ---
  getAvailableModules: () => 
    ovhGet<any[]>("/hosting/web/moduleList").catch(() => []),

  getModuleInfo: (moduleId: number) => 
    ovhGet<any>(`/hosting/web/moduleList/${moduleId}`).catch(() => null),
};

export default modulesService;
