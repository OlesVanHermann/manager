// ============================================================
// VRACK General Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPut } from "../../../../../services/api";
import type { Vrack, VrackServiceInfos } from "../../vrack.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("fr-FR");
}

// ==================== API CALLS ====================

async function getVrack(serviceName: string): Promise<Vrack> {
  return ovhGet<Vrack>(`/vrack/${serviceName}`);
}

async function getServiceInfos(serviceName: string): Promise<VrackServiceInfos> {
  return ovhGet<VrackServiceInfos>(`/vrack/${serviceName}/serviceInfos`);
}

async function updateDescription(serviceName: string, description: string): Promise<void> {
  return ovhPut<void>(`/vrack/${serviceName}`, { description });
}

// ==================== SERVICE OBJECT ====================

export const vrackGeneralService = {
  getVrack,
  getServiceInfos,
  updateDescription,
  formatDate,
  formatDateTime,
};
