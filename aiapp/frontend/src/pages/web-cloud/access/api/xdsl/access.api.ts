// ============================================================
// API XDSL ACCESS - Endpoints /xdsl/*
// Aligné avec old_manager: OvhApiXdsl
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslAccess {
  accessName: string;
  accessType: 'adsl' | 'vdsl' | 'sdsl' | 'ftth';
  description?: string;
  status: 'active' | 'doing' | 'migration' | 'upgradeOffer' | 'cancelled' | 'close' | 'deleting' | 'slamming';
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
  };
  nra?: string;
  provider?: string;
  providerInfra?: string;
  modemProfile?: string;
  mailSending?: 'enabled' | 'disabled';
  login?: string;
  ipv6Enabled?: boolean;
}

export interface XdslOrder {
  id: number;
  status: 'todo' | 'doing' | 'done' | 'error';
  doneDate?: string;
  orderDate: string;
}

// ---------- API ----------

export const xdslAccessApi = {
  /** Liste tous les accès xDSL. */
  async list(): Promise<string[]> {
    return ovhApi.get<string[]>('/xdsl');
  },

  /** Récupère les détails d'un accès. */
  async get(accessName: string): Promise<XdslAccess> {
    return ovhApi.get<XdslAccess>(`/xdsl/${accessName}`);
  },

  /** Met à jour un accès. */
  async update(accessName: string, data: Partial<XdslAccess>): Promise<void> {
    await ovhApi.put(`/xdsl/${accessName}`, data);
  },

  /** Récupère le suivi de commande. */
  async getOrderFollowup(accessName: string): Promise<XdslOrder[]> {
    return ovhApi.get<XdslOrder[]>(`/xdsl/${accessName}/orderFollowup`);
  },

  /** Demande l'envoi du login PPP par mail. */
  async requestPPPLoginMail(accessName: string): Promise<void> {
    await ovhApi.post(`/xdsl/${accessName}/requestPPPLoginMail`, {});
  },

  /** Demande la déconsolidation totale. */
  async requestTotalDeconsolidation(accessName: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/requestTotalDeconsolidation`, {});
  },

  /** Change le statut d'envoi de mail. */
  async updateMailSending(accessName: string, status: 'enabled' | 'disabled'): Promise<void> {
    await ovhApi.post(`/xdsl/${accessName}/mailSending`, { status });
  },

  /** Applique un template modem. */
  async applyTemplateToModem(accessName: string, templateName: string): Promise<void> {
    await ovhApi.post(`/xdsl/${accessName}/applyTemplateToModem`, { templateName });
  },

  /** Met à jour un RIO invalide ou manquant. */
  async updateInvalidOrMissingRio(accessName: string, rio: string): Promise<void> {
    await ovhApi.post(`/xdsl/${accessName}/updateInvalidOrMissingRio`, { rio });
  },
};
