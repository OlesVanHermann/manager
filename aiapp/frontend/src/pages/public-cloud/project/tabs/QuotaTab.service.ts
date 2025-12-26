import { ovhGet } from "../../../../services/api";
import type { CloudQuota } from "../project.types";

export async function getQuota(projectId: string): Promise<CloudQuota[]> {
  return ovhGet<CloudQuota[]>(`/cloud/project/${projectId}/quota`);
}

export const quotaService = { getQuota };
