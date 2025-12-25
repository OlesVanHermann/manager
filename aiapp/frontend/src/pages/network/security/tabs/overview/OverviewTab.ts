// ============================================================
// SECURITY Overview Tab - Service isolé
// ============================================================

import { ovhPut } from "../../../../../services/api";
import type { SecurityIpInfo } from "../../security.types";

export async function changeMitigation(ipBlock: string, mitigation: "auto" | "permanent" | "off"): Promise<void> {
  return ovhPut<void>(`/ip/${encodeURIComponent(ipBlock)}/mitigation`, { mitigation });
}

export async function enableFirewall(ipBlock: string, ipOnFirewall: string): Promise<void> {
  return ovhPut<void>(`/ip/${encodeURIComponent(ipBlock)}/firewall/${ipOnFirewall}`, { enabled: true });
}

export function getMitigationBadgeClass(mitigation: string): string {
  const classes: Record<string, string> = { auto: "badge-success", permanent: "badge-info", off: "badge-secondary" };
  return classes[mitigation] || "";
}

export const overviewService = { changeMitigation, enableFirewall, getMitigationBadgeClass };
