// ============================================================
// VRACK SERVICES Endpoints Tab - Service isolé
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { VrackServicesEndpoint } from "../../vrack-services.types";

// ==================== API CALLS ====================

export async function getEndpoints(id: string): Promise<VrackServicesEndpoint[]> {
  return ovhGet<VrackServicesEndpoint[]>(`/vrackServices/${id}/endpoint`).catch(
    () => []
  );
}

export async function getEndpoint(
  id: string,
  endpointId: string
): Promise<VrackServicesEndpoint> {
  return ovhGet<VrackServicesEndpoint>(
    `/vrackServices/${id}/endpoint/${endpointId}`
  );
}

export async function createEndpoint(
  id: string,
  data: { managedServiceUrn: string; displayName?: string }
): Promise<VrackServicesEndpoint> {
  return ovhPost<VrackServicesEndpoint>(`/vrackServices/${id}/endpoint`, data);
}

export async function deleteEndpoint(
  id: string,
  endpointId: string
): Promise<void> {
  return ovhDelete<void>(`/vrackServices/${id}/endpoint/${endpointId}`);
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function formatUrn(urn: string): string {
  // Tronquer l'URN pour l'affichage si trop long
  if (urn.length > 60) {
    return urn.substring(0, 30) + "..." + urn.substring(urn.length - 20);
  }
  return urn;
}

// ==================== SERVICE OBJECT ====================

export const endpointsService = {
  getEndpoints,
  getEndpoint,
  createEndpoint,
  deleteEndpoint,
  formatUrn,
};
