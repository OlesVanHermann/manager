// ============================================================
// SERVICE: Managed WordPress (ManagedCMS API v2)
// ============================================================

import { apiClient } from "./api";

// ---------- TYPES ----------
export interface ManagedWordPress {
  serviceName: string;
  displayName?: string;
  state: "active" | "creating" | "deleting" | "error" | "importing";
  offer: string;
  datacenter: string;
  url?: string;
  adminUrl?: string;
  phpVersion?: string;
  wordpressVersion?: string;
  creationDate?: string;
  quota?: { used: number; size: number };
}

export interface ManagedWordPressTask {
  id: number;
  function: string;
  status: "todo" | "doing" | "done" | "error";
  startDate?: string;
  doneDate?: string;
  progress?: number;
}

export interface CreateWebsiteParams {
  domain: string;
  adminEmail: string;
  adminPassword: string;
  language?: string;
  title?: string;
}

export interface ImportWebsiteParams {
  domain: string;
  ftpUrl: string;
  ftpUser: string;
  ftpPassword: string;
  dbUrl?: string;
  dbUser?: string;
  dbPassword?: string;
}

// ---------- SERVICE ----------
class ManagedWordPressService {
  private basePath = "/managedCMS/resource";

  async listServices(): Promise<string[]> {
    const response = await apiClient.get<{ serviceName: string }[]>(this.basePath, { apiVersion: "v2" });
    return response.map(r => r.serviceName);
  }

  async getService(serviceName: string): Promise<ManagedWordPress> {
    return apiClient.get<ManagedWordPress>(`${this.basePath}/${serviceName}`, { apiVersion: "v2" });
  }

  async getServiceInfos(serviceName: string): Promise<any> {
    return apiClient.get(`/services/${encodeURIComponent(serviceName)}`);
  }

  async listWebsites(serviceName: string): Promise<any[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/website`, { apiVersion: "v2" });
  }

  async getWebsite(serviceName: string, websiteId: string): Promise<any> {
    return apiClient.get(`${this.basePath}/${serviceName}/website/${websiteId}`, { apiVersion: "v2" });
  }

  async createWebsite(serviceName: string, params: CreateWebsiteParams): Promise<ManagedWordPressTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/website`, params, { apiVersion: "v2" });
  }

  async importWebsite(serviceName: string, params: ImportWebsiteParams): Promise<ManagedWordPressTask> {
    return apiClient.post(`${this.basePath}/${serviceName}/website/import`, params, { apiVersion: "v2" });
  }

  async deleteWebsite(serviceName: string, websiteId: string): Promise<ManagedWordPressTask> {
    return apiClient.delete(`${this.basePath}/${serviceName}/website/${websiteId}`, { apiVersion: "v2" });
  }

  async listTasks(serviceName: string): Promise<ManagedWordPressTask[]> {
    return apiClient.get(`${this.basePath}/${serviceName}/task`, { apiVersion: "v2" });
  }

  async getTask(serviceName: string, taskId: number): Promise<ManagedWordPressTask> {
    return apiClient.get(`${this.basePath}/${serviceName}/task/${taskId}`, { apiVersion: "v2" });
  }
}

export const managedWordPressService = new ManagedWordPressService();
