// ============================================================
// API EMAIL PRO - Redirections
// Note: Email Pro uses external contacts for redirections
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/pro";

// ---------- TYPES ----------

export interface EmailProRedirection {
  id: string;
  from: string;
  to: string;
  localCopy: boolean;
}

// ---------- API CALLS ----------

export async function list(domain: string, serviceId?: string): Promise<EmailProRedirection[]> {
  if (!serviceId) return [];

  // Email Pro: redirections via externalContact
  try {
    const contacts = await apiFetch<string[]>(`${BASE}/${serviceId}/externalContact`);
    // Transform external contacts to redirection format
    // This is simplified - real implementation would need more logic
    return [];
  } catch {
    return [];
  }
}

export async function create(domain: string, data: { from: string; to: string; localCopy?: boolean }, serviceId?: string): Promise<EmailProRedirection> {
  if (!serviceId) throw new Error("serviceId required for Email Pro");

  // Create external contact for redirection
  await apiFetch(`${BASE}/${serviceId}/externalContact`, {
    method: "POST",
    body: JSON.stringify({
      displayName: data.from,
      externalEmailAddress: data.to,
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
  if (!serviceId) throw new Error("serviceId required for Email Pro");

  await apiFetch(`${BASE}/${serviceId}/externalContact/${id}`, {
    method: "DELETE",
  });
}

export { remove as delete };
