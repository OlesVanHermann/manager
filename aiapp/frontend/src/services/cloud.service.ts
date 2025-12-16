// ============================================================
// SERVICE CLOUD - Public Cloud OVHcloud (OpenStack)
// ============================================================

import { ovhApi } from './api.service';

// ============================================================
// TYPES - PROJECT
// ============================================================

export interface CloudProject {
  projectId: string;
  projectName: string;
  description: string;
  planCode: string;
  unleash: boolean;
  expiration: string | null;
  creationDate: string;
  orderType: string;
  status: 'creating' | 'deleted' | 'deleting' | 'ok' | 'suspended';
  access: 'full' | 'restricted';
}

export interface CloudProjectServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface CloudQuota {
  region: string;
  instance: { maxCores: number; maxInstances: number; maxRam: number; usedCores: number; usedInstances: number; usedRAM: number };
  volume: { maxGigabytes: number; usedGigabytes: number; volumeCount: number; maxVolumeCount: number };
  network: { maxNetworks: number; usedNetworks: number; maxSubnets: number; usedSubnets: number; maxFloatingIPs: number; usedFloatingIPs: number };
}

// ============================================================
// TYPES - INSTANCE
// ============================================================

export interface CloudInstance {
  id: string;
  name: string;
  flavorId: string;
  imageId: string;
  sshKeyId: string | null;
  created: string;
  region: string;
  monthlyBilling: { since: string; status: string } | null;
  status: 'ACTIVE' | 'BUILD' | 'DELETED' | 'ERROR' | 'HARD_REBOOT' | 'MIGRATING' | 'PASSWORD' | 'PAUSED' | 'REBOOT' | 'REBUILD' | 'RESCUE' | 'RESIZE' | 'REVERT_RESIZE' | 'SHELVED' | 'SHELVED_OFFLOADED' | 'SHUTOFF' | 'SOFT_DELETED' | 'STOPPED' | 'SUSPENDED' | 'UNKNOWN' | 'VERIFY_RESIZE';
  planCode: string;
  operationIds: string[];
  currentMonthOutgoingTraffic: number | null;
  ipAddresses: { ip: string; type: 'private' | 'public'; version: number; networkId: string; gatewayIp: string | null }[];
}

export interface CloudFlavor {
  id: string;
  name: string;
  region: string;
  ram: number;
  disk: number;
  vcpus: number;
  type: string;
  osType: string;
  inboundBandwidth: number | null;
  outboundBandwidth: number | null;
  available: boolean;
  planCodes: { hourly: string | null; monthly: string | null };
}

export interface CloudImage {
  id: string;
  name: string;
  region: string;
  visibility: string;
  type: string;
  minDisk: number;
  minRam: number;
  size: number;
  creationDate: string;
  status: string;
  user: string;
  flavorType: string | null;
  tags: string[];
}

export interface CloudSshKey {
  id: string;
  name: string;
  publicKey: string;
  regions: string[];
}

// ============================================================
// TYPES - STORAGE
// ============================================================

export interface CloudVolume {
  id: string;
  name: string;
  description: string;
  size: number;
  region: string;
  status: 'attaching' | 'available' | 'awaiting-transfer' | 'backing-up' | 'creating' | 'deleting' | 'detaching' | 'downloading' | 'error' | 'error_backing-up' | 'error_deleting' | 'error_extending' | 'error_restoring' | 'extending' | 'in-use' | 'maintenance' | 'reserved' | 'restoring-backup' | 'retyping' | 'uploading';
  type: 'classic' | 'high-speed' | 'high-speed-gen2';
  bootable: boolean;
  creationDate: string;
  attachedTo: string[];
  planCode: string | null;
}

export interface CloudSnapshot {
  id: string;
  name: string;
  description: string | null;
  region: string;
  size: number;
  status: string;
  creationDate: string;
  volumeId: string | null;
  instanceId: string | null;
  planCode: string | null;
}

export interface CloudContainer {
  id: string;
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  archive: boolean;
  containerType: 'private' | 'public' | 'static';
}

// ============================================================
// TYPES - NETWORK
// ============================================================

export interface CloudNetwork {
  id: string;
  name: string;
  region: string;
  status: 'ACTIVE' | 'BUILD' | 'BUILDING';
  type: 'private' | 'public';
  vlanId: number | null;
  regions: { region: string; status: string; openstackId: string | null }[];
}

export interface CloudSubnet {
  id: string;
  cidr: string;
  dhcpEnabled: boolean;
  gatewayIp: string | null;
  ipPools: { dhcp: boolean; end: string; network: string; region: string; start: string }[];
}

// ============================================================
// SERVICE
// ============================================================

class CloudService {
  // ---------- Projects ----------
  async listProjects(): Promise<string[]> {
    return ovhApi.get<string[]>('/cloud/project');
  }

  async getProject(projectId: string): Promise<CloudProject> {
    return ovhApi.get<CloudProject>(`/cloud/project/${projectId}`);
  }

  async getServiceInfos(projectId: string): Promise<CloudProjectServiceInfos> {
    return ovhApi.get<CloudProjectServiceInfos>(`/cloud/project/${projectId}/serviceInfos`);
  }

  async getQuota(projectId: string): Promise<CloudQuota[]> {
    return ovhApi.get<CloudQuota[]>(`/cloud/project/${projectId}/quota`);
  }

  // ---------- Instances ----------
  async listInstances(projectId: string, region?: string): Promise<CloudInstance[]> {
    let path = `/cloud/project/${projectId}/instance`;
    if (region) path += `?region=${region}`;
    return ovhApi.get<CloudInstance[]>(path);
  }

