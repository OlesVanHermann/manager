import { ovhGet } from "../../../../services/api";
import type { CloudContainer } from "../project.types";

export async function listContainers(projectId: string): Promise<CloudContainer[]> {
  return ovhGet<CloudContainer[]>(`/cloud/project/${projectId}/storage`);
}

export const storageService = { listContainers };
