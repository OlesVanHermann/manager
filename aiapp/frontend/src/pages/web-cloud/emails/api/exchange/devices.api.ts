// ============================================================
// API EXCHANGE - Appareils ActiveSync
// Endpoints: /email/exchange/{org}/service/{service}/device/*
// Exchange ONLY feature
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeDevice {
  identity: string;
  deviceId: string;
  deviceType: string;
  deviceModel?: string;
  deviceOS?: string;
  deviceUserAgent?: string;
  deviceIMEI?: string;
  deviceFriendlyName?: string;
  lastSyncAttemptTime?: string;
  lastSuccessSync?: string;
  state: "allowed" | "blocked" | "quarantined" | "deviceDiscovery";
  GUID?: string;
  taskPendingId?: number;
}

export type DeviceAction = "allow" | "block" | "wipe";

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

export async function list(serviceId: string): Promise<ExchangeDevice[]> {
  const basePath = getServicePath(serviceId);
  const ids = await apiFetch<string[]>(`${basePath}/device`);

  const devices = await Promise.all(
    ids.map(id => get(id, serviceId))
  );

  return devices;
}

export async function get(id: string, serviceId: string): Promise<ExchangeDevice> {
  const basePath = getServicePath(serviceId);
  return apiFetch<ExchangeDevice>(`${basePath}/device/${id}`);
}

export async function updateState(id: string, serviceId: string, state: "allowed" | "blocked"): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/device/${id}`, {
    method: "PUT",
    body: JSON.stringify({ state }),
  });
}

export async function remove(id: string, serviceId: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/device/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };

export async function wipe(id: string, serviceId: string): Promise<void> {
  const basePath = getServicePath(serviceId);
  await apiFetch(`${basePath}/device/${id}/clearDevice`, {
    method: "POST",
  });
}

// ---------- STATS ----------

export async function getStats(serviceId: string): Promise<{
  total: number;
  allowed: number;
  blocked: number;
  quarantined: number;
}> {
  const devices = await list(serviceId);

  return {
    total: devices.length,
    allowed: devices.filter(d => d.state === "allowed").length,
    blocked: devices.filter(d => d.state === "blocked").length,
    quarantined: devices.filter(d => d.state === "quarantined").length,
  };
}
