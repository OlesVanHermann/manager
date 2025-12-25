import { ovhGet } from "../../../../../services/api";
import type { Datacenter } from "../../vmware.types";
export const datacentersService = {
  getDatacenters: async (serviceName: string): Promise<Datacenter[]> => {
    const ids = await ovhGet<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
    return Promise.all(ids.map((id) => ovhGet<Datacenter>(`/dedicatedCloud/${serviceName}/datacenter/${id}`)));
  },
};
