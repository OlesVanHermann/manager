// ============================================================
// SERVICE VPS - Virtual Private Server OVHcloud
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES
// ============================================================

export interface Vps {
  name: string;
  displayName: string;
  cluster: string;
  model: { name: string; offer: string; version: string; disk: number; memory: number; vcore: number };
  netbootMode: 'local' | 'rescue';
  offerType: string;
  slaMonitoring: boolean;
  state: 'backuping' | 'installing' | 'maintenance' | 'rebooting' | 'rescued' | 'running' | 'stopped' | 'stopping' | 'upgrading';
  vcore: number;
  zone: string;
  keymap: string | null;
  memoryLimit: number;
  monitoringIpBlocks: string[];
}

export interface VpsServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface VpsIp {
  ipAddress: string;
  gateway: string | null;
  type: 'primary' | 'additional';
  version: 'v4' | 'v6';
  reverse: string | null;
  macAddress: string | null;
}

export interface VpsDisk {
  id: number;
  size: number;
  state: 'connected' | 'disconnected' | 'pending';
  type: 'additional' | 'primary';
  bandwidthLimit: number;
  fileSystem: string | null;
  isReadOnly: boolean;
  name: string | null;
  monitored: boolean;
}

export interface VpsSnapshot {
  creationDate: string;
  description: string;
}

export interface VpsBackup {
  id: number;
  creationDate: string;
  description: string | null;
  state: 'created' | 'creating' | 'deleted' | 'deleting' | 'error' | 'restoring';
}

export interface VpsTemplate {
  id: number;
  name: string;
  distribution: string;
  locale: string;
  availableLanguage: string[];
  bitFormat: number;
}

export interface VpsTask {
  id: number;
  type: string;
  state: 'blocked' | 'cancelled' | 'doing' | 'done' | 'error' | 'paused' | 'todo' | 'waitingAck';
  progress: number;
  startDate: string | null;
  doneDate: string | null;
}

export interface VpsMonitoring {
  cpu: { timestamp: number; value: number }[];
  mem: { timestamp: number; value: number }[];
  netRx: { timestamp: number; value: number }[];
  netTx: { timestamp: number; value: number }[];
}

export interface VpsOption {
  option: string;
  state: 'released' | 'subscribed';
}

// ============================================================
// SERVICE
// ============================================================

class VpsService {
  async listVps(): Promise<string[]> {
    return ovhApi.get<string[]>('/vps');
  }

  async getVps(serviceName: string): Promise<Vps> {
    return ovhApi.get<Vps>(`/vps/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<VpsServiceInfos> {
    return ovhApi.get<VpsServiceInfos>(`/vps/${serviceName}/serviceInfos`);
  }

  // ---------- IPs ----------
  async listIps(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vps/${serviceName}/ips`);
  }

  async getIp(serviceName: string, ipAddress: string): Promise<VpsIp> {
    return ovhApi.get<VpsIp>(`/vps/${serviceName}/ips/${ipAddress}`);
  }

  // ---------- Disks ----------
  async listDisks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/vps/${serviceName}/disks`);
  }

  async getDisk(serviceName: string, id: number): Promise<VpsDisk> {
    return ovhApi.get<VpsDisk>(`/vps/${serviceName}/disks/${id}`);
  }

  // ---------- Snapshot ----------
  async getSnapshot(serviceName: string): Promise<VpsSnapshot | null> {
    try {
      return await ovhApi.get<VpsSnapshot>(`/vps/${serviceName}/snapshot`);
    } catch { return null; }
  }

  async createSnapshot(serviceName: string, description?: string): Promise<void> {
    return ovhApi.post<void>(`/vps/${serviceName}/createSnapshot`, { description });
  }

  async deleteSnapshot(serviceName: string): Promise<void> {
    return ovhApi.delete<void>(`/vps/${serviceName}/snapshot`);
  }

  async restoreSnapshot(serviceName: string): Promise<void> {
    return ovhApi.post<void>(`/vps/${serviceName}/snapshot/revert`, {});
  }

  // ---------- Automated Backup ----------
  async listBackups(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vps/${serviceName}/automatedBackup/attachedBackup`);
  }

  async getBackupAccess(serviceName: string): Promise<{ additionalDisk: string | null; nfs: string | null }> {
    return ovhApi.get(`/vps/${serviceName}/automatedBackup`);
  }

  // ---------- Templates ----------
  async listTemplates(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/vps/${serviceName}/templates`);
  }

  async getTemplate(serviceName: string, id: number): Promise<VpsTemplate> {
    return ovhApi.get<VpsTemplate>(`/vps/${serviceName}/templates/${id}`);
  }

  // ---------- Actions ----------
  async reboot(serviceName: string): Promise<VpsTask> {
    return ovhApi.post<VpsTask>(`/vps/${serviceName}/reboot`, {});
  }

  async start(serviceName: string): Promise<VpsTask> {
    return ovhApi.post<VpsTask>(`/vps/${serviceName}/start`, {});
  }

  async stop(serviceName: string): Promise<VpsTask> {
    return ovhApi.post<VpsTask>(`/vps/${serviceName}/stop`, {});
  }

  async reinstall(serviceName: string, templateId: number): Promise<VpsTask> {
    return ovhApi.post<VpsTask>(`/vps/${serviceName}/reinstall`, { templateId });
  }

  async setRescueMode(serviceName: string, rescue: boolean): Promise<VpsTask> {
    return ovhApi.post<VpsTask>(`/vps/${serviceName}/setNetbootMode`, { netBootMode: rescue ? 'rescue' : 'local' });
  }

  // ---------- Monitoring ----------
  async getMonitoring(serviceName: string, period: 'lastday' | 'lastmonth' | 'lastweek' | 'lastyear'): Promise<VpsMonitoring> {
    return ovhApi.get<VpsMonitoring>(`/vps/${serviceName}/monitoring?period=${period}`);
  }

  // ---------- Tasks ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/vps/${serviceName}/tasks`);
  }

  async getTask(serviceName: string, id: number): Promise<VpsTask> {
    return ovhApi.get<VpsTask>(`/vps/${serviceName}/tasks/${id}`);
  }

  // ---------- Options ----------
  async listOptions(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vps/${serviceName}/option`);
  }

  async getOption(serviceName: string, option: string): Promise<VpsOption> {
    return ovhApi.get<VpsOption>(`/vps/${serviceName}/option/${option}`);
  }
}

export const vpsService = new VpsService();
