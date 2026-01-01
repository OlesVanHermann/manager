// ============================================================
// ENDPOINTS TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { Endpoint } from "../carrier-sip.types";

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

// GET /telephony/{ba}/carrierSip - Liste des carrierSip
async function listCarrierSip(billingAccount: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/telephony/${billingAccount}/carrierSip`).catch(() => []);
}

// GET /telephony/{ba}/carrierSip/{sn}/endpoints - Liste des IDs d'endpoints
// GET /telephony/{ba}/carrierSip/{sn}/endpoints/{id} - Détail d'un endpoint
async function getEndpoints(billingAccount: string, serviceName: string): Promise<Endpoint[]> {
  try {
    // API correcte: d'abord lister les IDs
    const ids = await ovhApi.get<number[]>(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/endpoints`
    );
    // Puis récupérer les détails de chaque endpoint
    const endpoints = await Promise.all(
      ids.map(async (id) => {
        try {
          return await ovhApi.get<Endpoint>(
            `/telephony/${billingAccount}/carrierSip/${serviceName}/endpoints/${id}`
          );
        } catch {
          return null;
        }
      })
    );
    return endpoints.filter((e): e is Endpoint => e !== null);
  } catch {
    return [];
  }
}

async function getAllEndpoints(billingAccount: string): Promise<Endpoint[]> {
  const carriers = await listCarrierSip(billingAccount);
  const allEndpoints: Endpoint[] = [];
  for (const carrier of carriers) {
    const endpoints = await getEndpoints(billingAccount, carrier);
    allEndpoints.push(...endpoints);
  }
  return allEndpoints;
}

export const endpointsService = {
  listCarrierSip,
  getEndpoints,
  getAllEndpoints,
};
