// ############################################################
// #  NETAPP/SNAPSHOTS - SERVICE STRICTEMENT ISOLÉ            #
// ############################################################
import { ovhApi } from "../../../../../services/api";
import type { NetAppSnapshot } from "../../netapp.types";

class SnapshotsService {
  async getSnapshots(serviceId: string): Promise<NetAppSnapshot[]> {
    return ovhApi.get<NetAppSnapshot[]>(`/storage/netapp/${serviceId}/share/snapshot`);
  }
}
export const snapshotsService = new SnapshotsService();
