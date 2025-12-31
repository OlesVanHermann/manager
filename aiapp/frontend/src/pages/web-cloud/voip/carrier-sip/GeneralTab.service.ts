// ============================================================
// GENERAL TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from "../../../../../../services/api";
import type { CarrierSip } from "../../carrier-sip.types";

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

async function listServices(): Promise<string[]> {
  return ovhApi.get<string[]>("/telephony");
}

async function getService(serviceName: string): Promise<CarrierSip> {
  return ovhApi.get<CarrierSip>(`/telephony/${serviceName}`);
}

async function listCarrierSip(billingAccount: string): Promise<string[]> {
  return ovhApi.get<string[]>(`/telephony/${billingAccount}/carrierSip`).catch(() => []);
}

async function getCarrierSip(billingAccount: string, serviceName: string): Promise<CarrierSip> {
  return ovhApi.get<CarrierSip>(`/telephony/${billingAccount}/carrierSip/${serviceName}`);
}

export const generalService = {
  listServices,
  getService,
  listCarrierSip,
  getCarrierSip,
};
