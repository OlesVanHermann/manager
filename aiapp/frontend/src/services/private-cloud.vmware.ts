// ============================================================
// PRIVATE CLOUD VMWARE SERVICE - API Dedicated Cloud OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "./api";

export interface DedicatedCloud { serviceName: string; description?: string; location: string; managementInterface: string; version: string; state: string; commercialRange: string; billingType: string; }
export interface Datacenter { datacenterId: number; name: string; description?: string; commercialName: string; commercialRangeName: string; }
export interface Host { hostId: number; name: string; state: string; profile: string; cpu: string; ram: number; connectionState: string; }
export interface Datastore { filerId: number; name: string; size: number; freeSpace: number; state: string; vmTotal: number; }
export interface User { userId: number; name: string; login: string; email?: string; canManageNetwork: boolean; canManageIpFailOvers: boolean; state: string; }
export interface SecurityPolicy { userAccessPolicy: string; userSessionTimeout: number; userLimitConcurrentSession: number; logOutPolicy: string; tokenValidityInHours: number; }
export interface License { name: string; edition: string; version: string; licenseKey: string; }
export interface Operation { operationId: number; name: string; state: string; progress: number; startedOn: string; endedOn?: string; }
export interface Task { taskId: number; name: string; state: string; progress: number; startDate: string; endDate?: string; }

export async function getServices(): Promise<string[]> { return ovhGet<string[]>("/dedicatedCloud"); }
export async function getService(serviceName: string): Promise<DedicatedCloud> { return ovhGet<DedicatedCloud>(`/dedicatedCloud/${serviceName}`); }

export async function getDatacenters(serviceName: string): Promise<Datacenter[]> {
  const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
  return Promise.all(ids.map(id => ovhGet<Datacenter>(`/dedicatedCloud/${serviceName}/datacenter/${id}`)));
}

export async function getHosts(serviceName: string): Promise<Host[]> {
  const dcs = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
  const allHosts: Host[] = [];
  for (const dcId of dcs) {
    const hostIds = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/host`);
    const hosts = await Promise.all(hostIds.map(id => ovhGet<Host>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/host/${id}`)));
    allHosts.push(...hosts);
  }
  return allHosts;
}

export async function getDatastores(serviceName: string): Promise<Datastore[]> {
  const dcs = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
  const allDs: Datastore[] = [];
  for (const dcId of dcs) {
    const filerIds = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/filer`);
    const filers = await Promise.all(filerIds.map(id => ovhGet<Datastore>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/filer/${id}`)));
    allDs.push(...filers);
  }
  return allDs;
}

export async function getUsers(serviceName: string): Promise<User[]> {
  const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/user`);
  return Promise.all(ids.map(id => ovhGet<User>(`/dedicatedCloud/${serviceName}/user/${id}`)));
}

export async function getSecurityPolicy(serviceName: string): Promise<SecurityPolicy> { return ovhGet<SecurityPolicy>(`/dedicatedCloud/${serviceName}/securityPolicy`); }

export async function getLicenses(serviceName: string): Promise<License[]> { return ovhGet<License[]>(`/dedicatedCloud/${serviceName}/vmwareLicense`).catch(() => []); }

export async function getOperations(serviceName: string): Promise<Operation[]> {
  const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/operation`);
  const ops = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Operation>(`/dedicatedCloud/${serviceName}/operation/${id}`)));
  return ops.sort((a, b) => new Date(b.startedOn).getTime() - new Date(a.startedOn).getTime());
}

export async function getTasks(serviceName: string): Promise<Task[]> {
  const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/task`);
  const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhGet<Task>(`/dedicatedCloud/${serviceName}/task/${id}`)));
  return tasks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}
