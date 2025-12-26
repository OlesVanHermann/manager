// ============================================================
// VRACK SERVICES Endpoints Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { VrackServicesEndpoint } from "../../vrack-services.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatUrn(urn: string): string {
  // Tronquer l'URN pour l'affichage si trop long
  if (urn.length > 60) {
    return urn.substring(0, 30) + "..." + urn.substring(urn.length - 20);
  }
  return urn;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function getEndpoints(id: string): Promise<VrackServicesEndpoint[]> {
  return ovhGet<VrackServicesEndpoint[]>(`/vrackServices/${id}/endpoint`).catch(
    () => []
  );
}

async function getEndpoint(
  id: string,
  endpointId: string
): Promise<VrackServicesEndpoint> {
  return ovhGet<VrackServicesEndpoint>(
    `/vrackServices/${id}/endpoint/${endpointId}`
  );
}

async function createEndpoint(
  id: string,
  data: { managedServiceUrn: string; displayName?: string }
): Promise<VrackServicesEndpoint> {
  return ovhPost<VrackServicesEndpoint>(`/vrackServices/${id}/endpoint`, data);
}

async function deleteEndpoint(
  id: string,
  endpointId: string
): Promise<void> {
  return ovhDelete<void>(`/vrackServices/${id}/endpoint/${endpointId}`);
}

// ==================== SERVICE OBJECT ====================

export const vrackservicesEndpointsService = {
  getEndpoints,
  getEndpoint,
  createEndpoint,
  deleteEndpoint,
  formatUrn,
  formatDate,
};
