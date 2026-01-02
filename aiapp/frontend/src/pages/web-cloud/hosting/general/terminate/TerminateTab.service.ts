// ============================================================
// TERMINATE TAB SERVICE - API calls for service termination
// Ref: old_manager hosting.service.js terminate
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";

const BASE = "/hosting/web";

// ============ TYPES ============

export interface ServiceInfos {
  serviceId: number;
  status: string;
  domain: string;
  expiration: string;
  creation: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  renew: {
    automatic: boolean;
    forced: boolean;
    period?: string;
    deleteAtExpiration: boolean;
  };
}

export interface TerminationResult {
  success: boolean;
  message?: string;
}

// ============ SERVICE ============

export const terminateService = {
  // Get service infos (expiration, renewal, etc.)
  getServiceInfos: (serviceName: string): Promise<ServiceInfos> =>
    ovhGet<ServiceInfos>(`${BASE}/${serviceName}/serviceInfos`),

  // Terminate service (will be deleted at expiration date)
  terminate: (serviceName: string): Promise<void> =>
    ovhPost<void>(`${BASE}/${serviceName}/terminate`, {}),

  // Update service renewal settings (disable auto-renewal)
  updateServiceInfos: (
    serviceName: string,
    data: { renew: { automatic: boolean; deleteAtExpiration: boolean } }
  ): Promise<void> =>
    ovhPut<void>(`${BASE}/${serviceName}/serviceInfos`, data),

  // Cancel termination (re-enable auto-renewal)
  cancelTermination: (serviceName: string): Promise<void> =>
    ovhPut<void>(`${BASE}/${serviceName}/serviceInfos`, {
      renew: {
        automatic: true,
        deleteAtExpiration: false,
      },
    }),
};

export default terminateService;
