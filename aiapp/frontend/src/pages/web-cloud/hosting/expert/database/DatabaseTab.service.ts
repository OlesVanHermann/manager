// ============================================================
// DATABASE TAB SERVICE - API calls for DatabaseTab
// ============================================================

import { ovhGet, ovhPost, ovhDelete, ovh2apiGet, ovhIceberg, type IcebergResult } from "../../../../../services/api";
import type { Database } from "../../hosting.types";

const BASE = "/hosting/web";

// ============ 2API TYPES ============
export interface DatabaseList2API {
  list: Array<{
    name: string;
    user: string;
    server: string;
    type: string;
    version: string;
    state: string;
    quotaUsed: { value: number; unit: string };
    quotaSize: { value: number; unit: string };
  }>;
  count: number;
}

export interface DatabaseStatistics2API {
  statements: Array<{ timestamp: number; value: number }>;
  requests: Array<{ timestamp: number; value: number }>;
  size: Array<{ timestamp: number; value: number }>;
}

export const databaseService = {
  // --- Databases ---
  listDatabases: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/database`),

  getDatabase: (sn: string, name: string) => 
    ovhGet<Database>(`${BASE}/${sn}/database/${name}`),

  // Create database with all params from old_manager
  createDatabase: (sn: string, data: {
    capabilitie: string;
    type: string;
    user?: string;
    password?: string;
    quota?: { value: number; unit: string };
    version?: string;
  }) =>
    ovhPost<void>(`${BASE}/${sn}/database`, {
      capabilitie: data.capabilitie,
      type: data.type,
      ...(data.user && { user: data.user }),
      ...(data.password && { password: data.password }),
      ...(data.quota && { quota: data.quota }),
      ...(data.version && { version: data.version }),
    }),

  deleteDatabase: (sn: string, name: string) => 
    ovhDelete<void>(`${BASE}/${sn}/database/${name}`),

  // --- Dumps ---
  listDatabaseDumps: (sn: string, name: string) => 
    ovhGet<any[]>(`${BASE}/${sn}/database/${name}/dump`),

  // Dump with date format conversion (old_manager: date.toLowerCase().replace('_', '.'))
  dumpDatabase: (sn: string, name: string, date = "now", sendEmail?: boolean) => {
    // Convert date format: "NOW" -> "now", "DAILY_1" -> "daily.1"
    const formattedDate = date.toLowerCase().replace(/_/g, ".");
    return ovhPost<void>(`${BASE}/${sn}/database/${name}/dump`, {
      date: formattedDate,
      ...(sendEmail !== undefined && { sendEmail }),
    });
  },

  restoreDatabase: (sn: string, name: string, dumpId: string) => 
    ovhPost<void>(`${BASE}/${sn}/database/${name}/restore`, { dumpId }),

  // --- Import (with all params from old_manager) ---
  importDatabase: (sn: string, name: string, documentId: string, flushDatabase = false, sendEmail?: boolean) =>
    ovhPost<void>(`${BASE}/${sn}/database/${name}/import`, {
      documentId,
      flushDatabase,
      ...(sendEmail !== undefined && { sendEmail }),
    }),

  // --- Copy (internal between databases) ---
  copyDatabaseInternal: (sn: string, src: string, tgt: string, flush: boolean) =>
    ovhPost<void>(`${BASE}/${sn}/database/${src}/copy`, {
      flushDestination: flush,
      destinationDatabaseName: tgt,
    }),

  // --- Password ---
  changeDatabasePassword: (sn: string, name: string, password: string) => 
    ovhPost<void>(`${BASE}/${sn}/database/${name}/changePassword`, { password }),

  // --- Statistics ---
  getDatabaseStatistics: (sn: string, name: string) =>
    ovhGet<any>(`${BASE}/${sn}/database/${name}/statistics`).catch(() => null),

  // ============ 2API ENDPOINTS (from old_manager) ============

  // Liste BDD paginée - GET /sws/hosting/web/${sn}/databases
  getTabDatabases2API: (sn: string, count = 25, offset = 0, search?: string) =>
    ovh2apiGet<DatabaseList2API>(`/sws/hosting/web/${sn}/databases`, {
      count,
      offset,
      ...(search && { search }),
    }),

  // Stats BDD - GET /sws/hosting/web/${sn}/databases/${name}/statistics
  getDatabaseStatistics2API: (sn: string, name: string, period = "daily", type = "all", aggregation = "sum") =>
    ovh2apiGet<DatabaseStatistics2API>(`/sws/hosting/web/${sn}/databases/${name}/statistics`, {
      period,
      type,
      aggregation,
    }),

  // ============ APIv6 MANQUANTS (from old_manager) ============

  // Available types
  getDatabaseAvailableType: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/databaseAvailableType`),

  // Available versions
  getDatabaseAvailableVersion: (sn: string, type: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/databaseAvailableVersion`, { params: { type } } as any),

  // Creation capabilities
  getDatabaseCreationCapabilities: (sn: string) =>
    ovhGet<Array<{ type: string; available: number; quota: { value: number; unit: string } }>>(`${BASE}/${sn}/databaseCreationCapabilities`),

  // Private database creation capabilities
  getPrivateDatabaseCreationCapabilities: (sn: string) =>
    ovhGet<any[]>(`${BASE}/${sn}/privateDatabaseCreationCapabilities`),

  // Check quota request
  requestDatabaseQuotaCheck: (sn: string, name: string) =>
    ovhPost<void>(`${BASE}/${sn}/database/${name}/request`, { action: "CHECK_QUOTA" }),

  // Private databases
  getPrivateDatabaseIds: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/privateDatabases`),

  getPrivateDatabases: (sn: string) =>
    ovhGet<any[]>(`/hosting/privateDatabase/${sn}/database`),

  // Extra SQL Perso
  getExtraSqlPerso: (sn: string) =>
    ovhGet<any[]>(`${BASE}/${sn}/extraSqlPerso`).catch(() => []),

  // Get dump details
  getDump: (sn: string, dbName: string, dumpId: number) =>
    ovhGet<any>(`${BASE}/${sn}/database/${dbName}/dump/${dumpId}`),

  // Delete dump
  deleteDump: (sn: string, dbName: string, dumpId: number) =>
    ovhDelete<void>(`${BASE}/${sn}/database/${dbName}/dump/${dumpId}`),

  // Restore from dump ID
  restoreFromDump: (sn: string, dbName: string, dumpId: number) =>
    ovhPost<void>(`${BASE}/${sn}/database/${dbName}/dump/${dumpId}/restore`, {}),

  // Copy database
  copyDatabase: (sn: string, dbName: string, isPrivate = false) =>
    ovhPost<void>(`/hosting/${isPrivate ? "privateDatabase" : "web"}/${sn}/database/${dbName}/copy`, {}),

  // Copy restore database
  copyRestoreDatabase: (sn: string, dbName: string, copyId: number, isPrivate = false) =>
    ovhPost<void>(`/hosting/${isPrivate ? "privateDatabase" : "web"}/${sn}/database/${dbName}/copyRestore`, {
      copyId,
      flushDatabase: true,
    }),

  // ============ ICEBERG PAGINATION (from old_manager) ============

  // List dumps with iceberg pagination
  listDumpsIceberg: (sn: string, dbName: string, page = 1, pageSize = 25): Promise<IcebergResult<any>> =>
    ovhIceberg<any>(`${BASE}/${sn}/database/${dbName}/dump`, { page, pageSize }),

  // List extraSqlPerso with iceberg
  getExtraSqlPersoIceberg: (sn: string, page = 1, pageSize = 25): Promise<IcebergResult<any>> =>
    ovhIceberg<any>(`${BASE}/${sn}/extraSqlPerso`, { page, pageSize }),

  // List databases with iceberg
  listDatabasesIceberg: (sn: string, page = 1, pageSize = 25): Promise<IcebergResult<Database>> =>
    ovhIceberg<Database>(`${BASE}/${sn}/database`, { page, pageSize }),

  // ============ ORDER / CART APIs (from old_manager) ============

  // Get available service options for webHosting (for hasPrivateSqlToActivate)
  getCartServiceOptions: (sn: string) =>
    ovhGet<Array<{
      planCode: string;
      family: string;
      prices: Array<{ capacities: string[]; duration: string; pricingMode: string }>;
    }>>(`/order/cartServiceOption/webHosting/${sn}`).catch(() => []),

  // Check if private SQL can be activated (from old_manager hasPrivateSqlToActivate)
  hasPrivateSqlToActivate: async (sn: string) => {
    const options = await databaseService.getCartServiceOptions(sn);
    return options.some(opt => opt.planCode.includes("private") && opt.planCode.includes("sql"));
  },

  // ============ COPY DATABASE EXACT MATCH OLD_MANAGER ============

  // Copy database - empty body POST (exact match old_manager)
  copyDatabaseStart: (sn: string, dbName: string) =>
    ovhPost<{ id: number }>(`${BASE}/${sn}/database/${dbName}/copy`, {}),

  // Copy database from private database
  copyPrivateDatabaseStart: (sn: string, dbName: string) =>
    ovhPost<{ id: number }>(`/hosting/privateDatabase/${sn}/database/${dbName}/copy`, {}),

  // Restore from copy (exact match old_manager)
  copyDatabaseRestore: (sn: string, dbName: string, copyId: number, flushDatabase = true) =>
    ovhPost<void>(`${BASE}/${sn}/database/${dbName}/copyRestore`, { copyId, flushDatabase }),

  // Restore from copy (private database)
  copyPrivateDatabaseRestore: (sn: string, dbName: string, copyId: number, flushDatabase = true) =>
    ovhPost<void>(`/hosting/privateDatabase/${sn}/database/${dbName}/copyRestore`, { copyId, flushDatabase }),
};

export default databaseService;
