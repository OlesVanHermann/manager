import { ovhGet } from "../../../../services/api";
import type { CloudSshKey } from "../project.types";

export async function listSshKeys(projectId: string): Promise<CloudSshKey[]> {
  return ovhGet<CloudSshKey[]>(`/cloud/project/${projectId}/sshkey`);
}

export const sshKeysService = { listSshKeys };
