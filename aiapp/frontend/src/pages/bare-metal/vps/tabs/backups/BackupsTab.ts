// ============================================================
// VPS SERVICE ISOLÉ : BackupsTab
// ============================================================

import { ovhApi } from "../../../../../services/api";

interface BackupData {
  id: string;
  creationDate: string;
}

class BackupsService {
  async getBackups(serviceName: string): Promise<BackupData[]> {
    const backupIds = await ovhApi.get<string[]>(`/vps/${serviceName}/automatedBackup/attachedBackup`);
    return backupIds.map((id) => ({ id, creationDate: id }));
  }

  async getBackupAccess(serviceName: string): Promise<{ additionalDisk: string | null; nfs: string | null }> {
    return ovhApi.get(`/vps/${serviceName}/automatedBackup`);
  }

  async restoreBackup(serviceName: string, backupId: string): Promise<void> {
    return ovhApi.post<void>(`/vps/${serviceName}/automatedBackup/restore`, { backupId });
  }
}

export const backupsService = new BackupsService();
