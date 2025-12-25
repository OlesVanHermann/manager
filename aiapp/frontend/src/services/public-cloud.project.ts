// ============================================================
// PUBLIC CLOUD PROJECT SERVICE
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

// Types
export interface CloudProject {
  projectId: string;
  projectName: string;
  description: string;
  planCode: string;
  status: "creating" | "deleted" | "deleting" | "ok" | "suspended";
  creationDate: string;
}

export interface CloudProjectServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
}

export interface CloudQuota {
  region: string;
  instance: { maxCores: number; usedCores: number; maxInstances: number; usedInstances: number; maxRam: number; usedRAM: number };
  volume: { maxGigabytes: number; usedGigabytes: number; maxVolumeCount: number; volumeCount: number };
  network: { maxNetworks: number; usedNetworks: number; maxFloatingIPs: number; usedFloatingIPs: number };
}

export interface CloudSshKey {
  id: string;
  name: string;
  publicKey: string;
  regions: string[];
}

export interface CloudNetwork {
  id: string;
  name: string;
  status: string;
  type: string;
  vlanId: number | null;
  regions: { region: string; status: string }[];
}

export interface CloudInstance {
  id: string;
  name: string;
  region: string;
  status: string;
  flavorId: string;
  imageId: string;
  created: string;
  monthlyBilling?: { since: string; status: string };
  ipAddresses: { ip: string; type: string; version: number }[];
}

export interface CloudVolume {
  id: string;
  name: string;
  region: string;
  size: number;
  type: string;
  status: string;
  attachedTo: string[];
}

export interface CloudContainer {
  id: string;
  name: string;
  region: string;
  storedBytes: number;
  storedObjects: number;
  containerType: string;
  archive: boolean;
}

export interface CloudSnapshot {
  id: string;
  name: string;
  region: string;
  size: number;
  status: string;
  creationDate: string;
}

// API Functions - Projects
export async function listProjects(): Promise<string[]> {
  return ovhGet<string[]>("/cloud/project");
}

export async function getProject(projectId: string): Promise<CloudProject> {
  return ovhGet<CloudProject>(`/cloud/project/${projectId}`);
}

export async function getServiceInfos(projectId: string): Promise<CloudProjectServiceInfos> {
  return ovhGet<CloudProjectServiceInfos>(`/cloud/project/${projectId}/serviceInfos`);
}

// API Functions - Quota
export async function getQuota(projectId: string): Promise<CloudQuota[]> {
  return ovhGet<CloudQuota[]>(`/cloud/project/${projectId}/quota`);
}

// API Functions - SSH Keys
export async function listSshKeys(projectId: string): Promise<CloudSshKey[]> {
  return ovhGet<CloudSshKey[]>(`/cloud/project/${projectId}/sshkey`);
}

export async function createSshKey(projectId: string, name: string, publicKey: string): Promise<CloudSshKey> {
  return ovhPost<CloudSshKey>(`/cloud/project/${projectId}/sshkey`, { name, publicKey });
}

export async function deleteSshKey(projectId: string, keyId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/sshkey/${keyId}`);
}

// API Functions - Networks
export async function listNetworks(projectId: string): Promise<CloudNetwork[]> {
  return ovhGet<CloudNetwork[]>(`/cloud/project/${projectId}/network/private`);
}

// API Functions - Instances (pour la vue projet)
export async function listInstances(projectId: string): Promise<CloudInstance[]> {
  return ovhGet<CloudInstance[]>(`/cloud/project/${projectId}/instance`);
}

export async function rebootInstance(projectId: string, instanceId: string, type: "soft" | "hard"): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/reboot`, { type });
}

export async function startInstance(projectId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/start`, {});
}

export async function stopInstance(projectId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/stop`, {});
}

// API Functions - Volumes (pour la vue projet)
export async function listVolumes(projectId: string): Promise<CloudVolume[]> {
  return ovhGet<CloudVolume[]>(`/cloud/project/${projectId}/volume`);
}

// API Functions - Containers (pour la vue projet)
export async function listContainers(projectId: string): Promise<CloudContainer[]> {
  return ovhGet<CloudContainer[]>(`/cloud/project/${projectId}/storage`);
}

// API Functions - Snapshots (pour la vue projet)
export async function listSnapshots(projectId: string): Promise<CloudSnapshot[]> {
  return ovhGet<CloudSnapshot[]>(`/cloud/project/${projectId}/snapshot`);
}