  async getInstance(projectId: string, instanceId: string): Promise<CloudInstance> {
    return ovhApi.get<CloudInstance>(`/cloud/project/${projectId}/instance/${instanceId}`);
  }

  async rebootInstance(projectId: string, instanceId: string, type: 'hard' | 'soft'): Promise<void> {
    return ovhApi.post<void>(`/cloud/project/${projectId}/instance/${instanceId}/reboot`, { type });
  }

  async startInstance(projectId: string, instanceId: string): Promise<void> {
    return ovhApi.post<void>(`/cloud/project/${projectId}/instance/${instanceId}/start`, {});
  }

  async stopInstance(projectId: string, instanceId: string): Promise<void> {
    return ovhApi.post<void>(`/cloud/project/${projectId}/instance/${instanceId}/stop`, {});
  }

  async deleteInstance(projectId: string, instanceId: string): Promise<void> {
    return ovhApi.delete<void>(`/cloud/project/${projectId}/instance/${instanceId}`);
  }

  async rescueInstance(projectId: string, instanceId: string, imageId: string): Promise<{ adminPassword: string }> {
    return ovhApi.post(`/cloud/project/${projectId}/instance/${instanceId}/rescueMode`, { imageId, rescue: true });
  }

  // ---------- Flavors & Images ----------
  async listFlavors(projectId: string, region?: string): Promise<CloudFlavor[]> {
    let path = `/cloud/project/${projectId}/flavor`;
    if (region) path += `?region=${region}`;
    return ovhApi.get<CloudFlavor[]>(path);
  }

  async listImages(projectId: string, region?: string): Promise<CloudImage[]> {
    let path = `/cloud/project/${projectId}/image`;
    if (region) path += `?region=${region}`;
    return ovhApi.get<CloudImage[]>(path);
  }

  // ---------- SSH Keys ----------
  async listSshKeys(projectId: string): Promise<CloudSshKey[]> {
    return ovhApi.get<CloudSshKey[]>(`/cloud/project/${projectId}/sshkey`);
  }

  async createSshKey(projectId: string, name: string, publicKey: string): Promise<CloudSshKey> {
    return ovhApi.post<CloudSshKey>(`/cloud/project/${projectId}/sshkey`, { name, publicKey });
  }

  async deleteSshKey(projectId: string, keyId: string): Promise<void> {
    return ovhApi.delete<void>(`/cloud/project/${projectId}/sshkey/${keyId}`);
  }

  // ---------- Volumes ----------
  async listVolumes(projectId: string, region?: string): Promise<CloudVolume[]> {
    let path = `/cloud/project/${projectId}/volume`;
    if (region) path += `?region=${region}`;
    return ovhApi.get<CloudVolume[]>(path);
  }

  async getVolume(projectId: string, volumeId: string): Promise<CloudVolume> {
    return ovhApi.get<CloudVolume>(`/cloud/project/${projectId}/volume/${volumeId}`);
  }

  async attachVolume(projectId: string, volumeId: string, instanceId: string): Promise<CloudVolume> {
    return ovhApi.post<CloudVolume>(`/cloud/project/${projectId}/volume/${volumeId}/attach`, { instanceId });
  }

  async detachVolume(projectId: string, volumeId: string, instanceId: string): Promise<CloudVolume> {
    return ovhApi.post<CloudVolume>(`/cloud/project/${projectId}/volume/${volumeId}/detach`, { instanceId });
  }

  // ---------- Snapshots ----------
  async listSnapshots(projectId: string, region?: string): Promise<CloudSnapshot[]> {
    let path = `/cloud/project/${projectId}/snapshot`;
    if (region) path += `?region=${region}`;
    return ovhApi.get<CloudSnapshot[]>(path);
  }

  async createInstanceSnapshot(projectId: string, instanceId: string, snapshotName: string): Promise<void> {
    return ovhApi.post<void>(`/cloud/project/${projectId}/instance/${instanceId}/snapshot`, { snapshotName });
  }

  async deleteSnapshot(projectId: string, snapshotId: string): Promise<void> {
    return ovhApi.delete<void>(`/cloud/project/${projectId}/snapshot/${snapshotId}`);
  }

  // ---------- Object Storage ----------
  async listContainers(projectId: string): Promise<CloudContainer[]> {
    return ovhApi.get<CloudContainer[]>(`/cloud/project/${projectId}/storage`);
  }

  async getContainer(projectId: string, containerId: string): Promise<CloudContainer> {
    return ovhApi.get<CloudContainer>(`/cloud/project/${projectId}/storage/${containerId}`);
  }

  // ---------- Networks ----------
  async listNetworks(projectId: string): Promise<CloudNetwork[]> {
    return ovhApi.get<CloudNetwork[]>(`/cloud/project/${projectId}/network/private`);
  }

  async getNetwork(projectId: string, networkId: string): Promise<CloudNetwork> {
    return ovhApi.get<CloudNetwork>(`/cloud/project/${projectId}/network/private/${networkId}`);
  }

  async listSubnets(projectId: string, networkId: string): Promise<CloudSubnet[]> {
    return ovhApi.get<CloudSubnet[]>(`/cloud/project/${projectId}/network/private/${networkId}/subnet`);
  }

  // ---------- Regions ----------
  async listRegions(projectId: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/cloud/project/${projectId}/region`);
  }
}

export const cloudService = new CloudService();
