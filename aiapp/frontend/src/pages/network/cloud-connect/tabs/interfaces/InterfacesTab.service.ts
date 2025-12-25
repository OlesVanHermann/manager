// ============================================================
// CLOUD CONNECT Interfaces Tab - Service isolé
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CloudConnectInterface } from "../../cloud-connect.types";

// ==================== API CALLS ====================

export async function getInterfaces(uuid: string): Promise<CloudConnectInterface[]> {
  const ids = await ovhGet<number[]>(`/ovhCloudConnect/${uuid}/interface`);
  return Promise.all(
    ids.map((id) =>
      ovhGet<CloudConnectInterface>(`/ovhCloudConnect/${uuid}/interface/${id}`)
    )
  );
}

export async function getInterface(
  uuid: string,
  interfaceId: number
): Promise<CloudConnectInterface> {
  return ovhGet<CloudConnectInterface>(
    `/ovhCloudConnect/${uuid}/interface/${interfaceId}`
  );
}

export async function getInterfaceStatistics(
  uuid: string,
  interfaceId: number
): Promise<{ inOctets: number; outOctets: number }> {
  return ovhGet(`/ovhCloudConnect/${uuid}/interface/${interfaceId}/statistics`);
}

// ==================== HELPERS (DUPLIQUÉS - ISOLATION) ====================

export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    enabled: "badge-success",
    disabled: "badge-error",
  };
  return classes[status] || "";
}

export function getLightStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    up: "🟢",
    down: "🔴",
    unknown: "⚪",
  };
  return icons[status] || "⚪";
}

// ==================== SERVICE OBJECT ====================

export const interfacesService = {
  getInterfaces,
  getInterface,
  getInterfaceStatistics,
  getStatusBadgeClass,
  getLightStatusIcon,
};
