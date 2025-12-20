// ============================================================
// SERVICE: ALLDOM - Gestion des packs AllDom
// ============================================================

import { ovhDirectGet, ovhDirectFetch } from "./api";

// ============ TYPES ============

export interface AllDomPack {
  name: string;
  type: "FRENCH" | "FRENCH+INTERNATIONAL" | "INTERNATIONAL";
  domains: AllDomDomain[];
  extensions: string[];
}

export interface AllDomDomain {
  name: string;
  registrationStatus: "REGISTERED" | "UNREGISTERED";
  expiresAt?: string;
}

export interface AllDomServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string | null;
    renew?: { current: { mode: "automatic" | "manual" | null; nextDate: string } } | null;
    lifecycle?: { current: { creationDate: string | null; pendingActions: string[] } } | null;
  };
  customer?: { contacts: { customerCode: string; type: string }[] };
  resource: { name: string };
}

export interface AllDomFullInfo {
  pack: AllDomPack;
  service: AllDomServiceInfo;
  nicAdmin: string;
  nicBilling: string;
  nicTechnical: string;
  renewMode: "automatic" | "manual" | null;
  expirationDate: string | null;
  creationDate: string | null;
  renewalDate: string | null;
  lifecyclePendingActions: string[];
}

// ============ SERVICE ============

class AllDomService {
  async listPacks(): Promise<string[]> {
    return ovhDirectGet<string[]>("/domain/alldom");
  }

  async getPack(serviceName: string): Promise<AllDomPack> {
    const data = await ovhDirectGet<{ currentState: AllDomPack }>(`/domain/alldom/${serviceName}`);
    return data.currentState;
  }

  async getServiceId(serviceName: string): Promise<number[]> {
    return ovhDirectGet<number[]>(`/services?resourceName=${encodeURIComponent(serviceName)}&routes=/allDom`);
  }

  async getServiceInfo(serviceId: number): Promise<AllDomServiceInfo> {
    return ovhDirectGet<AllDomServiceInfo>(`/services/${serviceId}`);
  }

  async getFullInfo(serviceName: string): Promise<AllDomFullInfo> {
    const pack = await this.getPack(serviceName);
    const serviceIds = await this.getServiceId(serviceName);
    if (!serviceIds || serviceIds.length === 0) throw new Error("Service non trouvé");
    const service = await this.getServiceInfo(serviceIds[0]);
    const contacts = service.customer?.contacts || [];
    const findContact = (type: string) => contacts.find(c => c.type.toLowerCase() === type.toLowerCase())?.customerCode || "";
    return {
      pack, service,
      nicAdmin: findContact("administrator"),
      nicBilling: findContact("billing"),
      nicTechnical: findContact("technical"),
      renewMode: service.billing.renew?.current?.mode || null,
      expirationDate: service.billing.expirationDate,
      creationDate: service.billing.lifecycle?.current?.creationDate || null,
      renewalDate: service.billing.renew?.current?.nextDate || null,
      lifecyclePendingActions: service.billing.lifecycle?.current?.pendingActions || [],
    };
  }

  async updateTermination(serviceId: number, terminationPolicy: "empty" | "terminateAtExpirationDate"): Promise<void> {
    await ovhDirectFetch<void>("PUT", `/services/${serviceId}`, { body: { terminationPolicy } });
  }
}

export const allDomService = new AllDomService();
