// ============================================================
// SERVICE OFFICE - Microsoft 365 Licenses OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
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

export interface OfficeLicense {
  id: number;
  licenseId: number;
  firstName: string;
  lastName: string;
  login: string;
  activationEmail: string;
  serviceName: string;
  status: 'ok' | 'pending' | 'suspended';
  isVirtual: boolean;
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

// ============================================================
// SERVICE
// ============================================================

class OfficeService {
  async listTenants(): Promise<string[]> {
    return ovhApi.get<string[]>('/license/office');
  }

  async getTenant(serviceName: string): Promise<OfficeTenant> {
    return ovhApi.get<OfficeTenant>(`/license/office/${serviceName}`);
  }

  async getServiceInfos(serviceName: string): Promise<OfficeTenantServiceInfos> {
    return ovhApi.get<OfficeTenantServiceInfos>(`/license/office/${serviceName}/serviceInfos`);
  }

  // ---------- Users ----------
  async listUsers(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/license/office/${serviceName}/user`);
  }

  async getUser(serviceName: string, id: number): Promise<OfficeUser> {
    return ovhApi.get<OfficeUser>(`/license/office/${serviceName}/user/${id}`);
  }

  // ---------- Domains ----------
  async listDomains(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/license/office/${serviceName}/domain`);
  }

  async getDomain(serviceName: string, domainName: string): Promise<OfficeDomain> {
    return ovhApi.get<OfficeDomain>(`/license/office/${serviceName}/domain/${domainName}`);
  }

  // ---------- Tasks ----------
  async listTasks(serviceName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/license/office/${serviceName}/task`);
  }

  async getTask(serviceName: string, id: number): Promise<OfficeTask> {
    return ovhApi.get<OfficeTask>(`/license/office/${serviceName}/task/${id}`);
  }

  // ---------- Usage Statistics ----------
  async getUsageStatistics(serviceName: string): Promise<{ date: string; lines: { licenseId: number; peakCount: number }[] }[]> {
    return ovhApi.get(`/license/office/${serviceName}/usageStatistics`);
  }
}

export const officeService = new OfficeService();
