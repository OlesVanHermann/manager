// ============================================================
// SERVICE ISOLÉ : TasksTab - Gestion des tâches domaine + zone
// Pattern identique old_manager avec /me/task/domain
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { DomainTask, ZoneTask } from "../../domains.types";

// ============ TYPES OPERATIONS ============

export interface DomainOperation {
  id: number;
  domain: string;
  function: string;
  status: "todo" | "doing" | "done" | "error" | "cancelled";
  creationDate: string;
  lastUpdate: string;
  comment?: string;
}

// ============ HELPERS LOCAUX (DUPLIQUÉS) ============

const formatDateTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============ SERVICE ============

class TasksService {
  // -------- DOMAIN TASKS --------
  /**
   * List domain task IDs
   * GET /domain/{domain}/task - Identique old_manager
   */
  async listDomainTasks(domain: string, params?: { status?: string; function?: string }): Promise<number[]> {
    let path = `/domain/${domain}/task`;
    const query: string[] = [];
    if (params?.status) query.push(`status=${params.status}`);
    if (params?.function) query.push(`function=${params.function}`);
    if (query.length) path += `?${query.join("&")}`;
    return ovhGet<number[]>(path);
  }

  /**
   * Get domain task details
   * GET /domain/{domain}/task/{id} - Identique old_manager
   */
  async getDomainTask(domain: string, id: number): Promise<DomainTask> {
    return ovhGet<DomainTask>(`/domain/${domain}/task/${id}`);
  }

