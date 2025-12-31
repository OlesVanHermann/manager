// ============================================================
// API ZIMBRA - Redirections
// Zimbra utilise les alias pour les redirections
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/zimbra";

// ---------- TYPES ----------

export interface ZimbraRedirection {
  id: string;
  from: string;
  to: string;
  localCopy: boolean;
}

// ---------- HELPERS ----------

function parsePlatformId(serviceId: string): { org: string; platform: string } {
  const parts = serviceId.split("/");
  return {
    org: parts[0],
    platform: parts[1] || parts[0],
  };
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<ZimbraRedirection[]> {
  // Zimbra: redirections sont gérées via les alias
  // L'API ne fournit pas de redirections directes
  return [];
}

export async function create(domain: string, data: { from: string; to: string; localCopy?: boolean }, serviceId?: string): Promise<ZimbraRedirection> {
  if (!serviceId) throw new Error("serviceId required for Zimbra");

  // Créer un alias qui redirige
  const { org, platform } = parsePlatformId(serviceId);

  await apiFetch(`${BASE}/${org}/${platform}/alias`, {
    method: "POST",
    body: JSON.stringify({
      alias: data.from,
      targetAccount: data.to,
    }),
  });

  return {
    id: data.from,
    from: data.from,
    to: data.to,
    localCopy: data.localCopy ?? false,
  };
}

export async function remove(domain: string, id: string, serviceId?: string): Promise<void> {
  if (!serviceId) throw new Error("serviceId required for Zimbra");

  const { org, platform } = parsePlatformId(serviceId);
  await apiFetch(`${BASE}/${org}/${platform}/alias/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };
