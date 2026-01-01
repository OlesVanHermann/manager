// ============================================================
// GENERAL TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from "../../../../services/api";
import type { CarrierSip } from "./carrier-sip.types";

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

// GET /telephony/{ba}/carrierSip/{sn}/clusterDetails - Détails du cluster SIP
interface ClusterDetails {
  displayedNumber: string;
  displayNumberOnOutgoingCall: boolean;
  sipDomain: string;
  host: string;
  outboundProxy: string;
  port: number;
  realm: string;
  registrationRequired: boolean;
  rtpPort: { min: number; max: number };
}

async function getClusterDetails(billingAccount: string, serviceName: string): Promise<ClusterDetails | null> {
  try {
    return await ovhApi.get<ClusterDetails>(
      `/telephony/${billingAccount}/carrierSip/${serviceName}/clusterDetails`
    );
  } catch {
    return null;
  }
}

// GET /telephony/lines/{serviceName}/serviceInfos - Informations du service
interface ServiceInfos {
  domain: string;
  serviceId: number;
  creation: string;
  expiration: string;
  status: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    period: number;
  };
}

async function getServiceInfos(serviceName: string): Promise<ServiceInfos | null> {
  try {
    return await ovhApi.get<ServiceInfos>(`/telephony/lines/${serviceName}/serviceInfos`);
  } catch {
    return null;
  }
}

// PUT /telephony/{ba}/carrierSip/{sn} - Modifier le carrierSip
async function updateCarrierSip(billingAccount: string, serviceName: string, data: {
  description?: string;
}): Promise<void> {
  return ovhApi.put(`/telephony/${billingAccount}/carrierSip/${serviceName}`, data);
}

export const generalService = {
  listServices,
  getService,
  listCarrierSip,
  getCarrierSip,
  getClusterDetails,
  getServiceInfos,
  updateCarrierSip,
};
