// ############################################################
// #  VPS/GENERAL - SERVICE STRICTEMENT ISOLÉ                 #
// ############################################################
import { ovhApi } from "../../../../../services/api";
import type { Vps, VpsServiceInfos, VpsTask } from "../../vps.types";

class GeneralService {
  async listVps(): Promise<string[]> { return ovhApi.get<string[]>("/vps"); }
  async getVps(serviceName: string): Promise<Vps> { return ovhApi.get<Vps>(`/vps/${serviceName}`); }
  async getServiceInfos(serviceName: string): Promise<VpsServiceInfos> { return ovhApi.get<VpsServiceInfos>(`/vps/${serviceName}/serviceInfos`); }
  async reboot(serviceName: string): Promise<VpsTask> { return ovhApi.post<VpsTask>(`/vps/${serviceName}/reboot`, {}); }
  async start(serviceName: string): Promise<VpsTask> { return ovhApi.post<VpsTask>(`/vps/${serviceName}/start`, {}); }
  async stop(serviceName: string): Promise<VpsTask> { return ovhApi.post<VpsTask>(`/vps/${serviceName}/stop`, {}); }
}
export const generalService = new GeneralService();
