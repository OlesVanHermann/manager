import { ovhGet } from "../../../../../services/api";
import type { Host } from "../../vmware.types";
export const hostsService = {
  getHosts: async (serviceName: string): Promise<Host[]> => {
    const dcs = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
    const allHosts: Host[] = [];
    for (const dcId of dcs) {
      const hostIds = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/host`);
      const hosts = await Promise.all(hostIds.map((id) => ovhGet<Host>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/host/${id}`)));
      allHosts.push(...hosts);
    }
    return allHosts;
  },
};
export const formatRam = (gb: number): string => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
export const getHostStateBadgeClass = (state: string): string => ({ delivered: "badge-success", toDeliver: "badge-warning", error: "badge-error" })[state] || "";
