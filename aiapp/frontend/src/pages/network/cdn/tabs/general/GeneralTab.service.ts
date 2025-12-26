// ============================================================
// CDN General Tab - Service STRICTEMENT isolé
// NE JAMAIS importer depuis un autre tab
// ============================================================

import { ovhPost } from "../../../../../services/api";
import type { CdnInfo } from "../../cdn.types";

// ==================== HELPERS LOCAUX ====================
// Dupliqués volontairement pour isolation totale

const formatDate = (d: string): string => {
  return new Date(d).toLocaleDateString("fr-FR");
};

// ==================== ACTIONS ====================

async function purgeCache(serviceName: string, domain?: string): Promise<void> {
  const path = domain
    ? `/cdn/dedicated/${serviceName}/domains/${domain}/cache`
    : `/cdn/dedicated/${serviceName}/cache`;
  return ovhPost<void>(path, { flush: true });
}

async function flushAll(serviceName: string): Promise<void> {
  return ovhPost<void>(`/cdn/dedicated/${serviceName}/flush`, {});
}

// ==================== SERVICE OBJECT ====================

export const cdnGeneralService = {
  purgeCache,
  flushAll,
  formatDate,
};
