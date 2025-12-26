// ============================================================
// VRACK SERVICES Subnets Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { VrackServicesSubnet } from "../../vrack-services.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatCidr(cidr: string): string {
  return cidr;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function getSubnets(id: string): Promise<VrackServicesSubnet[]> {
  return ovhGet<VrackServicesSubnet[]>(`/vrackServices/${id}/subnet`).catch(
    () => []
  );
}

async function getSubnet(
  id: string,
  subnetId: string
): Promise<VrackServicesSubnet> {
  return ovhGet<VrackServicesSubnet>(`/vrackServices/${id}/subnet/${subnetId}`);
}

async function createSubnet(
  id: string,
  data: { cidr: string; displayName?: string; vlan?: number }
): Promise<VrackServicesSubnet> {
  return ovhPost<VrackServicesSubnet>(`/vrackServices/${id}/subnet`, data);
}

async function updateSubnet(
  id: string,
  subnetId: string,
  data: { displayName?: string }
): Promise<VrackServicesSubnet> {
  return ovhPut<VrackServicesSubnet>(
    `/vrackServices/${id}/subnet/${subnetId}`,
    data
  );
}

async function deleteSubnet(id: string, subnetId: string): Promise<void> {
  return ovhDelete<void>(`/vrackServices/${id}/subnet/${subnetId}`);
}

// ==================== SERVICE OBJECT ====================

export const vrackservicesSubnetsService = {
  getSubnets,
  getSubnet,
  createSubnet,
  updateSubnet,
  deleteSubnet,
  formatCidr,
  formatDate,
};
