// ============================================================
// NETWORK VRACK SERVICES SERVICE - API vRack Services OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface VrackServices { id: string; displayName?: string; productStatus: string; region: string; createdAt: string; }
export interface Subnet { id: string; displayName?: string; cidr: string; serviceRange?: { cidr: string }; vlan?: number; }
export interface Endpoint { id: string; displayName?: string; managedServiceUrn: string; }

export async function getServices(): Promise<string[]> { return ovhGet<string[]>("/vrackServices"); }
export async function getService(id: string): Promise<VrackServices> { return ovhGet<VrackServices>(`/vrackServices/${id}`); }

export async function getSubnets(id: string): Promise<Subnet[]> {
  return ovhGet<Subnet[]>(`/vrackServices/${id}/subnet`).catch(() => []);
}

export async function getEndpoints(id: string): Promise<Endpoint[]> {
  return ovhGet<Endpoint[]>(`/vrackServices/${id}/endpoint`).catch(() => []);
}
