// ============================================================
// NASHA SERVICE ISOLÉ : SnapshotsTab
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { NashaSnapshot } from "../../nasha.types";

class SnapshotsService {
  async getSnapshots(serviceName: string): Promise<NashaSnapshot[]> {
    // Get all partitions first, then snapshots for each
    const partitions = await ovhApi.get<string[]>(`/dedicated/nasha/${serviceName}/partition`);
    const allSnapshots: NashaSnapshot[] = [];
    for (const partitionName of partitions) {
      const snapNames = await ovhApi.get<string[]>(`/dedicated/nasha/${serviceName}/partition/${partitionName}/snapshot`);
      for (const name of snapNames) {
        const snap = await ovhApi.get<NashaSnapshot>(`/dedicated/nasha/${serviceName}/partition/${partitionName}/snapshot/${name}`);
        allSnapshots.push({ ...snap, partitionName });
      }
    }
    return allSnapshots;
  }
}

export const snapshotsService = new SnapshotsService();
