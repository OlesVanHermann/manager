// ============================================================
// SERVICES SERVICE - Gestion des services OVHcloud
// Utilise 2API pour les listes agrégées, APIv6 pour le détail
// ============================================================

import { ovhGet, ovh2apiGet } from "./api";
import type { BillingService, ServicesResponse, ServiceStatusFilter, ServiceStateFilter } from "../types/services.types";

// ============ TYPES ============

export interface ServiceCount {
  type: string;
  count: number;
}

export interface ServiceSummary {
  total: number;
  types: ServiceCount[];
}

// Types de services connus (fallback)
const SERVICE_TYPES = [
  { route: "/domain", label: "Noms de domaine", icon: "globe" },
  { route: "/hosting/web", label: "Hebergements Web", icon: "server" },
  { route: "/email/domain", label: "Emails", icon: "mail" },
  { route: "/vps", label: "VPS", icon: "cloud" },
  { route: "/dedicated/server", label: "Serveurs dedies", icon: "server" },
  { route: "/cloud/project", label: "Public Cloud", icon: "cloud" },
  { route: "/ip", label: "IP", icon: "network" },
  { route: "/dbaas/logs", label: "Logs Data Platform", icon: "database" },
];

// Mapping des types 2API vers labels français
const SERVICE_TYPE_LABELS: Record<string, string> = {
  "DOMAIN": "Noms de domaine",
  "HOSTING_WEB": "Hebergements Web",
  "HOSTING_PRIVATEDATABASE": "Bases de donnees",
  "EMAIL_DOMAIN": "Emails",
  "EMAIL_PRO": "Email Pro",
  "EMAIL_EXCHANGE": "Exchange",
  "VPS": "VPS",
  "DEDICATED_SERVER": "Serveurs dedies",
  "CLOUD": "Public Cloud",
  "PUBLIC_CLOUD": "Public Cloud",
  "IP_SERVICE": "IP",
  "IP": "IP",
  "VRACK": "vRack",
  "DBAAS_LOGS": "Logs Data Platform",
  "CDN": "CDN",
  "LOAD_BALANCER": "Load Balancer",
  "SSL": "Certificats SSL",
  "SMS": "SMS",
  "TELEPHONY": "Telephonie",
  "DEDICATED_CLOUD": "Hosted Private Cloud",
  "NUTANIX": "Nutanix",
};

// ============ 2API TYPES ============

interface BillingService2API {
  serviceId: number;
  serviceType: string;
  serviceName?: string;
  displayName?: string;
  state?: string;
  status?: string;
  expirationDate?: string;
  nextBillingDate?: string;
  renewalType?: string;
  plan?: string;
  offer?: string;
}

interface BillingServicesResponse {
  count: number;
  data: BillingService2API[];
}

// ============ SUMMARY (via 2API - 1 seul appel) ============

export async function getServicesSummary(): Promise<ServiceSummary> {
  try {
    // Appel 2API unique pour récupérer tous les services
    const response = await ovh2apiGet<BillingServicesResponse>(
      "/billing/services",
      { count: 1000, offset: 0 },
      { skipAuthRedirect: true }
    );

    if (!response || !response.data || response.data.length === 0) {
      return { total: 0, types: [] };
    }

    // Compter par type
    const typeCounts = new Map<string, number>();
    
    for (const service of response.data) {
      const typeKey = service.serviceType || "AUTRE";
      const label = SERVICE_TYPE_LABELS[typeKey] || typeKey;
      typeCounts.set(label, (typeCounts.get(label) || 0) + 1);
    }

    // Convertir en tableau trié par count décroissant
    const types: ServiceCount[] = Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total: response.data.length,
      types,
    };
  } catch (error) {
    console.warn("2API /billing/services non disponible, fallback APIv6:", error);
    return getServicesSummaryFallback();
  }
}

// Fallback via APIv6 (8 appels parallèles)
async function getServicesSummaryFallback(): Promise<ServiceSummary> {
  const results: ServiceCount[] = [];
  let total = 0;

  const promises = SERVICE_TYPES.map(async (serviceType) => {
    try {
      const services = await ovhGet<string[]>(serviceType.route, { skipAuthRedirect: true });
      if (services && services.length > 0) {
        return {
          type: serviceType.label,
          count: services.length,
          icon: serviceType.icon,
        };
      }
    } catch {
      // Service type not available or error - skip
    }
    return null;
  });

  const responses = await Promise.all(promises);
  
  for (const result of responses) {
    if (result) {
      results.push(result);
      total += result.count;
    }
  }

  results.sort((a, b) => b.count - a.count);

  return { total, types: results };
}

// ============ LISTE PAR TYPE ============

export async function getDomains(): Promise<string[]> {
  return ovhGet<string[]>("/domain");
}

export async function getHostings(): Promise<string[]> {
  return ovhGet<string[]>("/hosting/web");
}

export async function getVps(): Promise<string[]> {
  return ovhGet<string[]>("/vps");
}

export async function getDedicatedServers(): Promise<string[]> {
  return ovhGet<string[]>("/dedicated/server");
}

export async function getCloudProjects(): Promise<string[]> {
  return ovhGet<string[]>("/cloud/project");
}

// ============ SERVICES DETAILLES (2API + pagination) ============

export interface GetServicesParams {
  count?: number;
  offset?: number;
  search?: string;
  type?: string;
  status?: ServiceStatusFilter;
  state?: ServiceStateFilter;
  order?: { field: string; dir: "asc" | "desc" };
}

function mapServiceTypeLabel(apiType: string): string {
  return SERVICE_TYPE_LABELS[apiType] || apiType;
}

