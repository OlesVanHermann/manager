import { ovhGet } from "../../../../../services/api";
import type { SecurityPolicy } from "../../vmware.types";
export const securityService = {
  getSecurityPolicy: (serviceName: string): Promise<SecurityPolicy> => ovhGet<SecurityPolicy>(`/dedicatedCloud/${serviceName}/securityPolicy`),
};
