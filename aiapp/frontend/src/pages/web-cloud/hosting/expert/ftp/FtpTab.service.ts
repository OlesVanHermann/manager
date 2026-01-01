// ============================================================
// FTP TAB SERVICE - API calls for FtpTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { Hosting, FtpUser } from "../../hosting.types";

const BASE = "/hosting/web";

export const ftpService = {
  // --- Hosting ---
  getHosting: (sn: string) =>
    ovhGet<Hosting>(`${BASE}/${sn}`),

  // --- FTP Users (from old_manager hosting-ftp.service.js) ---
  listFtpUsers: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/user`),

  getFtpUser: (sn: string, login: string) =>
    ovhGet<FtpUser>(`${BASE}/${sn}/user/${login}`),

  // Create user with all params from old_manager (including sshState)
  createFtpUser: (sn: string, data: {
    login: string;
    password: string;
    home?: string;
    sshState?: string; // "none" | "active" | "sftponly"
  }) =>
    ovhPost<void>(`${BASE}/${sn}/user`, {
      login: data.login,
      password: data.password,
      ...(data.home && { home: data.home }),
      ...(data.sshState && { sshState: data.sshState }),
    }),

  // Update user with data object (from old_manager updateUser)
  updateFtpUser: (sn: string, login: string, data: Partial<FtpUser>) =>
    ovhPut<void>(`${BASE}/${sn}/user/${login}`, data),

  deleteFtpUser: (sn: string, login: string) =>
    ovhDelete<void>(`${BASE}/${sn}/user/${login}`),

  changeFtpPassword: (sn: string, login: string, password: string) =>
    ovhPost<void>(`${BASE}/${sn}/user/${login}/changePassword`, { password }),

  // --- Tasks (from old_manager getTasks) ---
  getUserTasks: (sn: string, status?: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/tasks`, {
      params: {
        function: "user/update",
        ...(status && { status }),
      },
    } as any).catch(() => []),

  // --- User creation capabilities (from old_manager getUserCreationCapabilities) ---
  getUserCreationCapabilities: async (sn: string) => {
    const models = await ovhGet<any>(`${BASE}.json`);
    return {
      maxUser: 1000,
      stateAvailable: models?.models?.["hosting.web.user.StateEnum"]?.enum?.map(
        (m: string) => m.replace(/([A-Z])/g, "_$1").toUpperCase()
      ) || ["ACTIVE", "NONE", "SFTPONLY"],
    };
  },

  // --- Snapshots (from old_manager hosting-ftp-snapshot-restore.service.js) ---
  listSnapshotDates: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/dump`).catch(() => []),

  getSnapshotDetails: async (sn: string) => {
    const dates = await ovhGet<string[]>(`${BASE}/${sn}/dump`).catch(() => []);
    if (dates.length === 0) return [];
    return Promise.all(dates.map((d: string) => ovhGet<any>(`${BASE}/${sn}/dump/${d}`)));
  },

  // Restore snapshot (from old_manager restoreSnapshot)
  restoreSnapshot: (sn: string, backup: string) =>
    ovhPost<void>(`${BASE}/${sn}/restoreSnapshot`, { backup }),

  // --- Models (from old_manager getModels) ---
  getModels: () =>
    ovhGet<any>(`${BASE}.json`),
};

export default ftpService;
