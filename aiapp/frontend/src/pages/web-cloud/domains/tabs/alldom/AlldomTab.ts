// ============================================================
// DOMAINS/ALLDOM - Service local isolé
// ============================================================

import { ovhApi } from '../../../../../services/api';
import type { AllDomPack, AllDomServiceInfo, AllDomEntry, AllDomDomain } from '../../domains.types';

// ============ API CALLS ============

export async function listAllDomPacks(): Promise<string[]> {
  return ovhApi.get<string[]>('/allDom');
}

export async function getAllDomResource(serviceName: string): Promise<{ currentState: AllDomPack }> {
  return ovh2Api.get<{ currentState: AllDomPack }>(`/domain/alldom/${serviceName}`);
}

export async function getServiceInfo(serviceName: string): Promise<AllDomServiceInfo> {
  const infos = await ovhApi.get<any>(`/allDom/${serviceName}/serviceInfos`);
  return {
    serviceId: infos.serviceId || 0,
    serviceName,
    creation: infos.creation,
    expiration: infos.expiration,
    renewMode: infos.renew?.automatic ? 'automatic' : 'manual',
    contactAdmin: infos.contactAdmin,
    contactTech: infos.contactTech,
    contactBilling: infos.contactBilling,
    isTerminating: infos.renew?.deleteAtExpiration || false,
  };
}

export async function getAllDomEntry(serviceName: string): Promise<AllDomEntry> {
  const [resource, serviceInfo] = await Promise.all([
    getAllDomResource(serviceName).catch(() => null),
    getServiceInfo(serviceName).catch(() => null),
  ]);
  return {
    serviceName,
    pack: resource?.currentState || { name: serviceName, type: 'FRENCH', domains: [], extensions: [] },
    serviceInfo,
  };
}

export async function listAllDomWithDetails(): Promise<AllDomEntry[]> {
  const names = await listAllDomPacks();
  return Promise.all(names.map(getAllDomEntry));
}

export async function terminateAllDom(serviceName: string): Promise<void> {
  const serviceIds = await ovhApi.get<number[]>(`/services?resourceName=${serviceName}&routes=/allDom`);
  if (serviceIds.length > 0) {
    await ovhApi.put(`/services/${serviceIds[0]}`, { terminationPolicy: 'terminateAtExpirationDate' });
  }
}

export async function cancelTermination(serviceName: string): Promise<void> {
  const serviceIds = await ovhApi.get<number[]>(`/services?resourceName=${serviceName}&routes=/allDom`);
  if (serviceIds.length > 0) {
    await ovhApi.put(`/services/${serviceIds[0]}`, { terminationPolicy: 'empty' });
  }
}

// ============ HELPERS ============

export function getTypeLabel(type: string): string {
  switch (type) {
    case 'FRENCH': return 'FR';
    case 'FRENCH+INTERNATIONAL': return 'FR + International';
    case 'INTERNATIONAL': return 'International';
    default: return type;
  }
}

export function getRegisteredCount(domains: AllDomDomain[]): number {
  return domains.filter(d => d.registrationStatus === 'REGISTERED').length;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
