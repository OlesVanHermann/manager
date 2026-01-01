// ============================================================
// API XDSL NOTIFICATIONS - Alertes de ligne
// Aligné avec old_manager: OvhApiXdslNotifications
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslNotification {
  id: number;
  frequency: 'once' | 'always';
  type: 'mail' | 'sms';
  email?: string;
  phone?: string;
  allowIncident: boolean;
  downThreshold?: number;
  smsAccount?: string;
}

// ---------- API ----------

export const xdslNotificationsApi = {
  /** Liste les IDs des notifications. */
  async list(accessName: string): Promise<number[]> {
    return ovhApi.get<number[]>(`/xdsl/${accessName}/monitoringNotifications`);
  },

  /** Récupère une notification. */
  async get(accessName: string, notificationId: number): Promise<XdslNotification> {
    return ovhApi.get<XdslNotification>(`/xdsl/${accessName}/monitoringNotifications/${notificationId}`);
  },

  /** Liste toutes les notifications avec détails. */
  async getAll(accessName: string): Promise<XdslNotification[]> {
    const ids = await this.list(accessName);
    return Promise.all(ids.map(id => this.get(accessName, id)));
  },

  /** Crée une notification. */
  async create(accessName: string, data: Omit<XdslNotification, 'id'>): Promise<XdslNotification> {
    return ovhApi.post<XdslNotification>(`/xdsl/${accessName}/monitoringNotifications`, data);
  },

  /** Met à jour une notification. */
  async update(accessName: string, notificationId: number, data: Partial<XdslNotification>): Promise<void> {
    await ovhApi.put(`/xdsl/${accessName}/monitoringNotifications/${notificationId}`, data);
  },

  /** Supprime une notification. */
  async delete(accessName: string, notificationId: number): Promise<void> {
    await ovhApi.delete(`/xdsl/${accessName}/monitoringNotifications/${notificationId}`);
  },
};
