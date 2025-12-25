// ############################################################
// #  NASHA/PARTITIONS - SERVICE STRICTEMENT ISOLÉ            #
// #  AUCUN IMPORT DEPUIS UN AUTRE TAB                        #
// ############################################################

import { ovhApi } from "../../../../../services/api";
import type { NashaPartition } from "../../nasha.types";

class PartitionsService {
  async getPartitions(serviceName: string): Promise<NashaPartition[]> {
    const names = await ovhApi.get<string[]>(`/dedicated/nasha/${serviceName}/partition`);
    return Promise.all(
      names.map((name) => ovhApi.get<NashaPartition>(`/dedicated/nasha/${serviceName}/partition/${name}`))
    );
  }

  async deletePartition(serviceName: string, partitionName: string): Promise<void> {
    return ovhApi.delete<void>(`/dedicated/nasha/${serviceName}/partition/${partitionName}`);
  }
}

export const partitionsService = new PartitionsService();
