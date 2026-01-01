// ============================================================
// API OVERTHEBOX SERVICE - Endpoints /overTheBox/*
// Aligné avec old_manager: OvhApiOverTheBox
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface OverTheBox {
  serviceName: string;
  customerDescription?: string;
  status: 'active' | 'suspended' | 'terminated';
  tunnelMode: string;
  releaseChannel: string;
  graphEndpoint?: {
    host: string;
    readToken: string;
    readTokenID: string;
  };
}

export interface OverTheBoxServiceInfos {
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

export const otbServiceApi = {
  /** Liste tous les services OverTheBox. */
  async list(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  },

  /** Récupère un service. */
  async get(serviceName: string): Promise<OverTheBox> {
    return ovhApi.get<OverTheBox>(`/overTheBox/${serviceName}`);
  },

  /** Met à jour un service (description). */
  async update(serviceName: string, data: { customerDescription?: string }): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}`, data);
  },

  /** Récupère les infos service. */
  async getServiceInfos(serviceName: string): Promise<OverTheBoxServiceInfos> {
    return ovhApi.get<OverTheBoxServiceInfos>(`/overTheBox/${serviceName}/serviceInfos`);
  },

  /** Met à jour les infos service. */
  async updateServiceInfos(serviceName: string, data: Partial<OverTheBoxServiceInfos>): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}/serviceInfos`, data);
  },

  /** Résilie le service. */
  async terminate(serviceName: string): Promise<void> {
    await ovhApi.delete(`/overTheBox/${serviceName}`);
  },

  /** Annule la résiliation. */
  async cancelResiliation(serviceName: string): Promise<void> {
    await ovhApi.post(`/overTheBox/${serviceName}/cancelResiliation`, {});
  },

  /** Récupère les offres disponibles. */
  async getAvailableOffers(): Promise<any[]> {
    return ovhApi.get<any[]>('/overTheBox/availableOffers');
  },

  /** Récupère les canaux de release disponibles. */
  async getAvailableReleaseChannels(serviceName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/availableReleaseChannels`);
  },

  /** Récupère les offres de migration. */
  async getMigrationOffers(serviceName: string): Promise<any[]> {
    return ovhApi.get<any[]>(`/overTheBox/${serviceName}/migration/offers`);
  },
};
