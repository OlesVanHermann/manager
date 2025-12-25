// ============================================================
// SERVICES TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet, ovh2apiGet } from "../../../../../services/api";

// ============ TYPES ============

export interface ServiceCount {
  type: string;
  count: number;
}

export interface ServiceSummary {
  total: number;
  types: ServiceCount[];
}

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

// ============ CONSTANTS ============

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

// ============ SERVICES API ============

export async function getServicesSummary(): Promise<ServiceSummary> {
  try {
    const response = await ovh2apiGet<BillingServicesResponse>(
      "/billing/services",
      { count: 1000, offset: 0 },
      { skipAuthRedirect: true }
    );

    if (!response || !response.data || response.data.length === 0) {
      return { total: 0, types: [] };
    }

    const typeCounts = new Map<string, number>();
    
    for (const service of response.data) {
      const typeKey = service.serviceType || "AUTRE";
      const label = SERVICE_TYPE_LABELS[typeKey] || typeKey;
      typeCounts.set(label, (typeCounts.get(label) || 0) + 1);
    }

    const types: ServiceCount[] = Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return { total: response.data.length, types };
  } catch (error) {
    console.warn("2API /billing/services non disponible, fallback APIv6:", error);
    return getServicesSummaryFallback();
  }
}

async function getServicesSummaryFallback(): Promise<ServiceSummary> {
  const results: ServiceCount[] = [];
  let total = 0;

  const promises = SERVICE_TYPES.map(async (serviceType) => {
    try {
      const services = await ovhGet<string[]>(serviceType.route, { skipAuthRedirect: true });
      if (services && services.length > 0) {
        return { type: serviceType.label, count: services.length };
      }
    } catch {
      // Service type not available - skip
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

// ============ ALIAS ============

export async function getBillingServices(): Promise<ServiceSummary> {
  return getServicesSummary();
}