  /**
   * List domain tasks with details (Pattern N+1 identique old_manager)
   */
  async listDomainTasksDetailed(domain: string, params?: { status?: string; function?: string }): Promise<DomainTask[]> {
    const ids = await this.listDomainTasks(domain, params);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id) => this.getDomainTask(domain, id)));
  }

  /**
   * Get tasks by multiple statuses (identique old_manager getTasksByStatus)
   */
  async getTasksByStatus(
    domain: string,
    fn: string,
    statuses: string[] = ["todo", "doing"]
  ): Promise<DomainTask[]> {
    const tasks = await Promise.all(
      statuses.map((status) => this.listDomainTasks(domain, { status, function: fn }))
    );
    const allIds = tasks.flat();
    if (allIds.length === 0) return [];
    return Promise.all(allIds.map((id) => this.getDomainTask(domain, id)));
  }

  // -------- ZONE TASKS --------
  /**
   * List zone task IDs
   * GET /domain/zone/{zone}/task - Identique old_manager
   */
  async listZoneTasks(zone: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/zone/${zone}/task`);
  }

  /**
   * Get zone task details
   * GET /domain/zone/{zone}/task/{id} - Identique old_manager
   */
  async getZoneTask(zone: string, id: number): Promise<ZoneTask> {
    return ovhGet<ZoneTask>(`/domain/zone/${zone}/task/${id}`);
  }

  /**
   * List zone tasks with details (Pattern N+1)
   */
  async listZoneTasksDetailed(zone: string): Promise<ZoneTask[]> {
    const ids = await this.listZoneTasks(zone);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id) => this.getZoneTask(zone, id)));
  }

  // -------- DOMAIN OPERATIONS (/me/task/domain - Identique old_manager) --------
  /**
   * Get all domain operations for the account
   * GET /me/task/domain - Identique old_manager getOperations()
   */
  async getOperations(params?: {
    domain?: string;
    function?: string;
    status?: string;
  }): Promise<number[]> {
    let path = "/me/task/domain";
    const query: string[] = [];
    if (params?.domain) query.push(`domain=${encodeURIComponent(params.domain)}`);
    if (params?.function) query.push(`function=${params.function}`);
    if (params?.status) query.push(`status=${params.status}`);
    if (query.length) path += `?${query.join("&")}`;
    return ovhGet<number[]>(path);
  }

  /**
   * Get operation details
   * GET /me/task/domain/{id} - Identique old_manager
   */
  async getOperation(id: number): Promise<DomainOperation> {
    return ovhGet<DomainOperation>(`/me/task/domain/${id}`);
  }

  /**
   * List operations with details (Pattern N+1)
   */
  async getOperationsDetailed(params?: {
    domain?: string;
    function?: string;
    status?: string;
  }): Promise<DomainOperation[]> {
    const ids = await this.getOperations(params);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id) => this.getOperation(id)));
  }

  // -------- PENDING TASKS (identique old_manager getTasksToPoll) --------
  /**
   * Get pending tasks to poll
   */
  async getTasksToPoll(
    domain: string,
    filters?: string[]
  ): Promise<DomainTask[]> {
    const [todoTasks, doingTasks] = await Promise.all([
      this.listDomainTasksDetailed(domain, { status: "todo" }),
      this.listDomainTasksDetailed(domain, { status: "doing" }),
    ]);

    let allTasks = [...todoTasks, ...doingTasks];

    // Filter by function if specified
    if (filters && filters.length > 0) {
      allTasks = allTasks.filter((task) => filters.includes(task.function));
    }

    return allTasks;
  }
}

export const tasksService = new TasksService();
export { formatDateTime };

// ============ DOMAIN OPERATION SERVICE (Identique old_manager domain-operation.service.js) ============

export interface DomainOperationArgument {
  key: string;
  value: string;
  type: string;
  acceptedFormats?: string[];
  acceptedValues?: string[];
  description?: string;
  maximumSize?: number;
  minimumSize?: number;
  readOnly: boolean;
}

export interface DomainOperationProgressBar {
  currentStep: number;
  expectedDoneDate?: string;
  followUpSteps: string[];
  lastUpdateDate: string;
  progress: number;
  taskActions: string[];
}

class DomainOperationService {
  // -------- DOMAIN OPERATIONS (/me/task/domain) --------

  /**
   * Get operation arguments
   * GET /me/task/domain/{id}/argument - Identique old_manager
   */
  async getOperationArguments(id: number): Promise<string[]> {
    return ovhGet<string[]>(`/me/task/domain/${id}/argument`);
  }

  /**
   * Get operation argument details
   * GET /me/task/domain/{id}/argument/{key} - Identique old_manager
   */
  async getOperationArgument(id: number, key: string): Promise<DomainOperationArgument> {
    return ovhGet<DomainOperationArgument>(`/me/task/domain/${id}/argument/${encodeURIComponent(key)}`);
  }

  /**
   * Update operation argument
   * PUT /me/task/domain/{id}/argument/{key} - Identique old_manager
   */
  async updateOperationArgument(id: number, key: string, data: { value: string }): Promise<void> {
    await ovhPut(`/me/task/domain/${id}/argument/${encodeURIComponent(key)}`, data);
  }

  /**
   * Relaunch a domain operation
   * POST /me/task/domain/{id}/relaunch - Identique old_manager
   */
  async relaunchOperation(id: number): Promise<void> {
    await ovhPost(`/me/task/domain/${id}/relaunch`, {});
  }

  /**
   * Cancel a domain operation
   * POST /me/task/domain/{id}/cancel - Identique old_manager
   */
  async cancelOperation(id: number): Promise<void> {
    await ovhPost(`/me/task/domain/${id}/cancel`, {});
  }

  /**
   * Accelerate a domain operation
   * POST /me/task/domain/{id}/accelerate - Identique old_manager
   */
  async accelerateOperation(id: number): Promise<void> {
    await ovhPost(`/me/task/domain/${id}/accelerate`, {});
  }

  /**
   * Get operation progress bar (domain transfer)
   * GET /me/task/domain/{id}/progressbar - Identique old_manager
   */
  async getOperationProgressBar(id: number): Promise<DomainOperationProgressBar> {
    return ovhGet<DomainOperationProgressBar>(`/me/task/domain/${id}/progressbar`);
  }

  /**
   * Get all operation arguments with details (Pattern N+1)
   */
  async getOperationArgumentsDetailed(id: number): Promise<DomainOperationArgument[]> {
    const keys = await this.getOperationArguments(id);
    if (keys.length === 0) return [];
    return Promise.all(keys.map((key) => this.getOperationArgument(id, key)));
  }

  // -------- DNS OPERATIONS (/me/task/dns) - Identique old_manager --------

  /**
   * Get DNS operations
   * GET /me/task/dns - Identique old_manager
   */
  async getDnsOperations(params?: { domain?: string; function?: string; status?: string }): Promise<number[]> {
    let path = "/me/task/dns";
    const query: string[] = [];
    if (params?.domain) query.push(`domain=${encodeURIComponent(params.domain)}`);
    if (params?.function) query.push(`function=${params.function}`);
    if (params?.status) query.push(`status=${params.status}`);
    if (query.length) path += `?${query.join("&")}`;
    return ovhGet<number[]>(path);
  }

  /**
   * Get DNS operation details
   * GET /me/task/dns/{id} - Identique old_manager
   */
  async getDnsOperation(id: number): Promise<DomainOperation> {
    return ovhGet<DomainOperation>(`/me/task/dns/${id}`);
  }

  /**
   * Relaunch a DNS operation
   * POST /me/task/dns/{id}/relaunch - Identique old_manager
   */
  async relaunchDnsOperation(id: number): Promise<void> {
    await ovhPost(`/me/task/dns/${id}/relaunch`, {});
  }

  /**
   * Cancel a DNS operation
   * POST /me/task/dns/{id}/cancel - Identique old_manager
   */
  async cancelDnsOperation(id: number): Promise<void> {
    await ovhPost(`/me/task/dns/${id}/cancel`, {});
  }

  /**
   * Accelerate a DNS operation
   * POST /me/task/dns/{id}/accelerate - Identique old_manager
   */
  async accelerateDnsOperation(id: number): Promise<void> {
    await ovhPost(`/me/task/dns/${id}/accelerate`, {});
  }

  /**
   * List DNS operations with details (Pattern N+1)
   */
  async getDnsOperationsDetailed(params?: { domain?: string; function?: string; status?: string }): Promise<DomainOperation[]> {
    const ids = await this.getDnsOperations(params);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id) => this.getDnsOperation(id)));
  }
}

export const domainOperationService = new DomainOperationService();
