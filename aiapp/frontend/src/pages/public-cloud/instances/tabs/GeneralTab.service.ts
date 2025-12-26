import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Instance, InstanceAction } from "../instances.types";

export async function getInstance(projectId: string, instanceId: string): Promise<Instance> {
  return ovhGet<Instance>(`/cloud/project/${projectId}/instance/${instanceId}`);
}

export async function instanceAction(projectId: string, instanceId: string, action: InstanceAction): Promise<void> {
  switch (action) {
    case "start": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/start`, {});
    case "stop": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/stop`, {});
    case "reboot": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/reboot`, { type: "soft" });
    case "rescue": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/rescueMode`, { rescue: true });
    case "reinstall": return ovhPost(`/cloud/project/${projectId}/instance/${instanceId}/reinstall`, {});
    case "delete": return ovhDelete(`/cloud/project/${projectId}/instance/${instanceId}`);
    default: throw new Error(`Unknown action: ${action}`);
  }
}

export function getPublicIp(instance: Instance): string | null {
  return instance.ipAddresses.find(ip => ip.type === "public" && ip.version === 4)?.ip || null;
}

export const generalService = { getInstance, instanceAction, getPublicIp };
