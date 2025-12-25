import { ovhGet } from "../../../../../services/api";
import type { Datastore } from "../../vmware.types";
export const datastoresService = {
  getDatastores: async (serviceName: string): Promise<Datastore[]> => {
    const dcs = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
    const allDs: Datastore[] = [];
    for (const dcId of dcs) {
      const filerIds = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/filer`);
      const filers = await Promise.all(filerIds.map((id) => ovhGet<Datastore>(`/dedicatedCloud/${serviceName}/datacenter/${dcId}/filer/${id}`)));
      allDs.push(...filers);
    }
    return allDs;
  },
};
export const formatSize = (gb: number): string => gb >= 1024 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`;
export const getUsagePercent = (total: number, free: number): number => Math.round(((total - free) / total) * 100);
export const getUsageClass = (percent: number): string => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";
