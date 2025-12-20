// ============================================================
// SERVICE WEB-CLOUD CARRIER SIP - Trunk SIP OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface CarrierSip {
  serviceName: string;
  description?: string;
  maxCalls: number;
  currentCalls: number;
  status: string;
}

export interface Endpoint {
  id: string;
  ip: string;
  priority: number;
  weight: number;
  status: string;
}

export interface CdrRecord {
  id: string;
  caller: string;
  callee: string;
  startDate: string;
  duration: number;
  status: string;
}

// ============================================================
// SERVICE
// ============================================================

class CarrierSipService {
  /** Liste tous les billing accounts (services telephonie). */
  async listServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony');
  }

  /** Recupere les details d'un service. */
  async getService(serviceName: string): Promise<CarrierSip> {
    return ovhApi.get<CarrierSip>(`/telephony/${serviceName}`);
  }

  /** Liste les carrier SIP d'un billing account. */
  async listCarrierSip(billingAccount: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/telephony/${billingAccount}/carrierSip`).catch(() => []);
  }

  /** Recupere les endpoints d'un carrier SIP. */
  async getEndpoints(billingAccount: string, serviceName: string): Promise<Endpoint[]> {
    return ovhApi.get<Endpoint[]>(`/telephony/${billingAccount}/carrierSip/${serviceName}/endpoints`).catch(() => []);
  }

  /** Recupere les CDR d'un billing account. */
  async getCdrRecords(billingAccount: string): Promise<CdrRecord[]> {
    return ovhApi.get<CdrRecord[]>(`/telephony/${billingAccount}/cdr`).catch(() => []);
  }
}

export const carrierSipService = new CarrierSipService();

// ============================================================
// EXPORTS INDIVIDUELS (compatibilite tabs existants)
// ============================================================

export async function getEndpoints(serviceName: string): Promise<Endpoint[]> {
  const carriers = await carrierSipService.listCarrierSip(serviceName);
  const allEndpoints: Endpoint[] = [];
  for (const carrier of carriers) {
    const endpoints = await carrierSipService.getEndpoints(serviceName, carrier);
    allEndpoints.push(...endpoints);
  }
  return allEndpoints;
}

export async function getCdrRecords(serviceName: string): Promise<CdrRecord[]> {
  return carrierSipService.getCdrRecords(serviceName);
}
