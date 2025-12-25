// ============================================================
// NETAPP - Service NIVEAU PAGE (pas niveau tab)
// Utilisé uniquement par index.tsx pour charger les données
// ============================================================

import { ovhApi } from "../../../services/api";
import type { NetAppInfo } from "./netapp.types";

class NetAppPageService {
  async getNetApp(id: string): Promise<NetAppInfo> {
    return ovhApi.get<NetAppInfo>(`/storage/netapp/${id}`);
  }
}

export const netappPageService = new NetAppPageService();
