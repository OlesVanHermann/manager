import { ovhGet } from "../../../../services/api";
import type { CloudVolume } from "../project.types";

export async function listVolumes(projectId: string): Promise<CloudVolume[]> {
  return ovhGet<CloudVolume[]>(`/cloud/project/${projectId}/volume`);
}

export const volumesService = { listVolumes };
