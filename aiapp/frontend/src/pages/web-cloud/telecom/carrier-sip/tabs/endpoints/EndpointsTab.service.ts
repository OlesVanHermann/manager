// ============================================================
// ENDPOINTS TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from "../../../../../../services/api";
import type { Endpoint } from "../../carrier-sip.types";

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listCarrierSip(billingAccount: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/telephony/${billingAccount}/carrierSip`).catch(() => []);
}

async function getEndpoints(billingAccount: string, serviceName: string): Promise<Endpoint[]> {
  return ovhApi.get<Endpoint[]>(`/telephony/${billingAccount}/carrierSip/${serviceName}/endpoints`).catch(() => []);
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
