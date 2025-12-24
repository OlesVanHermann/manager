// ============================================================
// SERVICE ISOLÉ : DnssecTab - Gestion DNSSEC
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";
import type { DnssecStatus } from "../../domains.types";

// ============ SERVICE ============

class DnssecService {
  async getDnssecStatus(zone: string): Promise<DnssecStatus> {
    return ovhGet<DnssecStatus>(`/domain/zone/${zone}/dnssec`);
  }

  async enableDnssec(zone: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/dnssec`, {});
  }

  async disableDnssec(zone: string): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dnssec`);
  }
}

export const dnssecService = new DnssecService();
