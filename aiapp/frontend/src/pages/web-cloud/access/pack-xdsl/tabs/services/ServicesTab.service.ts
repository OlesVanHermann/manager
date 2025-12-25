// ============================================================
// SERVICE SERVICES - Isolé pour ServicesTab (Pack xDSL)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { PackService } from '../../pack-xdsl.types';

class ServicesService {
  /** Récupère les services inclus dans un pack. */
  async getServices(packName: string): Promise<PackService[]> {
    const services: PackService[] = [];
    const types = ['domain', 'emailPro', 'exchangeAccount', 'hostedEmail', 'voipLine'];
    for (const type of types) {
      const svcList = await ovhApi.get<string[]>(`/pack/xdsl/${packName}/${type}/services`).catch(() => []);
      if (svcList.length > 0) {
        services.push({ name: type, type, used: svcList.length, total: svcList.length });
      }
    }
    return services;
  }
}

export const servicesService = new ServicesService();
