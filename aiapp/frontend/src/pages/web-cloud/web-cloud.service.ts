// ============================================================
// SERVICE WEB-CLOUD DASHBOARD - Listing counts isolé
// ============================================================

import { ovhApi } from '../../services/api';

class WebCloudDashboardService {
  /** Liste les packs xDSL. */
  async listPacks(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  }

  /** Liste les services OverTheBox. */
  async listOvertheboxServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  }
}

export const webCloudDashboardService = new WebCloudDashboardService();
