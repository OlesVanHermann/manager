// ============================================================
// VMWARE TYPES - Types partagés pour tous les tabs VMware
// ============================================================

export interface DedicatedCloud {
  serviceName: string;
  description?: string;
  location: string;
  managementInterface: string;
  version: string;
  state: string;
  commercialRange: string;
  billingType: string;
}

export interface Datacenter {
  datacenterId: number;
  name: string;
  description?: string;
  commercialName: string;
  commercialRangeName: string;
}

export interface Host {
  hostId: number;
  name: string;
  state: string;
  profile: string;
  cpu: string;
  ram: number;
  connectionState: string;
}

export interface Datastore {
  filerId: number;
  name: string;
  size: number;
  freeSpace: number;
  state: string;
  vmTotal: number;
}

export interface User {
  userId: number;
  name: string;
  login: string;
  email?: string;
  canManageNetwork: boolean;
  canManageIpFailOvers: boolean;
  state: string;
}

export interface SecurityPolicy {
  userAccessPolicy: string;
  userSessionTimeout: number;
  userLimitConcurrentSession: number;
  logOutPolicy: string;
  tokenValidityInHours: number;
}

export interface License {
  name: string;
  edition: string;
  version: string;
  licenseKey: string;
}

export interface Operation {
  operationId: number;
  name: string;
  state: string;
  progress: number;
  startedOn: string;
  endedOn?: string;
}

export interface Task {
  taskId: number;
  name: string;
  state: string;
  progress: number;
  startDate: string;
  endDate?: string;
}
