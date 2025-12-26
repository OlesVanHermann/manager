import { ovhGet } from "../../../../services/api";
import type { CloudSnapshot } from "../project.types";

export async function listSnapshots(projectId: string): Promise<CloudSnapshot[]> {
  return ovhGet<CloudSnapshot[]>(`/cloud/project/${projectId}/snapshot`);
}

export const snapshotsService = { listSnapshots };
