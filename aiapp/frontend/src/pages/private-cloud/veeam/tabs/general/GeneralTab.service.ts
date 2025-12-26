// ============================================================
// GENERAL TAB SERVICE - Isolé pour Veeam
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { VeeamService } from "../../veeam.types";

export const generalService = {
  getServices: (): Promise<string[]> =>
    ovhGet<string[]>("/veeam/veeamEnterprise").catch(() => []),

  getService: (serviceName: string): Promise<VeeamService> =>
    ovhGet<VeeamService>(`/veeam/veeamEnterprise/${serviceName}`),
};
