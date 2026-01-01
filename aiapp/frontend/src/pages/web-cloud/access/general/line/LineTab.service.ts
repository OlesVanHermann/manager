// ============================================================
// SERVICE LINE TAB - Isolé pour statut/diagnostic/stats ligne
// ============================================================

import { ovhApi } from '../../../../../services/api';
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

  /** Récupère les informations détaillées d'une ligne spécifique. */
  async getLineInfo(connectionId: string, lineNumber?: string): Promise<any> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lines = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/lines`);
    const targetLine = lineNumber || lines[0];
    return ovhApi.get<any>(`/xdsl/${accessNames[0]}/lines/${targetLine}`);
  },

  /** Récupère les statistiques détaillées d'une ligne spécifique. */
  async getLineDetailedStats(connectionId: string, lineNumber?: string): Promise<any> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lines = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/lines`);
    const targetLine = lineNumber || lines[0];
    return ovhApi.get<any>(`/xdsl/${accessNames[0]}/lines/${targetLine}/statistics`);
  },

  /** Demande de déconsolidation totale (réinitialisation complète connexion). */
  async requestTotalDeconsolidation(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/requestTotalDeconsolidation`, {});
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

  // ============================================================
  // ENDPOINTS ALIGNÉS OLD_MANAGER (XdslAccessService + controller)
  // ============================================================

  /**
   * Récupère le statut d'envoi de mail (old_manager: mailSending).
   * Valeurs: 'enabled', 'disabled', 'noStatus'
   */
  async getMailSendingStatus(connectionId: string): Promise<string> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const xdsl = await ovhApi.get<{ mailSending?: string }>(`/xdsl/${accessNames[0]}`);
    return xdsl.mailSending || 'noStatus';
  },

  /**
   * Change le statut d'envoi de mail (old_manager: updateMailSending).
   */
  async updateMailSending(connectionId: string, status: 'enabled' | 'disabled'): Promise<void> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    await ovhApi.post(`/xdsl/${accessNames[0]}/mailSending`, { status });
  },

  /**
   * Vérifie les tâches de changement de statut mail (old_manager: getChangeMailTasks).
   */
  async getMailSendingTasks(connectionId: string): Promise<number[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.get<number[]>(`/xdsl/${accessNames[0]}/tasks?function=changeMailSendingStatus`);
  },

  /**
   * Vérifie si un incident est en cours (old_manager: getIncident).
   */
  async getIncident(connectionId: string): Promise<{ hasIncident: boolean; incident?: any }> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    try {
      const incident = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/incident`);
      return { hasIncident: true, incident };
    } catch (error: any) {
      // Code 404 = pas d'incident
      if (error?.status === 404) {
        return { hasIncident: false };
      }
      throw error;
    }
  },

  /**
   * Récupère les infos d'échange confort modem (old_manager: getComfortExchange).
   */
  async getModemComfortExchange(connectionId: string): Promise<{
    canExchange: boolean;
    newModel?: string;
    priceHT?: number;
    priceTTC?: number;
    errorCode?: string;
  }> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    try {
      const result = await ovhApi.get<{
        newModel: string;
        price: { value: number };
        priceWithTax: { value: number };
      }>(`/xdsl/${accessNames[0]}/modem/comfortExchange`);
      return {
        canExchange: true,
        newModel: result.newModel.replace(/\./g, ' ').toUpperCase(),
        priceHT: result.price.value,
        priceTTC: result.priceWithTax.value,
      };
    } catch (error: any) {
      // Erreurs connues: dernier modèle, RMA en cours, SDSL
      return { canExchange: false, errorCode: error?.data?.message };
    }
  },

  /**
   * Commander l'échange confort modem (old_manager: comfortExchange).
   */
  async orderModemComfortExchange(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/comfortExchange`, {});
  },

  /**
   * Récupère le suivi de commande (old_manager: getOrder via orderFollowup).
   */
  async getOrderFollowup(connectionId: string): Promise<any[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.get<any[]>(`/xdsl/${accessNames[0]}/orderFollowup`);
  },

  /**
   * Récupère les profils DSLAM disponibles (old_manager: getProfiles via Aapi).
   */
  async getDslamProfiles(connectionId: string, lineNumber?: string): Promise<any[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lines = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/lines`);
    const targetLine = lineNumber || lines[0];
    return ovhApi.get<any[]>(`/xdsl/${accessNames[0]}/lines/${targetLine}/dslamPort/availableProfiles`);
  },

  /**
   * Change le profil DSLAM (old_manager: changeProfile).
   */
  async changeDslamProfile(connectionId: string, profile: string, lineNumber?: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lines = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/lines`);
    const targetLine = lineNumber || lines[0];
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/lines/${targetLine}/dslamPort/changeProfile`, { profile });
  },

  /**
   * Reset du port DSLAM (old_manager: OvhApiXdslLinesDslamPort.v6().reset).
   * Réinitialise le port DSLAM de la ligne.
   */
  async resetDslamPort(connectionId: string, lineNumber?: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lines = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/lines`);
    const targetLine = lineNumber || lines[0];
    // POST /xdsl/{xdslId}/lines/{number}/dslamPort/reset
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/lines/${targetLine}/dslamPort/reset`, {});
  },
};
