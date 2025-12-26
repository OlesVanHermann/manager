// ============================================================
// GENERAL TAB SERVICE - Isolé pour SAP
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { SapService } from "../../sap.types";

export const generalService = {
  getServices: (): Promise<string[]> =>
    ovhGet<string[]>("/sap").catch(() => []),

  getService: (serviceName: string): Promise<SapService> =>
    ovhGet<SapService>(`/sap/${serviceName}`),
};
