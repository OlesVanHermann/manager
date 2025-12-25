// ============================================================
// ENVVARS TAB SERVICE - API calls for EnvvarsTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../../services/api";
import type { EnvVar } from "../../hosting.types";

const BASE = "/hosting/web";

export const envvarsService = {
  // --- Environment Variables ---
  listEnvVars: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/envVar`),

  getEnvVar: (sn: string, key: string) => 
    ovhGet<EnvVar>(`${BASE}/${sn}/envVar/${key}`),

  createEnvVar: (sn: string, key: string, value: string, type?: string) => 
    ovhPost<void>(`${BASE}/${sn}/envVar`, { key, value, type }),

  updateEnvVar: (sn: string, key: string, value: string) => 
    ovhPut<void>(`${BASE}/${sn}/envVar/${key}`, { value }),

  deleteEnvVar: (sn: string, key: string) => 
    ovhDelete<void>(`${BASE}/${sn}/envVar/${key}`),
};

export default envvarsService;
