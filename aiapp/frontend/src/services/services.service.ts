import type { OvhCredentials } from "../types/auth.types";
import type { BillingService, ServicesResponse, ServiceStatusFilter, ServiceStateFilter } from "../types/services.types";

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

  // Fetch each service type in parallel
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

  // Sort by count descending
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
// Services API - Liste détaillée des services
// ============================================

// Structure retournée par GET /services/{id}
interface OvhServiceDetails {
  serviceId: number;
  serviceName: string;
  serviceType?: string;
  route?: {
    path: string;
    url?: string;
    vars?: { key: string; value: string }[];
  };
  billing?: {
    nextBillingDate?: string;
    expirationDate?: string;
    plan?: {
      code: string;
      name?: string;
    };
    pricing?: {
      text: string;
      value: number;
      currency: string;
    };
    lifecycle?: {
      current: {
        state: string;
      };
    };
  };
  resource?: {
    displayName?: string;
    name?: string;
    product?: {
      name?: string;
      description?: string;
    };
    resellingProvider?: string;
    state?: string;
  };
  customer?: {
    contacts?: {
      admin?: string;
      billing?: string;
      tech?: string;
    };
  };
}

export interface GetServicesParams {
  count?: number;
  offset?: number;
  search?: string;
  type?: string;
  status?: ServiceStatusFilter;
  state?: ServiceStateFilter;
  order?: { field: string; dir: "asc" | "desc" };
}

// Convertit les détails OVH vers notre format BillingService
function mapOvhServiceToBillingService(details: OvhServiceDetails): BillingService {
  const lifecycle = details.billing?.lifecycle?.current?.state || "active";
  
  // Map lifecycle state to our status/state
  let status: string;
  let state: string;
  
  switch (lifecycle) {
    case "active":
      status = "ok";
      state = "active";
      break;
    case "toRenew":
      status = "ok";
      state = "toRenew";
      break;
    case "suspended":
      status = "expired";
      state = "suspended";
      break;
    case "terminated":
    case "expired":
      status = "expired";
      state = "expired";
      break;
    case "unPaid":
      status = "unPaid";
      state = "active";
      break;
    default:
      status = "ok";
      state = lifecycle;
  }

  return {
    id: details.serviceId,
    serviceId: details.serviceName || String(details.serviceId),
    serviceType: details.serviceType || extractServiceType(details.route?.path),
    status,
    state,
    expiration: details.billing?.expirationDate,
    resource: {
      displayName: details.resource?.displayName,
      name: details.resource?.name || details.serviceName,
      product: details.resource?.product ? {
        name: details.resource.product.name,
        description: details.resource.product.description,
      } : undefined,
    },
    renew: {
      automatic: lifecycle !== "toRenew",
      period: undefined,
    },
    billing: details.billing ? {
      nextBillingDate: details.billing.nextBillingDate,
      plan: details.billing.plan,
      pricing: details.billing.pricing,
    } : undefined,
  };
}

function extractServiceType(path?: string): string {
  if (!path) return "Autre";
  
  // Extract type from path like "/domain/{domain}" → "domain"
  const match = path.match(/^\/([^/]+)/);
  if (!match) return "Autre";
  
  const typeMap: Record<string, string> = {
    "domain": "Noms de domaine",
    "hosting": "Hebergements Web",
    "email": "Emails",
    "vps": "VPS",
    "dedicated": "Serveurs dedies",
    "cloud": "Public Cloud",
    "ip": "IP",
    "dbaas": "Logs Data Platform",
  };
  
  return typeMap[match[1]] || match[1];
}

export async function getBillingServices(
  credentials: OvhCredentials,
  params: GetServicesParams = {}
): Promise<ServicesResponse> {
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
    // 1. Get list of all service IDs
    const serviceIds = await ovhRequest<number[]>(credentials, "GET", "/services");
    
    if (!serviceIds || serviceIds.length === 0) {
      return {
        count: 0,
        list: { results: [] },
        servicesTypes: [],
      };
    }

    // 2. Fetch details for each service (in parallel, with limit)
    const BATCH_SIZE = 20;
    const allDetails: BillingService[] = [];
    const typesSet = new Set<string>();

    for (let i = 0; i < serviceIds.length; i += BATCH_SIZE) {
      const batch = serviceIds.slice(i, i + BATCH_SIZE);
      const detailsPromises = batch.map(async (id) => {
        try {
          const details = await ovhRequest<OvhServiceDetails>(
            credentials,
            "GET",
            `/services/${id}`
          );
          return mapOvhServiceToBillingService(details);
        } catch {
          // Service detail not available
          return null;
        }
      });

      const batchResults = await Promise.all(detailsPromises);
      for (const result of batchResults) {
        if (result) {
          allDetails.push(result);
          typesSet.add(result.serviceType);
        }
      }
    }

    // 3. Apply filters
    let filtered = allDetails;

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

    // 4. Sort
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

    // 5. Paginate
    const totalCount = filtered.length;
    const paginated = filtered.slice(offset, offset + count);

    return {
      count: totalCount,
      list: { results: paginated },
      servicesTypes: Array.from(typesSet).sort(),
    };
  } catch (error) {
    console.error("getBillingServices error:", error);
    // Fallback: use getServicesSummary approach
    return getFallbackServices(credentials, params);
  }
}

// Fallback using the per-type approach
async function getFallbackServices(
  credentials: OvhCredentials,
  params: GetServicesParams
): Promise<ServicesResponse> {
  console.log("getBillingServices: /services non disponible, utilisation du fallback");
  
  const allServices: BillingService[] = [];
  const typesSet = new Set<string>();

  const fetchPromises = SERVICE_TYPES.map(async (serviceType) => {
    try {
      const ids = await ovhRequest<string[]>(credentials, "GET", serviceType.route);
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

  // Apply filters
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

export async function getServiceTypes(credentials: OvhCredentials): Promise<string[]> {
  const result = await getBillingServices(credentials, { count: 1 });
  return result.servicesTypes || [];
}
