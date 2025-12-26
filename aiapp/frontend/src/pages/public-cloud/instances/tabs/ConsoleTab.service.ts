import { ovhPost } from "../../../../services/api";

export async function getConsoleUrl(projectId: string, instanceId: string): Promise<string> {
  const resp = await ovhPost<{ url: string }>(`/cloud/project/${projectId}/instance/${instanceId}/vnc`, {});
  return resp.url;
}

export const consoleService = { getConsoleUrl };
