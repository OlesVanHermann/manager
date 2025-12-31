// ============================================================
// SERVICE LINE TAB - Isolé pour statut/diagnostic/stats ligne
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { LineStatus, LineDiagnostic, LineStats, LineAlert, Task } from '../connections.types';

// ---------- HELPERS LOCAUX ----------

const mapToLineStatus = (xdsl: any, ips: any): LineStatus => {
  return {
    status: xdsl.status === 'active' ? 'connected' : 'disconnected',
    ipv4: ips?.[0]?.ip || '',
    ipv6: ips?.find((i: any) => i.version === 6)?.ip,
    gateway: ips?.[0]?.dnsList?.[0] || '',
    dns: ips?.[0]?.dnsList || [],
    downSpeed: xdsl.accessCurrentSpeed?.down || 0,
    upSpeed: xdsl.accessCurrentSpeed?.up || 0,
    maxDownSpeed: xdsl.accessMaxSpeed?.down || 0,
    maxUpSpeed: xdsl.accessMaxSpeed?.up || 0,
    attenuation: 0,
    noiseMargin: 0,
    crcErrors: 0,
    lastSync: xdsl.lastSyncDate || '',
    connectedSince: '',
    nro: xdsl.nra || '',
  };
};

// ---------- SERVICE ----------

export const lineService = {
  /** Statut de la ligne. */
  async getLineStatus(connectionId: string): Promise<LineStatus> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    if (accessNames.length === 0) throw new Error('No xDSL access');
    const xdsl = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    const ips = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/ips`);
    return mapToLineStatus(xdsl, ips);
  },

  /** Resynchroniser la ligne. */
  async resyncLine(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/requestPPPLoginLogs`, {});
  },

  /** Lancer un diagnostic. */
  async runDiagnostic(connectionId: string): Promise<LineDiagnostic> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<LineDiagnostic>(`/xdsl/${accessNames[0]}/diagnostic`, {});
  },

  /** Récupérer le diagnostic. */
  async getDiagnostic(connectionId: string): Promise<LineDiagnostic | null> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    try {
      return await ovhApi.get<LineDiagnostic>(`/xdsl/${accessNames[0]}/diagnostic`);
    } catch {
      return null;
    }
  },

  /** Statistiques de la ligne. */
  async getLineStats(connectionId: string, period: string = '24h'): Promise<LineStats> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.get<LineStats>(`/xdsl/${accessNames[0]}/statistics?period=${period}`);
  },

  /** Liste des alertes. */
  async getLineAlerts(connectionId: string): Promise<LineAlert[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const ids = await ovhApi.get<number[]>(`/xdsl/${accessNames[0]}/monitoringNotifications`);
    return Promise.all(ids.map(id =>
      ovhApi.get<LineAlert>(`/xdsl/${accessNames[0]}/monitoringNotifications/${id}`)
    ));
  },

  /** Ajouter une alerte. */
  async addLineAlert(connectionId: string, alert: Partial<LineAlert>): Promise<LineAlert> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<LineAlert>(`/xdsl/${accessNames[0]}/monitoringNotifications`, alert);
  },

  /** Supprimer une alerte. */
  async deleteLineAlert(connectionId: string, alertId: string): Promise<void> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    await ovhApi.delete(`/xdsl/${accessNames[0]}/monitoringNotifications/${alertId}`);
  },

  /** Reset du port (réinitialiser la ligne). */
  async resetLine(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/resetDslStats`, {});
  },

  /** Solde SMS pour alertes. */
  async getSmsCredits(): Promise<number | undefined> {
    try {
      const accounts = await ovhApi.get<string[]>('/sms');
      if (accounts.length === 0) return undefined;
      const account = await ovhApi.get<{ creditsLeft: number }>(`/sms/${accounts[0]}`);
      return account.creditsLeft;
    } catch {
      return undefined;
    }
  },
};
