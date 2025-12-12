import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

export interface ServiceCount {
  type: string;
  count: number;
}

export interface ServiceSummary {
  total: number;
  types: ServiceCount[];
}

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, { method, headers });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// Types de services connus
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

export async function getServicesSummary(credentials: OvhCredentials): Promise<ServiceSummary> {
  const results: ServiceCount[] = [];
  let total = 0;

  const promises = SERVICE_TYPES.map(async (serviceType) => {
    try {
      const services = await ovhRequest<string[]>(credentials, "GET", serviceType.route);
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

export async function getDomains(credentials: OvhCredentials): Promise<string[]> {
  return ovhRequest<string[]>(credentials, "GET", "/domain");
}

export async function getHostings(credentials: OvhCredentials): Promise<string[]> {
  return ovhRequest<string[]>(credentials, "GET", "/hosting/web");
}

export async function getVps(credentials: OvhCredentials): Promise<string[]> {
  return ovhRequest<string[]>(credentials, "GET", "/vps");
}

export async function getDedicatedServers(credentials: OvhCredentials): Promise<string[]> {
  return ovhRequest<string[]>(credentials, "GET", "/dedicated/server");
}

export async function getCloudProjects(credentials: OvhCredentials): Promise<string[]> {
  return ovhRequest<string[]>(credentials, "GET", "/cloud/project");
}

// ============================================
// Billing Services API (liste complete des services)
// ============================================

import type { BillingService, ServicesResponse, ServiceStatusFilter, ServiceStateFilter } from "../types/services.types";

export interface GetServicesParams {
  count?: number;
  offset?: number;
  search?: string;
  type?: string;
  status?: ServiceStatusFilter;
  state?: ServiceStateFilter;
  order?: { field: string; dir: "asc" | "desc" };
}

// Types de services avec leurs routes API (fallback si /billing/services ne fonctionne pas)
const BILLING_SERVICE_TYPES = [
  { route: "/domain", type: "DOMAIN", label: "Noms de domaine" },
  { route: "/hosting/web", type: "HOSTING_WEB", label: "Hebergements Web" },
  { route: "/email/domain", type: "EMAIL_DOMAIN", label: "Emails" },
  { route: "/vps", type: "VPS", label: "VPS" },
  { route: "/dedicated/server", type: "DEDICATED_SERVER", label: "Serveurs dedies" },
  { route: "/cloud/project", type: "CLOUD_PROJECT", label: "Public Cloud" },
  { route: "/dbaas/logs", type: "DBAAS_LOGS", label: "Logs Data Platform" },
];

interface ServiceInfo {
  serviceId: number;
  creation: string;
  expiration?: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew?: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment?: boolean;
    period?: number;
  };
  canDeleteAtExpiration: boolean;
  domain: string;
}

async function getServiceInfo(
  credentials: OvhCredentials,
  route: string,
  serviceName: string
): Promise<ServiceInfo | null> {
  try {
    const url = `${API_BASE}${route}/${encodeURIComponent(serviceName)}/serviceInfos`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Ovh-App-Key": credentials.appKey,
      "X-Ovh-App-Secret": credentials.appSecret,
    };
    if (credentials.consumerKey) {
      headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
    }
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// Tentative d'appel a /billing/services (endpoint officiel OVH)
async function tryBillingServicesApi(
  credentials: OvhCredentials,
  params: GetServicesParams
): Promise<ServicesResponse | null> {
  const {
    count = 25,
    offset = 0,
    search = "",
    type = "",
    status = "all",
    state = "all",
    order = { field: "expiration", dir: "asc" },
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("count", count.toString());
  queryParams.set("offset", offset.toString());
  if (search) queryParams.set("search", search);
  if (type && type !== "all") queryParams.set("type", type);
  if (status && status !== "all") queryParams.set("status", status);
  if (state && state !== "all") queryParams.set("state", state);
  queryParams.set("order", JSON.stringify(order));

  const url = `${API_BASE}/billing/services?${queryParams.toString()}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// Fallback: agregation manuelle des services par type
async function fallbackGetServices(
  credentials: OvhCredentials,
  params: GetServicesParams
): Promise<ServicesResponse> {
  const {
    count = 25,
    offset = 0,
    search = "",
    type = "",
  } = params;

  const allServices: BillingService[] = [];
  const servicesTypes: string[] = [];

  const typesToFetch = type && type !== "all" 
    ? BILLING_SERVICE_TYPES.filter(t => t.type === type)
    : BILLING_SERVICE_TYPES;

  const typePromises = typesToFetch.map(async (serviceType) => {
    try {
      const services = await ovhRequest<string[]>(credentials, "GET", serviceType.route);
      if (!services || services.length === 0) return [];

      if (!servicesTypes.includes(serviceType.type)) {
        servicesTypes.push(serviceType.type);
      }

      const serviceInfoPromises = services.slice(0, 50).map(async (serviceName) => {
        const info = await getServiceInfo(credentials, serviceType.route, serviceName);
        
        const billingService: BillingService = {
          serviceId: info?.serviceId || 0,
          serviceName: serviceName,
          displayName: serviceName,
          type: serviceType.type,
          state: info?.status === "expired" ? "expired" : 
                 info?.status === "suspended" ? "suspended" : "active",
          status: info?.status === "ok" ? "ok" : 
                  info?.status === "expired" ? "expired" : 
                  info?.status === "unpaid" ? "unPaid" : "ok",
          expiration: info?.expiration || null,
          creation: info?.creation || null,
          renew: info?.renew ? {
            automatic: info.renew.automatic,
            manualPayment: info.renew.manualPayment || false,
            deleteAtExpiration: info.renew.deleteAtExpiration,
            period: info.renew.period || null,
          } : null,
        };
        
        return billingService;
      });

      return Promise.all(serviceInfoPromises);
    } catch {
      return [];
    }
  });

  const results = await Promise.all(typePromises);
  for (const serviceList of results) {
    allServices.push(...serviceList);
  }

  let filteredServices = allServices;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredServices = allServices.filter(s => 
      s.serviceName.toLowerCase().includes(searchLower) ||
      s.displayName?.toLowerCase().includes(searchLower)
    );
  }

  filteredServices.sort((a, b) => {
    const dateA = a.expiration ? new Date(a.expiration).getTime() : Infinity;
    const dateB = b.expiration ? new Date(b.expiration).getTime() : Infinity;
    return dateA - dateB;
  });

  const paginatedServices = filteredServices.slice(offset, offset + count);

  return {
    data: paginatedServices,
    count: filteredServices.length,
    offset,
    servicesTypes: servicesTypes.sort(),
  };
}

export async function getBillingServices(
  credentials: OvhCredentials,
  params: GetServicesParams = {}
): Promise<ServicesResponse> {
  const apiResult = await tryBillingServicesApi(credentials, params);
  if (apiResult) {
    return apiResult;
  }
  
  console.warn("getBillingServices: /billing/services non disponible, utilisation du fallback");
  return fallbackGetServices(credentials, params);
}

export async function getServiceTypes(credentials: OvhCredentials): Promise<string[]> {
  try {
    const result = await tryBillingServicesApi(credentials, { count: 1 });
    if (result?.servicesTypes) {
      return result.servicesTypes;
    }
  } catch {
    // Fallback
  }
  
  return BILLING_SERVICE_TYPES.map(t => t.type);
}
