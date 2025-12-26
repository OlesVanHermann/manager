import { ovhGet, ovhPost } from "../../../../services/api";
import type { CloudInstance } from "../project.types";

export async function listInstances(projectId: string): Promise<CloudInstance[]> {
  return ovhGet<CloudInstance[]>(`/cloud/project/${projectId}/instance`);
}

export async function startInstance(projectId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/start`, {});
}

export async function stopInstance(projectId: string, instanceId: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/stop`, {});
}

export async function rebootInstance(projectId: string, instanceId: string, type: "soft" | "hard" = "soft"): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/reboot`, { type });
}

export const instancesService = { listInstances, startInstance, stopInstance, rebootInstance };

// ======================== Project API (pour index.tsx) ========================

export async function listProjects(): Promise<string[]> {
  return ovhGet<string[]>("/cloud/project");
}

export async function getProject(projectId: string): Promise<CloudProject> {
  return ovhGet<CloudProject>(`/cloud/project/${projectId}`);
}

export async function getServiceInfos(projectId: string): Promise<CloudProjectServiceInfos> {
  return ovhGet<CloudProjectServiceInfos>(`/cloud/project/${projectId}/serviceInfos`);
}

interface CloudProject {
  projectId: string;
  projectName: string;
  description: string;
  planCode: string;
  status: "creating" | "deleted" | "deleting" | "ok" | "suspended";
  creationDate: string;
}

interface CloudProjectServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
}
