import { ovhGet } from "../../../../../services/api";
import type { License } from "../../vmware.types";
export const licenseService = {
  getLicenses: (serviceName: string): Promise<License[]> => ovhGet<License[]>(`/dedicatedCloud/${serviceName}/vmwareLicense`).catch(() => []),
};