function map2APIToBillingService(service: BillingService2API): BillingService {
  // Mapper status/state
  let status: string = "ok";
  let state: string = "active";

  const apiState = (service.state || "").toLowerCase();
  const apiStatus = (service.status || "").toLowerCase();

  if (apiState === "expired" || apiStatus === "expired") {
    status = "expired";
    state = "expired";
  } else if (apiState === "suspended" || apiStatus === "suspended") {
    status = "expired";
    state = "suspended";
  } else if (apiStatus === "unpaid" || apiState === "unpaid") {
    status = "unPaid";
    state = "active";
  } else if (apiState === "torenew" || apiStatus === "torenew") {
    status = "ok";
    state = "toRenew";
  }

  return {
    id: service.serviceId,
    serviceId: service.serviceName || String(service.serviceId),
    serviceType: mapServiceTypeLabel(service.serviceType),
    status,
    state,
    expiration: service.expirationDate,
    resource: {
      displayName: service.displayName || service.serviceName,
      name: service.serviceName || String(service.serviceId),
    },
    renew: {
      automatic: service.renewalType !== "manual",
      period: undefined,
    },
    billing: {
      nextBillingDate: service.nextBillingDate,
      plan: service.plan ? { code: service.plan, name: service.offer } : undefined,
    },
  };
}

export async function getBillingServices(params: GetServicesParams = {}): Promise<ServicesResponse> {
  const {
    count = 25,
    offset = 0,
    search = "",
    type = "",
    status = "all",
    state = "all",
    order = { field: "expiration", dir: "asc" },
  } = params;

  try {
    // Utiliser 2API pour récupérer les services avec pagination
    const apiParams: Record<string, string | number> = {
      count: 1000, // Récupérer tout pour filtrer côté client
      offset: 0,
    };

    // Ajouter le tri si supporté
    if (order.field === "expiration") {
      apiParams.sort = "expirationDate";
      apiParams.sortOrder = order.dir;
    }

    const response = await ovh2apiGet<BillingServicesResponse>(
      "/billing/services",
      apiParams,
      { skipAuthRedirect: true }
    );

    if (!response || !response.data) {
      return {
        count: 0,
        list: { results: [] },
        servicesTypes: [],
      };
    }

    // Mapper les services
    let allServices = response.data.map(map2APIToBillingService);
    
    // Collecter les types uniques
    const typesSet = new Set<string>();
    for (const s of allServices) {
      typesSet.add(s.serviceType);
    }

    // Appliquer les filtres
    let filtered = allServices;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((s) =>
        s.serviceId.toLowerCase().includes(searchLower) ||
        s.resource?.name?.toLowerCase().includes(searchLower) ||
        s.resource?.displayName?.toLowerCase().includes(searchLower)
      );
    }

    if (type && type !== "all") {
      filtered = filtered.filter((s) => s.serviceType === type);
    }

    if (status && status !== "all") {
      filtered = filtered.filter((s) => s.status === status);
    }

    if (state && state !== "all") {
      filtered = filtered.filter((s) => s.state === state);
    }

    // Trier
    filtered.sort((a, b) => {
      let aVal: string | number | undefined;
      let bVal: string | number | undefined;

      switch (order.field) {
        case "expiration":
          aVal = a.expiration || "";
          bVal = b.expiration || "";
          break;
        case "name":
          aVal = a.resource?.displayName || a.serviceId;
          bVal = b.resource?.displayName || b.serviceId;
          break;
        case "type":
          aVal = a.serviceType;
          bVal = b.serviceType;
          break;
        default:
          aVal = a.expiration || "";
          bVal = b.expiration || "";
      }

      if (order.dir === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    // Paginer
    const totalCount = filtered.length;
    const paginated = filtered.slice(offset, offset + count);

    return {
      count: totalCount,
      list: { results: paginated },
      servicesTypes: Array.from(typesSet).sort(),
    };
  } catch (error) {
    console.warn("2API /billing/services non disponible, fallback:", error);
    return getBillingServicesFallback(params);
  }
}

// Fallback via APIv6
async function getBillingServicesFallback(params: GetServicesParams): Promise<ServicesResponse> {
  const allServices: BillingService[] = [];
  const typesSet = new Set<string>();

  const fetchPromises = SERVICE_TYPES.map(async (serviceType) => {
    try {
      const ids = await ovhGet<string[]>(serviceType.route, { skipAuthRedirect: true });
      if (ids && ids.length > 0) {
        return ids.map((id, index) => ({
          id: index,
          serviceId: id,
          serviceType: serviceType.label,
          status: "ok" as const,
          state: "active",
          resource: {
            name: id,
            displayName: id,
          },
          renew: { automatic: true },
        }));
      }
    } catch {
      // Skip
    }
    return [];
  });

  const results = await Promise.all(fetchPromises);
  for (const typeServices of results) {
    for (const service of typeServices) {
      allServices.push(service);
      typesSet.add(service.serviceType);
    }
  }

  // Appliquer filtres
  let filtered = allServices;
  const { search, type, offset = 0, count = 25 } = params;

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((s) => s.serviceId.toLowerCase().includes(searchLower));
  }

  if (type && type !== "all") {
    filtered = filtered.filter((s) => s.serviceType === type);
  }

  const paginated = filtered.slice(offset, offset + count);

  return {
    count: filtered.length,
    list: { results: paginated },
    servicesTypes: Array.from(typesSet).sort(),
  };
}

export async function getServiceTypes(): Promise<string[]> {
  const result = await getBillingServices({ count: 1 });
  return result.servicesTypes || [];
}
