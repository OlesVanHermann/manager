// ============================================================
// DATABASE TAB SERVICE - API calls for DatabaseTab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../../services/api";
import type { Database } from "../../hosting.types";

const BASE = "/hosting/web";

export const databaseService = {
  // --- Databases ---
  listDatabases: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/database`),

  getDatabase: (sn: string, name: string) => 
    ovhGet<Database>(`${BASE}/${sn}/database/${name}`),

  createDatabase: (sn: string, data: { capabilitie: string; type: string; user?: string; password?: string }) => 
    ovhPost<void>(`${BASE}/${sn}/database`, data),

  deleteDatabase: (sn: string, name: string) => 
    ovhDelete<void>(`${BASE}/${sn}/database/${name}`),

  // --- Dumps ---
  listDatabaseDumps: (sn: string, name: string) => 
    ovhGet<any[]>(`${BASE}/${sn}/database/${name}/dump`),

  dumpDatabase: (sn: string, name: string, date = "now", sendEmail?: boolean) => 
    ovhPost<void>(`${BASE}/${sn}/database/${name}/dump`, { date, sendEmail }),

  restoreDatabase: (sn: string, name: string, dumpId: string) => 
    ovhPost<void>(`${BASE}/${sn}/database/${name}/restore`, { dumpId }),

  // --- Import ---
  importDatabase: (sn: string, name: string, url: string, sendEmail?: boolean) => 
    ovhPost<void>(`${BASE}/${sn}/database/${name}/import`, { documentUrl: url, sendEmail }),

  // --- Copy ---
  copyDatabase: (sn: string, src: string, tgt: string, flush: boolean) => 
    ovhPost<void>(`${BASE}/${sn}/database/${src}/copy`, { 
      flushDestination: flush, 
      destinationDatabaseName: tgt 
    }),

  // --- Password ---
  changeDatabasePassword: (sn: string, name: string, password: string) => 
    ovhPost<void>(`${BASE}/${sn}/database/${name}/changePassword`, { password }),

  // --- Statistics ---
  getDatabaseStatistics: (sn: string, name: string) => 
    ovhGet<any>(`${BASE}/${sn}/database/${name}/statistics`).catch(() => null),
};

export default databaseService;
