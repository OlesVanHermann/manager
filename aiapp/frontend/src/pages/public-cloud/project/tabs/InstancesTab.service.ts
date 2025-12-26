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
