// ============================================================
// WEB CLOUD CARRIER SIP SERVICE - API Trunk SIP OVHcloud
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "./api";

export interface CarrierSip { serviceName: string; description?: string; maxCalls: number; currentCalls: number; status: string; }
export interface Endpoint { id: string; ip: string; priority: number; weight: number; status: string; }
export interface CdrRecord { id: string; caller: string; callee: string; startDate: string; duration: number; status: string; }

export async function getTrunks(): Promise<string[]> { return ovhGet<string[]>("/telephony"); }
export async function getTrunk(serviceName: string): Promise<CarrierSip> { return ovhGet<CarrierSip>(`/telephony/${serviceName}`); }

export async function getEndpoints(serviceName: string): Promise<Endpoint[]> {
  const carriers = await ovhGet<string[]>(`/telephony/${serviceName}/carrierSip`).catch(() => []);
  const allEndpoints: Endpoint[] = [];
  for (const carrier of carriers) {
    const endpoints = await ovhGet<Endpoint[]>(`/telephony/${serviceName}/carrierSip/${carrier}/endpoints`).catch(() => []);
    allEndpoints.push(...endpoints);
  }
  return allEndpoints;
}

export async function getCdrRecords(serviceName: string): Promise<CdrRecord[]> {
  return ovhGet<CdrRecord[]>(`/telephony/${serviceName}/cdr`).catch(() => []);
}
