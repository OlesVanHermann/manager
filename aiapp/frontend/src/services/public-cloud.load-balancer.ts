import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface LoadBalancer { id: string; name: string; region: string; status: string; vipAddress: string; flavor: string; }
export interface Listener { id: string; name: string; protocol: string; port: number; status: string; }
export interface Pool { id: string; name: string; protocol: string; algorithm: string; membersCount: number; status: string; }

export async function getLoadBalancers(projectId: string): Promise<string[]> { return ovhGet<string[]>(`/cloud/project/${projectId}/loadbalancer`); }
export async function getLoadBalancer(projectId: string, lbId: string): Promise<LoadBalancer> { return ovhGet<LoadBalancer>(`/cloud/project/${projectId}/loadbalancer/${lbId}`); }
export async function getListeners(projectId: string, lbId: string): Promise<Listener[]> { return ovhGet<Listener[]>(`/cloud/project/${projectId}/loadbalancer/${lbId}/listener`).catch(() => []); }
export async function getPools(projectId: string, lbId: string): Promise<Pool[]> { return ovhGet<Pool[]>(`/cloud/project/${projectId}/loadbalancer/${lbId}/pool`).catch(() => []); }
