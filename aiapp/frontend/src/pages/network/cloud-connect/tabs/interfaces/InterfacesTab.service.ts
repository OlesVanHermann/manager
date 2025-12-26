// ============================================================
// CLOUD CONNECT Interfaces Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CloudConnectInterface } from "../../cloud-connect.types";

// ==================== HELPERS LOCAUX (DUPLIQUÉS - ISOLATION) ====================

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    enabled: "cloudconnect-interfaces-badge-success",
    disabled: "cloudconnect-interfaces-badge-error",
  };
  return classes[status] || "";
}

function getLightStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    up: "🟢",
    down: "🔴",
    unknown: "⚪",
  };
  return icons[status] || "⚪";
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-FR");
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${bytes} B`;
}

// ==================== API CALLS ====================

async function getInterfaces(uuid: string): Promise<CloudConnectInterface[]> {
  const ids = await ovhGet<number[]>(`/ovhCloudConnect/${uuid}/interface`);
  return Promise.all(
    ids.map((id) =>
      ovhGet<CloudConnectInterface>(`/ovhCloudConnect/${uuid}/interface/${id}`)
    )
  );
}

async function getInterface(
  uuid: string,
  interfaceId: number
): Promise<CloudConnectInterface> {
  return ovhGet<CloudConnectInterface>(
    `/ovhCloudConnect/${uuid}/interface/${interfaceId}`
  );
}

async function getInterfaceStatistics(
  uuid: string,
  interfaceId: number
): Promise<{ inOctets: number; outOctets: number }> {
  return ovhGet(`/ovhCloudConnect/${uuid}/interface/${interfaceId}/statistics`);
}

// ==================== SERVICE OBJECT ====================

export const cloudconnectInterfacesService = {
  getInterfaces,
  getInterface,
  getInterfaceStatistics,
  getStatusBadgeClass,
  getLightStatusIcon,
  formatDate,
  formatBytes,
};
