// ============================================================
// IP General Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { IpBlock } from "../../ip.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getTypeBadgeClass(type: string): string {
  const classes: Record<string, string> = {
    dedicated: "ip-general-badge-info",
    failover: "ip-general-badge-success",
    vps: "ip-general-badge-warning",
    cloud: "ip-general-badge-primary",
    vrack: "ip-general-badge-secondary",
  };
  return classes[type] || "ip-general-badge-secondary";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// ==================== API CALLS ====================

async function listIps(): Promise<string[]> {
  return ovhGet<string[]>("/ip");
}

async function getIp(ip: string): Promise<IpBlock> {
  return ovhGet<IpBlock>(`/ip/${encodeURIComponent(ip)}`);
}

async function getAllIpsWithDetails(): Promise<{ ip: string; details?: IpBlock }[]> {
  const ipList = await listIps();
  const results: { ip: string; details?: IpBlock }[] = [];
  
  // Charger par batch de 10
  for (let i = 0; i < ipList.length; i += 10) {
    const batch = ipList.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(async (ip) => {
        try {
          const details = await getIp(ip);
          return { ip, details };
        } catch {
          return { ip };
        }
      })
    );
    results.push(...batchResults);
  }
  
  return results;
}

// ==================== SERVICE OBJECT ====================

export const ipGeneralService = {
  listIps,
  getIp,
  getAllIpsWithDetails,
  getTypeBadgeClass,
  formatDate,
};
