// ============================================================
// RUNTIMES TAB SERVICE - API calls for RuntimesTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { Runtime } from "../../hosting.types";

const BASE = "/hosting/web";

export const runtimesService = {
  // --- Runtimes ---
  listRuntimes: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/runtime`),

  getRuntime: (sn: string, id: number) => 
    ovhGet<Runtime>(`${BASE}/${sn}/runtime/${id}`),

  createRuntime: (sn: string, data: {
    name?: string;
    type?: string;
    publicDir?: string;
    appEnv?: string;
    appBootstrap?: string;
  }) => 
    ovhPost<void>(`${BASE}/${sn}/runtime`, data),

  updateRuntime: (sn: string, id: number, data: Partial<Runtime>) => 
    ovhPut<void>(`${BASE}/${sn}/runtime/${id}`, data),

  deleteRuntime: (sn: string, id: number) => 
    ovhDelete<void>(`${BASE}/${sn}/runtime/${id}`),

  setDefaultRuntime: (sn: string, id: number) => 
    ovhPut<void>(`${BASE}/${sn}/runtime/${id}`, { isDefault: true }),

  // --- Available Runtime Types ---
  getAvailableRuntimeTypes: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/runtimeAvailableTypes`).catch(() => ["phpfpm", "nodejs", "python", "ruby"]),

  // ============ METHODS FROM OLD_MANAGER ============

  // Get runtime attached domains (from old_manager getAttachedDomains)
  getAttachedDomains: (sn: string, runtimeId: number) =>
    ovhGet<string[]>(`${BASE}/${sn}/runtime/${runtimeId}/attachedDomains`),

  // Get default runtime (from old_manager getDefault)
  getDefaultRuntime: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/runtime`);
    if (ids.length === 0) return null;

    const runtimes = await Promise.all(
      ids.map((id: number) => ovhGet<Runtime>(`${BASE}/${sn}/runtime/${id}`))
    );

    return runtimes.find((runtime) => runtime.isDefault) || null;
  },

  // Get all runtimes with details
  getAllRuntimes: async (sn: string) => {
    const ids = await ovhGet<number[]>(`${BASE}/${sn}/runtime`);
    if (ids.length === 0) return [];

    return Promise.all(
      ids.map((id: number) => ovhGet<Runtime>(`${BASE}/${sn}/runtime/${id}`))
    );
  },
};

export default runtimesService;
