import { ovhGet } from "../../../../../services/api";
import type { DedicatedCloud } from "../../vmware.types";
export const generalService = {
  getService: (serviceName: string): Promise<DedicatedCloud> => ovhGet<DedicatedCloud>(`/dedicatedCloud/${serviceName}`),
};
