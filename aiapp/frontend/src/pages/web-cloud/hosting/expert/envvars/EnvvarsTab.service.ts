// ============================================================
// ENVVARS TAB SERVICE - API calls for EnvvarsTab
// (from old_manager hosting-envvars.service.js)
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete, ovhIceberg, type IcebergResult } from "../../../../../services/api";
import type { EnvVar } from "../../hosting.types";

const BASE = "/hosting/web";

export const envvarsService = {
  // --- Environment Variables ---
  listEnvVars: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/envVar`),

  getEnvVar: (sn: string, key: string) =>
    ovhGet<EnvVar>(`${BASE}/${sn}/envVar/${key}`),

  // Create with value.toString() like old_manager
  createEnvVar: (sn: string, key: string, value: string | number, type?: string) =>
    ovhPost<void>(`${BASE}/${sn}/envVar`, {
      key,
      value: String(value),
      ...(type && { type }),
    }),

  // Update with value.toString() like old_manager
  updateEnvVar: (sn: string, key: string, value: string | number) =>
    ovhPut<void>(`${BASE}/${sn}/envVar/${key}`, { value: String(value) }),

  deleteEnvVar: (sn: string, key: string) =>
    ovhDelete<void>(`${BASE}/${sn}/envVar/${key}`),

  // ============ ICEBERG PAGINATION (from old_manager) ============

  // List envvars with iceberg (old_manager uses CachedObjectList-Pages)
  listEnvVarsIceberg: (sn: string, page = 1, pageSize = 25): Promise<IcebergResult<EnvVar>> =>
    ovhIceberg<EnvVar>(`${BASE}/${sn}/envVar`, { page, pageSize }),

  // Get all envvars with details using iceberg (like old_manager list method)
  getAllEnvVarsDetails: async (sn: string) => {
    const result = await ovhIceberg<EnvVar>(`${BASE}/${sn}/envVar`, { page: 1, pageSize: 1000 });
    return result.data;
  },
};

export default envvarsService;
