// ############################################################
// #  VPS/SNAPSHOT - SERVICE STRICTEMENT ISOLÉ                #
// ############################################################
import { ovhApi } from "../../../../../services/api";
import type { VpsSnapshot } from "../../vps.types";

class SnapshotService {
  async getSnapshot(serviceName: string): Promise<VpsSnapshot | null> {
    try { return await ovhApi.get<VpsSnapshot>(`/vps/${serviceName}/snapshot`); }
    catch { return null; }
  }
  async createSnapshot(serviceName: string, description?: string): Promise<void> {
    return ovhApi.post<void>(`/vps/${serviceName}/createSnapshot`, { description });
  }
  async deleteSnapshot(serviceName: string): Promise<void> {
    return ovhApi.delete<void>(`/vps/${serviceName}/snapshot`);
  }
  async restoreSnapshot(serviceName: string): Promise<void> {
    return ovhApi.post<void>(`/vps/${serviceName}/snapshot/revert`, {});
  }
}
export const snapshotService = new SnapshotService();
