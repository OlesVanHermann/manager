// ============================================================
// OFFICE TYPES - Types partagés au niveau NAV2
// ============================================================

export interface OfficeTenant {
  id: number;
  serviceName: string;
  displayName: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  creationDate: string;
  status: 'creating' | 'ok' | 'suspended';
}

export interface OfficeTenantServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface OfficeUser {
  id: number;
  activationEmail: string;
  firstName: string;
  lastName: string;
  login: string;
  status: 'creating' | 'deleting' | 'ok' | 'suspended';
  licenses: string[];
  taskPendingId: number | null;
}

export interface OfficeDomain {
  domainName: string;
  status: 'creating' | 'deleting' | 'ok' | 'suspended';
  txtEntry: string;
}

export interface OfficeTask {
  id: number;
  function: string;
  status: 'cancelled' | 'doing' | 'done' | 'error' | 'todo';
  todoDate: string;
  finishDate: string | null;
}
