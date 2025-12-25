// ############################################################
// #  VPS/DISKS - SERVICE STRICTEMENT ISOLÉ                   #
// ############################################################
import { ovhApi } from "../../../../../services/api";
import type { VpsDisk } from "../../vps.types";

class DisksService {
  async listDisks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/vps/${serviceName}/disks`);
  }
  async getDisk(serviceName: string, id: number): Promise<VpsDisk> {
    return ovhApi.get<VpsDisk>(`/vps/${serviceName}/disks/${id}`);
  }
}
export const disksService = new DisksService();
