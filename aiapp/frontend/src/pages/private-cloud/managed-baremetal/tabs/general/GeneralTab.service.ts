// ============================================================
// GENERAL TAB SERVICE - Isolé pour Managed Baremetal
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { ManagedBaremetalService } from "../../managed-baremetal.types";

export const generalService = {
  getServices: (): Promise<string[]> =>
    ovhGet<string[]>("/dedicatedCloud").catch(() => []),

  getService: (serviceName: string): Promise<ManagedBaremetalService> =>
    ovhGet<ManagedBaremetalService>(`/dedicatedCloud/${serviceName}`),
};
