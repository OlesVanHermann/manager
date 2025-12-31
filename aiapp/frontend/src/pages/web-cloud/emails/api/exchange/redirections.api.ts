// ============================================================
// API EXCHANGE - Redirections (via account forwarder)
// Note: Exchange uses account-level forwarding, not domain redirections
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/exchange";

// ---------- TYPES ----------

export interface ExchangeRedirection {
  id: string;
  from: string;
  to: string;
  localCopy: boolean;
}

// ---------- HELPERS ----------

function getServicePath(serviceId: string): string {
  const [org, service] = serviceId.includes("/")
    ? serviceId.split("/")
    : [serviceId, serviceId];
  return `${BASE}/${org}/service/${service}`;
}

// ---------- API CALLS ----------

// Note: Exchange doesn't have domain-level redirections like MX Plan
// Forwarding is configured per-account via forwardingTo property

export async function list(domain: string, serviceId?: string): Promise<ExchangeRedirection[]> {
  // Exchange: need to list accounts and check their forwardingTo
  // This is a simplified implementation
  return [];
}

export async function create(domain: string, data: { from: string; to: string; localCopy?: boolean }, serviceId?: string): Promise<ExchangeRedirection> {
  if (!serviceId) throw new Error("serviceId required for Exchange");

  const basePath = getServicePath(serviceId);
  const email = data.from;

  await apiFetch(`${basePath}/account/${email}`, {
    method: "PUT",
    body: JSON.stringify({
      forwardingTo: data.to,
      deleteAtExpiration: !data.localCopy,
    }),
  });

  return {
    id: email,
    from: data.from,
    to: data.to,
    localCopy: data.localCopy ?? false,
  };
}

export async function remove(domain: string, id: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required for Exchange");

  const basePath = getServicePath(serviceId);

  await apiFetch(`${basePath}/account/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      forwardingTo: null,
    }),
  });
}

export { remove as delete };
