// ============================================================
// SERVICE WEB-CLOUD PACK XDSL - Pack Internet OVHcloud
// ============================================================

import { ovhApi } from './api';

// ============================================================
// TYPES
// ============================================================

export interface Pack {
  packName: string;
  description?: string;
  offerDescription: string;
  capabilities: { isLegacyOffer: boolean; canMoveAddress: boolean };
}

export interface XdslAccess {
  accessName: string;
  accessType: string;
  status: string;
  address: { city: string; street: string; zipCode: string };
  connectionStatus: string;
  ipv4?: string;
  ipv6?: string;
}

export interface VoipLine {
  serviceName: string;
  number: string;
  description?: string;
  status: string;
}

export interface PackService {
  name: string;
  type: string;
  domain?: string;
  used: number;
  total: number;
}

export interface Task {
  id: number;
  function: string;
  status: string;
  todoDate: string;
  doneDate?: string;
}

// ============================================================
// SERVICE
// ============================================================

class PackXdslService {
  /** Liste tous les packs xDSL. */
  async listPacks(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  }

  /** Recupere les details d'un pack. */
  async getPack(packName: string): Promise<Pack> {
    return ovhApi.get<Pack>(`/pack/xdsl/${packName}`);
  }

  /** Recupere les acces xDSL d'un pack. */
  async getAccesses(packName: string): Promise<XdslAccess[]> {
    const ids = await ovhApi.get<string[]>(`/pack/xdsl/${packName}/xdslAccess/services`);
    return Promise.all(ids.map(id => ovhApi.get<XdslAccess>(`/xdsl/${id}`)));
  }

  /** Recupere les lignes VoIP d'un pack. */
  async getVoipLines(packName: string): Promise<VoipLine[]> {
    const ids = await ovhApi.get<string[]>(`/pack/xdsl/${packName}/voipLine/services`).catch(() => []);
    return Promise.all(ids.map(id => 
      ovhApi.get<VoipLine>(`/telephony/${id.split("/")[0]}/line/${id}`)
        .catch(() => ({ serviceName: id, number: id, status: "unknown", description: "" }))
    ));
  }

  /** Recupere les services inclus dans un pack. */
  async getServices(packName: string): Promise<PackService[]> {
    const services: PackService[] = [];
    const types = ["domain", "emailPro", "exchangeAccount", "hostedEmail", "voipLine"];
    for (const type of types) {
      const svcList = await ovhApi.get<string[]>(`/pack/xdsl/${packName}/${type}/services`).catch(() => []);
      if (svcList.length > 0) services.push({ name: type, type, used: svcList.length, total: svcList.length });
    }
    return services;
  }

  /** Recupere les taches d'un pack. */
  async getTasks(packName: string): Promise<Task[]> {
    const ids = await ovhApi.get<number[]>(`/pack/xdsl/${packName}/tasks`);
    const tasks = await Promise.all(ids.slice(0, 50).map(id => ovhApi.get<Task>(`/pack/xdsl/${packName}/tasks/${id}`)));
    return tasks.sort((a, b) => new Date(b.todoDate).getTime() - new Date(a.todoDate).getTime());
  }
}

export const packXdslService = new PackXdslService();
