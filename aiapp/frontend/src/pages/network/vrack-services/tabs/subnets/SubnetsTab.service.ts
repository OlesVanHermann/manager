// ============================================================
// VRACK SERVICES Subnets Tab - Service isolé
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { VrackServicesSubnet } from "../../vrack-services.types";

// ==================== API CALLS ====================

export async function getSubnets(id: string): Promise<VrackServicesSubnet[]> {
  return ovhGet<VrackServicesSubnet[]>(`/vrackServices/${id}/subnet`).catch(
    () => []
  );
}

export async function getSubnet(
  id: string,
  subnetId: string
): Promise<VrackServicesSubnet> {
  return ovhGet<VrackServicesSubnet>(`/vrackServices/${id}/subnet/${subnetId}`);
}

export async function createSubnet(
  id: string,
  data: { cidr: string; displayName?: string; vlan?: number }
): Promise<VrackServicesSubnet> {
  return ovhPost<VrackServicesSubnet>(`/vrackServices/${id}/subnet`, data);
}

export async function updateSubnet(
  id: string,
  subnetId: string,
  data: { displayName?: string }
): Promise<VrackServicesSubnet> {
  return ovhPut<VrackServicesSubnet>(
    `/vrackServices/${id}/subnet/${subnetId}`,
    data
  );
}

export async function deleteSubnet(id: string, subnetId: string): Promise<void> {
  return ovhDelete<void>(`/vrackServices/${id}/subnet/${subnetId}`);
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function formatCidr(cidr: string): string {
  return cidr;
}

// ==================== SERVICE OBJECT ====================

export const subnetsService = {
  getSubnets,
  getSubnet,
  createSubnet,
  updateSubnet,
  deleteSubnet,
  formatCidr,
};
