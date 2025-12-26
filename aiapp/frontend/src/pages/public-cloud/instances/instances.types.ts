// ============================================================
// INSTANCES TYPES - Définitions partagées au niveau NAV2
// ============================================================

export interface Instance {
  id: string;
  name: string;
  flavorId: string;
  flavorName: string;
  imageId: string;
  imageName: string;
  region: string;
  status: string;
  created: string;
  ipAddresses: IpAddress[];
}

export interface IpAddress {
  ip: string;
  type: "public" | "private";
  version: 4 | 6;
}

export interface InstanceSnapshot {
  id: string;
  name: string;
  status: string;
  size: number;
  createdAt: string;
}

export type InstanceAction = "start" | "stop" | "reboot" | "rescue" | "reinstall" | "delete";
export type InstanceStatus = "ACTIVE" | "SHUTOFF" | "BUILD" | "REBUILD" | "REBOOT" | "RESCUE" | "ERROR";
