// ============================================================
// CDN General Tab - Service isolé
// ============================================================
// Ce tab reçoit les données via props, pas d'appels API directs
// Les actions sont gérées localement

import { ovhPost } from "../../../../../services/api";
import type { CdnInfo } from "../../cdn.types";

// ==================== ACTIONS ====================

export async function purgeCache(serviceName: string, domain?: string): Promise<void> {
  const path = domain
    ? `/cdn/dedicated/${serviceName}/domains/${domain}/cache`
    : `/cdn/dedicated/${serviceName}/cache`;
  return ovhPost<void>(path, { flush: true });
}

export async function flushAll(serviceName: string): Promise<void> {
  return ovhPost<void>(`/cdn/dedicated/${serviceName}/flush`, {});
}

// ==================== SERVICE OBJECT ====================

export const generalService = {
  purgeCache,
  flushAll,
};
