// ============================================================
// SERVICE DEDICATED - Serveurs dedies OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface DedicatedServer {
  name: string;
  commercialRange: string;
  datacenter: string;
  ip: string;
  linkSpeed: number;
  os: string;
  professionalUse: boolean;
  rack: string;
  region: string;
  rescueMail: string | null;
  reverse: string;
  rootDevice: string | null;
  serverId: number;
  state: 'error' | 'hacked' | 'hackedBlocked' | 'ok';
  supportLevel: 'critical' | 'fastpath' | 'gs' | 'pro' | 'technic';
  bootId: number | null;
  monitoring: boolean;
  newUpgradeSystem: boolean;
  noIntervention: boolean;
  powerState: 'poweroff' | 'poweron';
}

export interface DedicatedServerServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface DedicatedServerHardware {
  bootMode: 'legacy' | 'uefi' | 'uefiLegacy';
  coresPerProcessor: number;
  defaultHardwareRaidSize: { unit: string; value: number } | null;
  defaultHardwareRaidType: string | null;
  description: string | null;
  diskGroups: { defaultHardwareRaidSize: { unit: string; value: number } | null; defaultHardwareRaidType: string | null; description: string; diskGroupId: number; diskSize: { unit: string; value: number }; diskType: string; numberOfDisks: number; raidController: string | null }[];
  expansionCards: { description: string; type: string }[] | null;
  formFactor: string;
  memorySize: { unit: string; value: number };
  motherboard: string;
  numberOfProcessors: number;
  processorArchitecture: string;
  processorName: string;
  threadsPerProcessor: number;
  usbKeys: { unit: string; value: number }[] | null;
}

export interface DedicatedServerIp {
  ip: string;
  ipBlock: string;
  version: 'v4' | 'v6';
  reverse: string | null;
  type: 'primary' | 'secondary' | 'failover';
  virtualMac: string | null;
}

export interface DedicatedServerTask {
  taskId: number;
  function: string;
  status: 'cancelled' | 'customerError' | 'doing' | 'done' | 'init' | 'ovhError' | 'todo';
  startDate: string;
  doneDate: string | null;
  lastUpdate: string;
  comment: string | null;
}

export interface DedicatedServerIntervention {
  interventionId: number;
  date: string;
  type: string;
}

export interface DedicatedServerNetboot {
  bootId: number;
  bootType: 'harddisk' | 'internal' | 'ipxeCustomerScript' | 'network' | 'rescue';
  description: string;
  kernel: string;
}

export interface DedicatedServerIpmi {
  activated: boolean;
  supportedFeatures: { kvmoverip: boolean; serialOverLanSshKey: boolean; serialOverLanUrl: boolean };
}

export interface DedicatedServerVrack {
  vrack: string;
  state: 'activating' | 'inMaintenance' | 'ok';
}

export interface DedicatedServerBackupFtp {
  ftpBackupName: string;
  quota: { unit: string; value: number };
  readOnlyDate: string | null;
  type: string;
  usage: { unit: string; value: number };
}

// ============================================================
// SERVICE
// ============================================================

class DedicatedService {
  async listServers(): Promise<string[]> {
    return ovhApi.get<string[]>('/dedicated/server');
  }

  async getServer(serviceName: string): Promise<DedicatedServer> {
    return ovhApi.get<DedicatedServer>(`/dedicated/server/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<DedicatedServerServiceInfos> {
    return ovhApi.get<DedicatedServerServiceInfos>(`/dedicated/server/${serviceName}/serviceInfos`);
  }

  // ---------- Hardware ----------
  async getHardware(serviceName: string): Promise<DedicatedServerHardware> {
    return ovhApi.get<DedicatedServerHardware>(`/dedicated/server/${serviceName}/specifications/hardware`);
  }

  // ---------- IPs ----------
  async listIps(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/ips`);
  }

  // ---------- Network ----------
  async listVracks(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/dedicated/server/${serviceName}/vrack`);
  }

  async getVrack(serviceName: string, vrack: string): Promise<DedicatedServerVrack> {
    return ovhApi.get<DedicatedServerVrack>(`/dedicated/server/${serviceName}/vrack/${vrack}`);
  }

  // ---------- IPMI ----------
  async getIpmi(serviceName: string): Promise<DedicatedServerIpmi> {
    return ovhApi.get<DedicatedServerIpmi>(`/dedicated/server/${serviceName}/features/ipmi`);
  }

  async startIpmiSession(serviceName: string, type: 'kvmipJnlp' | 'kvmipHtml5URL' | 'serialOverLanURL'): Promise<{ value: string }> {
    return ovhApi.post<{ value: string }>(`/dedicated/server/${serviceName}/features/ipmi/access`, { type });
  }

  async rebootIpmi(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/features/ipmi/resetInterface`, {});
  }

  // ---------- Netboot ----------
  async listNetboots(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/boot`);
  }

  async getNetboot(serviceName: string, bootId: number): Promise<DedicatedServerNetboot> {
    return ovhApi.get<DedicatedServerNetboot>(`/dedicated/server/${serviceName}/boot/${bootId}`);
  }

  // ---------- Backup FTP ----------
  async getBackupFtp(serviceName: string): Promise<DedicatedServerBackupFtp | null> {
    try {
      return await ovhApi.get<DedicatedServerBackupFtp>(`/dedicated/server/${serviceName}/features/backupFTP`);
    } catch { return null; }
  }

  async createBackupFtp(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/features/backupFTP`, {});
  }

  async getBackupFtpPassword(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/features/backupFTP/password`, {});
  }

  // ---------- Actions ----------
  async reboot(serviceName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/reboot`, {});
  }

  async reinstall(serviceName: string, templateName: string): Promise<DedicatedServerTask> {
    return ovhApi.post<DedicatedServerTask>(`/dedicated/server/${serviceName}/install/start`, { templateName });
  }

  // ---------- Tasks ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/task`);
  }

  async getTask(serviceName: string, taskId: number): Promise<DedicatedServerTask> {
    return ovhApi.get<DedicatedServerTask>(`/dedicated/server/${serviceName}/task/${taskId}`);
  }

  // ---------- Interventions ----------
  async listInterventions(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/dedicated/server/${serviceName}/intervention`);
  }

  async getIntervention(serviceName: string, interventionId: number): Promise<DedicatedServerIntervention> {
    return ovhApi.get<DedicatedServerIntervention>(`/dedicated/server/${serviceName}/intervention/${interventionId}`);
  }
}

export const dedicatedService = new DedicatedService();
