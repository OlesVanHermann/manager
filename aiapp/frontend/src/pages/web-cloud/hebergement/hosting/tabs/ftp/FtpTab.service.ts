// ============================================================
// FTP TAB SERVICE - API calls for FtpTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../../services/api";
import type { Hosting, FtpUser } from "../../hosting.types";

const BASE = "/hosting/web";

export const ftpService = {
  // --- Hosting ---
  getHosting: (sn: string) => 
    ovhGet<Hosting>(`${BASE}/${sn}`),

  // --- FTP Users ---
  listFtpUsers: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/user`),

  getFtpUser: (sn: string, login: string) => 
    ovhGet<FtpUser>(`${BASE}/${sn}/user/${login}`),

  createFtpUser: (sn: string, data: { login: string; password: string; home?: string }) => 
    ovhPost<void>(`${BASE}/${sn}/user`, data),

  updateFtpUser: (sn: string, login: string, data: Partial<FtpUser>) => 
    ovhPut<void>(`${BASE}/${sn}/user/${login}`, data),

  deleteFtpUser: (sn: string, login: string) => 
    ovhDelete<void>(`${BASE}/${sn}/user/${login}`),

  changeFtpPassword: (sn: string, login: string, password: string) => 
    ovhPost<void>(`${BASE}/${sn}/user/${login}/changePassword`, { password }),

  // --- Snapshots ---
  listSnapshots: async (sn: string) => {
    const dates = await ovhGet<string[]>(`${BASE}/${sn}/dump`);
    return Promise.all(dates.map(d => ovhGet<any>(`${BASE}/${sn}/dump/${d}`)));
  },

  restoreSnapshot: (sn: string, date: string) => 
    ovhPost<void>(`${BASE}/${sn}/restoreSnapshot`, { backup: date }),
};

export default ftpService;
