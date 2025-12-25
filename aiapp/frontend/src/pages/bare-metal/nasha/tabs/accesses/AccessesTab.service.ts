// ############################################################
// #  NASHA/ACCESSES - SERVICE STRICTEMENT ISOLÉ              #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { NashaAccess } from "../../nasha.types";

class AccessesService {
  async getAccesses(serviceName: string): Promise<NashaAccess[]> {
    const partitions = await ovhApi.get<string[]>(`/dedicated/nasha/${serviceName}/partition`);
    const allAccesses: NashaAccess[] = [];
    for (const partitionName of partitions) {
      const ips = await ovhApi.get<string[]>(`/dedicated/nasha/${serviceName}/partition/${partitionName}/access`);
      for (const ip of ips) {
        const access = await ovhApi.get<NashaAccess>(`/dedicated/nasha/${serviceName}/partition/${partitionName}/access/${encodeURIComponent(ip)}`);
        allAccesses.push({ ...access, partitionName });
      }
    }
    return allAccesses;
  }

  async deleteAccess(serviceName: string, partitionName: string, ip: string): Promise<void> {
    return ovhApi.delete<void>(`/dedicated/nasha/${serviceName}/partition/${partitionName}/access/${encodeURIComponent(ip)}`);
  }
}

export const accessesService = new AccessesService();
