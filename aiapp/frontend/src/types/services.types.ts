export interface ServiceResource {
  name: string;
  displayName?: string;
  product?: {
    name: string;
    description?: string;
  };
}

export interface ServiceRoute {
  path?: string;
  url?: string;
  vars?: Array<{ key: string; value: string }>;
}

export interface ServiceRenew {
  automatic: boolean;
  deleteAtExpiration: boolean;
  forced: boolean;
  manualPayment?: boolean;
  period?: number;
}

export interface BillingService {
  id: number;
  serviceId: string;
  serviceType: string;
  resource: ServiceResource;
  route?: ServiceRoute;
  renew?: ServiceRenew;
  status: "ok" | "expired" | "unPaid" | "pendingDebt";
  state: "active" | "suspended" | "toRenew" | "expired";
  contactBilling?: string;
  contactAdmin?: string;
  contactTech?: string;
  creation?: string;
  expiration?: string;
  engagedUpTo?: string | null;
  canDeleteAtExpiration: boolean;
}

export interface ServicesResponse {
  count: number;
  list: {
    results: BillingService[];
  };
  servicesTypes?: string[];
}

export type ServiceStatusFilter = "ok" | "expired" | "unPaid" | "pendingDebt" | "all";
export type ServiceStateFilter = "active" | "suspended" | "toRenew" | "expired" | "all";
