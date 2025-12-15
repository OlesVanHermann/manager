// ============================================================
// CARBON SERVICE - Empreinte carbone OVHcloud
// ============================================================

import { ovhGet } from "./api";

// ============ TYPES ============

export interface CarbonFootprint {
  serviceName: string;
  serviceType: string;
  period: {
    from: string;
    to: string;
  };
  totalCO2eKg: number;
  breakdown: {
    manufacturing: number;
    electricity: number;
    operations: number;
  };
  datacenter?: string;
  methodology?: string;
}

export interface CarbonSummary {
  totalCO2eKg: number;
  totalServices: number;
  period: {
    from: string;
    to: string;
  };
  byCategory: {
    manufacturing: number;
    electricity: number;
    operations: number;
  };
  services: CarbonFootprint[];
}

export interface DedicatedServerCarbon {
  serviceName: string;
  carbonFootprint?: {
    total: number;
    manufacturing: number;
    electricity: number;
    operations: number;
  };
}

// ============ CARBON FOOTPRINT ============

/** Récupère la liste des serveurs dédiés. */
export async function getDedicatedServers(): Promise<string[]> {
  try {
    return await ovhGet<string[]>("/dedicated/server");
  } catch {
    return [];
  }
}

/** Récupère l'empreinte carbone d'un serveur dédié. */
export async function getServerCarbonFootprint(serviceName: string): Promise<DedicatedServerCarbon | null> {
  try {
    const carbon = await ovhGet<{
      total?: number;
      manufacturing?: number;
      electricity?: number;
      operations?: number;
    }>(`/dedicated/server/${serviceName}/carbonFootprint`);
    
    return {
      serviceName,
      carbonFootprint: {
        total: carbon.total || 0,
        manufacturing: carbon.manufacturing || 0,
        electricity: carbon.electricity || 0,
        operations: carbon.operations || 0,
      },
    };
  } catch {
    return null;
  }
}

/** Récupère l'empreinte carbone globale du compte. */
export async function getAccountCarbonFootprint(): Promise<CarbonSummary | null> {
  try {
    // Tenter l'API globale d'abord
    const summary = await ovhGet<CarbonSummary>("/me/consumption/carbonFootprint");
    return summary;
  } catch {
    // Fallback: agréger depuis les serveurs dédiés
    return await aggregateCarbonFromServers();
  }
}

/** Agrège l'empreinte carbone depuis les serveurs dédiés individuels. */
async function aggregateCarbonFromServers(): Promise<CarbonSummary | null> {
  try {
    const serverNames = await getDedicatedServers();
    if (serverNames.length === 0) return null;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const services: CarbonFootprint[] = [];
    let totalManufacturing = 0;
    let totalElectricity = 0;
    let totalOperations = 0;

    // Charger par batch de 5 pour éviter le rate-limit
    const batchSize = 5;
    for (let i = 0; i < Math.min(serverNames.length, 20); i += batchSize) {
      const batch = serverNames.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((name) => getServerCarbonFootprint(name))
      );

      for (const result of results) {
        if (result?.carbonFootprint) {
          const cf = result.carbonFootprint;
          services.push({
            serviceName: result.serviceName,
            serviceType: "Dedicated Server",
            period: { from: lastMonth.toISOString(), to: firstOfMonth.toISOString() },
            totalCO2eKg: cf.total,
            breakdown: {
              manufacturing: cf.manufacturing,
              electricity: cf.electricity,
              operations: cf.operations,
            },
          });
          totalManufacturing += cf.manufacturing;
          totalElectricity += cf.electricity;
          totalOperations += cf.operations;
        }
      }
    }

    if (services.length === 0) return null;

    return {
      totalCO2eKg: totalManufacturing + totalElectricity + totalOperations,
      totalServices: services.length,
      period: { from: lastMonth.toISOString(), to: firstOfMonth.toISOString() },
      byCategory: {
        manufacturing: totalManufacturing,
        electricity: totalElectricity,
        operations: totalOperations,
      },
      services,
    };
  } catch {
    return null;
  }
}

/** Télécharge le rapport CSV de l'empreinte carbone. */
export async function downloadCarbonReport(): Promise<Blob | null> {
  try {
    const response = await ovhGet<{ url: string }>("/me/consumption/carbonFootprint/export");
    if (response.url) {
      const fileResponse = await fetch(response.url);
      return await fileResponse.blob();
    }
    return null;
  } catch {
    return null;
  }
}
