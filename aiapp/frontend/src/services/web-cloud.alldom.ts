// ============================================================
// SERVICE: AllDom API - Gestion des packs AllDom
// ============================================================

import { ovhGet, ovhPut, ovh2apiGet } from "./api";

// ============ TYPES ============

export type AllDomType = "FRENCH" | "FRENCH+INTERNATIONAL" | "INTERNATIONAL";
export type RenewMode = "automatic" | "manual";
export type RegistrationStatus = "REGISTERED" | "UNREGISTERED";

export interface AllDomDomain {
  name: string;
  registrationStatus: RegistrationStatus;
  expiresAt?: string;
  extension?: string;
}

export interface AllDomResource {
  currentState: {
    name: string;
    type: AllDomType;
    domains: AllDomDomain[];
    extensions: string[];
  };
}

export interface AllDomServiceInfo {
  serviceId: number;
  serviceName: string;
  creation: string;
  expiration: string;
  renewMode: RenewMode | null;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  isTerminating: boolean;
}

export interface AllDomEntry {
  serviceName: string;
  type: AllDomType;
  domains: AllDomDomain[];
  extensions: string[];
  serviceInfo: AllDomServiceInfo | null;
}

// ============ SERVICE ============

class AllDomService {
  async listAllDom(): Promise<string[]> {
    return ovhGet<string[]>("/allDom");
  }

  async getAllDomResource(serviceName: string): Promise<AllDomResource> {
    return ovh2apiGet<AllDomResource>(`/domain/alldom/${serviceName}`);
  }

  async getServiceInfo(serviceName: string): Promise<AllDomServiceInfo> {
    const serviceInfos = await ovhGet<any>(`/allDom/${serviceName}/serviceInfos`);
    return {
      serviceId: serviceInfos.serviceId || 0,
      serviceName: serviceName,
      creation: serviceInfos.creation,
      expiration: serviceInfos.expiration,
      renewMode: serviceInfos.renew?.automatic ? "automatic" : "manual",
      contactAdmin: serviceInfos.contactAdmin,
      contactTech: serviceInfos.contactTech,
      contactBilling: serviceInfos.contactBilling,
      isTerminating: serviceInfos.renew?.deleteAtExpiration || false,
    };
  }

  async getAllDom(serviceName: string): Promise<AllDomEntry> {
    const [resource, serviceInfo] = await Promise.all([
      this.getAllDomResource(serviceName).catch(() => null),
      this.getServiceInfo(serviceName).catch(() => null),
    ]);
    return {
      serviceName,
      type: resource?.currentState.type || "FRENCH",
      domains: resource?.currentState.domains || [],
      extensions: resource?.currentState.extensions || [],
      serviceInfo,
    };
  }

  async listAllDomWithDetails(): Promise<AllDomEntry[]> {
    const names = await this.listAllDom();
    return Promise.all(names.map((name) => this.getAllDom(name)));
  }

  async terminateAllDom(serviceName: string): Promise<void> {
    const serviceIds = await ovhGet<number[]>(`/services?resourceName=${serviceName}&routes=/allDom`);
    if (serviceIds.length > 0) {
      await ovhPut(`/services/${serviceIds[0]}`, { terminationPolicy: "terminateAtExpirationDate" });
    }
  }

  async terminateDomains(domainNames: string[]): Promise<void> {
    await Promise.all(
      domainNames.map(async (domain) => {
        const serviceIds = await ovhGet<number[]>(`/services?resourceName=${domain}&routes=/domain`);
        if (serviceIds.length > 0) {
          await ovhPut(`/services/${serviceIds[0]}`, { terminationPolicy: "terminateAtExpirationDate" });
        }
      })
    );
  }

  async cancelTermination(serviceName: string): Promise<void> {
    const serviceIds = await ovhGet<number[]>(`/services?resourceName=${serviceName}&routes=/allDom`);
    if (serviceIds.length > 0) {
      await ovhPut(`/services/${serviceIds[0]}`, { terminationPolicy: "empty" });
    }
  }

  async cancelDomainTerminations(domainNames: string[]): Promise<void> {
    await Promise.all(
      domainNames.map(async (domain) => {
        const serviceIds = await ovhGet<number[]>(`/services?resourceName=${domain}&routes=/domain`);
        if (serviceIds.length > 0) {
          await ovhPut(`/services/${serviceIds[0]}`, { terminationPolicy: "empty" });
        }
      })
    );
  }
}

export const allDomService = new AllDomService();
