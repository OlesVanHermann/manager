// ============================================================
// PROJECT TYPES - Définitions partagées au niveau NAV2
// ============================================================

export interface CloudProject {
  projectId: string;
  projectName: string;
  description?: string;
  status: string;
  creationDate: string;
}

export interface CloudProjectServiceInfos {
  serviceId: string;
  domain: string;
  creation: string;
  expiration: string;
  status: string;
}

export interface CloudInstance {
  id: string;
  name: string;
  flavorId: string;
  flavorName?: string;
  imageId: string;
  imageName?: string;
  region: string;
  status: string;
  created: string;
  monthlyBilling?: boolean;
  ipAddresses: IpAddress[];
}

export interface IpAddress {
  ip: string;
  type: "public" | "private";
  version: 4 | 6;
}

export interface CloudVolume {
  id: string;
  name: string;
  description?: string;
  region: string;
  size: number;
  type: string;
  status: string;
  bootable: boolean;
  attachedTo?: string[];
  createdAt: string;
}

export interface CloudSnapshot {
  id: string;
  name: string;
  region: string;
  size: number;
  status: string;
  creationDate: string;
}

export interface CloudContainer {
  id: string;
  name: string;
  region: string;
  containerType: "public" | "private" | "static";
  storedObjects: number;
  storedBytes: number;
  archive: boolean;
}

export interface CloudNetwork {
  id: string;
  name: string;
  vlanId?: number;
  status: string;
  regions?: { region: string; status: string }[];
}

export interface CloudSshKey {
  id: string;
  name: string;
  publicKey: string;
  regions?: string[];
}

export interface CloudQuota {
  region: string;
  instance: {
    maxInstances: number;
    usedInstances: number;
    maxCores: number;
    usedCores: number;
    maxRam: number;
    usedRAM: number;
  };
  volume: {
    maxVolumeCount: number;
    volumeCount: number;
    maxGigabytes: number;
    usedGigabytes: number;
  };
}
