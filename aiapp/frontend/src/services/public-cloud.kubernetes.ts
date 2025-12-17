import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface Cluster { id: string; name: string; region: string; version: string; status: string; url?: string; nodesCount: number; }
export interface NodePool { id: string; name: string; flavor: string; desiredNodes: number; currentNodes: number; minNodes: number; maxNodes: number; autoscale: boolean; status: string; }

export async function getClusters(projectId: string): Promise<string[]> { return ovhGet<string[]>(`/cloud/project/${projectId}/kube`); }
export async function getCluster(projectId: string, kubeId: string): Promise<Cluster> { return ovhGet<Cluster>(`/cloud/project/${projectId}/kube/${kubeId}`); }
export async function getNodePools(projectId: string, kubeId: string): Promise<NodePool[]> { return ovhGet<NodePool[]>(`/cloud/project/${projectId}/kube/${kubeId}/nodepool`); }
export async function getKubeconfig(projectId: string, kubeId: string): Promise<string> {
  const resp = await ovhPost<{ content: string }>(`/cloud/project/${projectId}/kube/${kubeId}/kubeconfig`, {});
  return resp.content;
}
