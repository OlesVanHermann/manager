// ============================================================
// LOGS TAB SERVICE - API calls for LogsTab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../../services/api";
import type { Hosting, OwnLog, UserLogs } from "../../hosting.types";

const BASE = "/hosting/web";

export const logsService = {
  // --- Hosting ---
  getHosting: (sn: string) => 
    ovhGet<Hosting>(`${BASE}/${sn}`),

  // --- Own Logs (domains) ---
  listOwnLogs: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/ownLogs`).catch(() => []),

  getOwnLog: (sn: string, id: number) => 
    ovhGet<OwnLog>(`${BASE}/${sn}/ownLogs/${id}`),

  // --- User Logs (access credentials) ---
  listUserLogs: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/userLogs`),

  getUserLogs: (sn: string, login: string) => 
    ovhGet<UserLogs>(`${BASE}/${sn}/userLogs/${login}`),

  createUserLogs: (sn: string, data: { login: string; password: string; description?: string }) => 
    ovhPost<void>(`${BASE}/${sn}/userLogs`, data),

  deleteUserLogs: (sn: string, login: string) => 
    ovhDelete<void>(`${BASE}/${sn}/userLogs/${login}`),

  changeUserLogsPassword: (sn: string, login: string, password: string) => 
    ovhPost<void>(`${BASE}/${sn}/userLogs/${login}/changePassword`, { password }),
};

export default logsService;
