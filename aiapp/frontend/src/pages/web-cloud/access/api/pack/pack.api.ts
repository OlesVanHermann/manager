// ============================================================
// API PACK XDSL - Endpoints /pack/xdsl/*
// Aligné avec old_manager: OvhApiPackXdsl
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface Pack {
  packName: string;
  description?: string;
  offerDescription?: string;
  status: string;
}

export interface PackServiceInfo {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo?: string;
  expiration: string;
  possibleRenewPeriod: number[];
  renew?: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period?: number;
  };
  renewalType: string;
  serviceId: number;
  status: string;
}

// ---------- API ----------

export const packApi = {
  /** Liste tous les packs xDSL. */
  async list(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  },

  /** Récupère les détails d'un pack. */
  async get(packName: string): Promise<Pack> {
    return ovhApi.get<Pack>(`/pack/xdsl/${packName}`);
  },

  /** Met à jour un pack (description). */
  async update(packName: string, data: { description?: string }): Promise<void> {
    await ovhApi.put(`/pack/xdsl/${packName}`, data);
  },

  /** Récupère les infos service. */
  async getServiceInfos(packName: string): Promise<PackServiceInfo> {
    return ovhApi.get<PackServiceInfo>(`/pack/xdsl/${packName}/serviceInfos`);
  },

  /** Récupère les services xDSL access du pack. */
  async getXdslAccessServices(packName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/pack/xdsl/${packName}/xdslAccess/services`);
  },

  /** Récupère tous les services disponibles dans le pack. */
  async getServices(packName: string): Promise<Array<{
    name: string;
    total: number;
    used: number;
    inCreation: number;
  }>> {
    return ovhApi.get(`/pack/xdsl/${packName}/services`);
  },

  /** Récupère le propriétaire du contact. */
  async getContactOwner(packName: string): Promise<string> {
    return ovhApi.get<string>(`/pack/xdsl/${packName}/contactOwner`);
  },
};
