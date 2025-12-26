import { ovhGet } from "../../../../services/api";
import type { CloudNetwork } from "../project.types";

export async function listNetworks(projectId: string): Promise<CloudNetwork[]> {
  return ovhGet<CloudNetwork[]>(`/cloud/project/${projectId}/network/private`);
}

export const networksService = { listNetworks };
