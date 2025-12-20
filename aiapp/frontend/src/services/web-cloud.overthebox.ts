// ============================================================
// SERVICE WEB-CLOUD OVERTHEBOX - OverTheBox OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface OverTheBox {
  serviceName: string;
  customerDescription?: string;
  status: string;
  releaseChannel: string;
  systemVersion?: string;
  tunnelMode: string;
}

export interface Remote {
  remoteId: string;
  publicIp?: string;
  status: string;
  lastSeen?: string;
  exposedPort: number;
}

export interface Task {
  id: string;
  name: string;
  status: string;
  todoDate: string;
  doneDate?: string;
}

// ============================================================
// SERVICE
// ============================================================

class OvertheboxService {
  /** Liste tous les services OverTheBox. */
  async listServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  }

  /** Recupere les details d'un service. */
  async getService(serviceName: string): Promise<OverTheBox> {
    return ovhApi.get<OverTheBox>(`/overTheBox/${serviceName}`);
  }

  /** Recupere les acces distants. */
  async getRemotes(serviceName: string): Promise<Remote[]> {
    const ids = await ovhApi.get<string[]>(`/overTheBox/${serviceName}/remoteAccesses`);
    return Promise.all(ids.map(id => ovhApi.get<Remote>(`/overTheBox/${serviceName}/remoteAccesses/${id}`)));
  }

  /** Recupere les taches. */
  async getTasks(serviceName: string): Promise<Task[]> {
    const ids = await ovhApi.get<string[]>(`/overTheBox/${serviceName}/tasks`);
    const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhApi.get<Task>(`/overTheBox/${serviceName}/tasks/${id}`)));
    return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
  }
}

export const overtheboxService = new OvertheboxService();
