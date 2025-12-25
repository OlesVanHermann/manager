// ############################################################
// #  VPS/IPS - SERVICE STRICTEMENT ISOLÉ                     #
// ############################################################
import { ovhApi } from "../../../../../services/api";
import type { VpsIp } from "../../vps.types";

class IpsService {
  async listIps(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/vps/${serviceName}/ips`);
  }
  async getIp(serviceName: string, ipAddress: string): Promise<VpsIp> {
    return ovhApi.get<VpsIp>(`/vps/${serviceName}/ips/${ipAddress}`);
  }
}
export const ipsService = new IpsService();
