// ============================================================
// SERVICE GENERAL - Isolé pour GeneralTab (OverTheBox)
// Endpoints alignés avec old_manager (OvhApiOverTheBox.v6, OverTheBoxDetailsService)
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { OverTheBox, OtbConnection, OtbFirmware, Task } from './overthebox.types';

// ---------- TYPES LOCAUX ----------

/**
 * Device response from GET /overTheBox/{serviceName}/device
 * Aligné old_manager: OvhApiOverTheBox.v6().getDevice()
 */
interface OtbDevice {
  deviceId: string;
  version: string;
  lastSeen?: string;
  activated: boolean;
  publicIp?: string;
  networkInterfaces?: Array<{
    name: string;
    device?: string;
    ip?: string;
    gateway?: string;
    netmask?: string;
  }>;
}

/**
 * Device hardware from GET /overTheBox/{serviceName}/device/hardware
 * Aligné old_manager: OverTheBoxDetailsService.getDeviceHardware()
 */
interface OtbDeviceHardware {
  prettyModelName: string;
  model: string;
}

/**
 * Available action from GET /overTheBox/{serviceName}/device/availableActions
 * Aligné old_manager: OvhApiOverTheBox.v6().getAvailableActions()
 */
interface OtbAvailableAction {
  name: string;
  description?: string;
}

/**
 * Statistics point from GET /overTheBox/{serviceName}/statistics
 * Aligné old_manager: OverTheBoxDetailsService.loadStatistics()
 */
interface OtbStatPoint {
  timestamp: number;
  value: number;
}

interface OtbStatSeries {
  name: string;
  points: OtbStatPoint[];
  tags: Array<{ name: string; value: string }>;
  unit: string;
}

// ---------- SERVICE ----------

class GeneralService {
  /**
   * Récupère les détails d'un service OverTheBox.
   * Aligné old_manager: OvhApiOverTheBox.v6().get()
   */
  async getService(serviceName: string): Promise<OverTheBox> {
    // GET /overTheBox/{serviceName}
    return ovhApi.get<OverTheBox>(`/overTheBox/${serviceName}`);
  }

  /**
   * Récupère les informations du device physique.
   * Aligné old_manager: OvhApiOverTheBox.v6().getDevice()
   */
  async getDevice(serviceName: string): Promise<OtbDevice> {
    // GET /overTheBox/{serviceName}/device
    return ovhApi.get<OtbDevice>(`/overTheBox/${serviceName}/device`);
  }

  /**
   * Récupère les informations hardware du device.
   * Aligné old_manager: OverTheBoxDetailsService.getDeviceHardware()
   */
  async getDeviceHardware(serviceName: string): Promise<OtbDeviceHardware | null> {
    // GET /overTheBox/{serviceName}/device/hardware
    try {
      return await ovhApi.get<OtbDeviceHardware>(`/overTheBox/${serviceName}/device/hardware`);
    } catch (error: any) {
      // 404 = device pas encore lié
      if (error?.status === 404) return null;
      throw error;
    }
  }

  /**
   * Récupère le statut actuel du device (depuis /device).
   * Le device contient publicIp, lastSeen, et networkInterfaces.
   */
  async getDeviceStatus(serviceName: string): Promise<{
    publicIp: string;
    connected: boolean;
    lastSeen?: string;
  }> {
    const device = await this.getDevice(serviceName);
    // Calculer si connecté: lastSeen < 5 minutes
    const isRecent = device.lastSeen
      ? (Date.now() - new Date(device.lastSeen).getTime()) < 5 * 60 * 1000
      : false;
    return {
      publicIp: device.publicIp || '',
      connected: isRecent,
      lastSeen: device.lastSeen,
    };
  }

  /**
   * Récupère la liste des connexions actives (interfaces réseau avec gateway).
   * Aligné old_manager: device.networkInterfaces filtrés par gateway != null
   */
  async getDeviceLinks(serviceName: string): Promise<OtbConnection[]> {
    const device = await this.getDevice(serviceName);
    const interfaces = device.networkInterfaces || [];
    // Filtrer les interfaces avec gateway (comme old_manager)
    const activeLinks = interfaces.filter(iface => iface.gateway != null);
    return activeLinks.map((iface, idx) => ({
      id: iface.device || iface.name,
      name: iface.name,
      type: 'FTTH' as OtbConnection['type'], // Type non disponible dans l'API
      provider: 'Unknown',
      status: 'active' as OtbConnection['status'],
      bandwidth: {
        download: 0, // Non disponible via device, utiliser statistics
        upload: 0,
      },
      priority: idx + 1,
    }));
  }

  /**
   * Récupère les statistiques de trafic.
   * Aligné old_manager: OverTheBoxDetailsService.loadStatistics()
   */
  async getStatistics(serviceName: string, metricsType: string = 'traffic', period: string = 'daily'): Promise<OtbStatSeries[]> {
    // GET /overTheBox/{serviceName}/statistics?period={period}&metricsType={metricsType}
    return ovhApi.get<OtbStatSeries[]>(`/overTheBox/${serviceName}/statistics?period=${period}&metricsType=${metricsType}`);
  }

  /**
   * Récupère les infos firmware depuis le device.
   */
  async getFirmware(serviceName: string): Promise<OtbFirmware> {
    const device = await this.getDevice(serviceName);
    return {
      version: device.version,
      upToDate: true, // Non disponible directement, voir availableReleaseChannels
    };
  }

  /**
   * Récupère les canaux de release disponibles.
   * Aligné old_manager: OvhApiOverTheBox.v6().getAvailableReleaseChannels()
   */
  async getAvailableReleaseChannels(serviceName: string): Promise<string[]> {
    // GET /overTheBox/{serviceName}/availableReleaseChannels
    return ovhApi.get<string[]>(`/overTheBox/${serviceName}/availableReleaseChannels`);
  }

  /**
   * Récupère les actions disponibles sur le device.
   * Aligné old_manager: OvhApiOverTheBox.v6().getAvailableActions()
   */
  async getAvailableActions(serviceName: string): Promise<OtbAvailableAction[]> {
    // GET /overTheBox/{serviceName}/device/availableActions
    return ovhApi.get<OtbAvailableAction[]>(`/overTheBox/${serviceName}/device/availableActions`);
  }

  /**
   * Lance une action sur le device (reboot, refresh, etc.).
   * Aligné old_manager: OvhApiOverTheBox.v6().launchAction()
   */
  async launchAction(serviceName: string, actionName: string): Promise<Task> {
    // POST /overTheBox/{serviceName}/device/actions
    return ovhApi.post<Task>(`/overTheBox/${serviceName}/device/actions`, { name: actionName });
  }

  /**
   * Redémarre le device OverTheBox.
   * Utilise launchAction('reboot') comme dans old_manager.
   */
  async rebootDevice(serviceName: string): Promise<Task> {
    return this.launchAction(serviceName, 'reboot');
  }

  /**
   * Renomme l'OverTheBox.
   * Aligné old_manager: OvhApiOverTheBox.v6().putService()
   */
  async rename(serviceName: string, customName: string): Promise<void> {
    // PUT /overTheBox/{serviceName}
    await ovhApi.put(`/overTheBox/${serviceName}`, { customerDescription: customName });
  }

  /**
   * Change le canal de release.
   * Aligné old_manager: OvhApiOverTheBox.v6().putService()
   */
  async changeReleaseChannel(serviceName: string, releaseChannel: string): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}`, { releaseChannel });
  }

  /**
   * Active/désactive les mises à jour automatiques.
   * Aligné old_manager: OvhApiOverTheBox.v6().putService()
   */
  async setAutoUpgrade(serviceName: string, autoUpgrade: boolean): Promise<void> {
    await ovhApi.put(`/overTheBox/${serviceName}`, { autoUpgrade });
  }

  /**
   * Récupère les infos du service (facturation, renouvellement).
   * Aligné old_manager: OvhApiOverTheBox.v6().getServiceInfos()
   */
  async getServiceInfos(serviceName: string): Promise<{
    status: string;
    engagedUpTo?: string;
    expiration: string;
    creation: string;
    renew?: {
      automatic: boolean;
      deleteAtExpiration: boolean;
    };
    canDeleteAtExpiration: boolean;
  }> {
    // GET /overTheBox/{serviceName}/serviceInfos
    return ovhApi.get(`/overTheBox/${serviceName}/serviceInfos`);
  }

  /**
   * Modifie les infos du service.
   * Aligné old_manager: OvhApiOverTheBox.v6().putServiceInfos()
   */
  async updateServiceInfos(serviceName: string, params: {
    renew?: { automatic: boolean; period: number };
  }): Promise<void> {
    // PUT /overTheBox/{serviceName}/serviceInfos
    await ovhApi.put(`/overTheBox/${serviceName}/serviceInfos`, params);
  }

  /**
   * Récupère les IPs du service.
   * Aligné old_manager: OverTheBoxDetailsService.getIps()
   */
  async getIps(serviceName: string): Promise<Array<{
    ip: string;
    range: number;
    type: string;
    reverse?: string;
  }>> {
    // GET /overTheBox/{serviceName}/ips (avec expand)
    return ovhApi.get(`/overTheBox/${serviceName}/ips`);
  }

  /**
   * Met à jour l'activation IPv6.
   * Aligné old_manager: OverTheBoxDetailsService.updateIpActivation()
   */
  async updateIpv6(serviceName: string, enabled: boolean): Promise<{ taskId: string }> {
    // PUT /overTheBox/{serviceName}/ipv6
    return ovhApi.put(`/overTheBox/${serviceName}/ipv6`, { enabled });
  }

  /**
   * Vérifie les devices disponibles pour linkage.
   * Aligné old_manager: OvhApiOverTheBox.v6().checkDevices()
   */
  async checkDevices(): Promise<Array<{ deviceId: string; lastSeen?: string }>> {
    // POST /overTheBox/devices
    return ovhApi.post<Array<{ deviceId: string; lastSeen?: string }>>('/overTheBox/devices', {});
  }

  /**
   * Lie un device au service.
   * Aligné old_manager: OvhApiOverTheBox.v6().linkDevice()
   */
  async linkDevice(serviceName: string, deviceId: string): Promise<void> {
    // POST /overTheBox/{serviceName}/linkDevice
    await ovhApi.post(`/overTheBox/${serviceName}/linkDevice`, { deviceId });
  }

  /**
   * Détache le device du service.
   * Aligné old_manager: OverTheBoxDetailsService.unlinkDevice()
   */
  async unlinkDevice(serviceName: string): Promise<void> {
    // DELETE /overTheBox/{serviceName}/device
    await ovhApi.delete(`/overTheBox/${serviceName}/device`);
  }

  /**
   * Résilie le service OverTheBox.
   * Aligné old_manager: OvhApiOverTheBox.v6().deleteAtExpiration()
   */
  async terminate(serviceName: string): Promise<void> {
    // DELETE /overTheBox/{serviceName}
    await ovhApi.delete(`/overTheBox/${serviceName}`);
  }

  /**
   * Annuler la résiliation.
   * Aligné old_manager: OvhApiOverTheBox.v6().keepAtExpiration()
   */
  async cancelResiliation(serviceName: string): Promise<void> {
    // POST /overTheBox/{serviceName}/cancelResiliation
    await ovhApi.post(`/overTheBox/${serviceName}/cancelResiliation`, {});
  }

  /**
   * Récupère les offres disponibles.
   * Aligné old_manager: OvhApiOverTheBox.v6().availableOffers()
   */
  async getAvailableOffers(): Promise<string[]> {
    // GET /overTheBox/availableOffers
    return ovhApi.get<string[]>('/overTheBox/availableOffers');
  }

  /**
   * Récupère les offres de migration.
   * Aligné old_manager: OverTheBoxMigrationService.getOffers()
   */
  async getMigrationOffers(serviceName: string): Promise<Array<{
    offer: string;
    description?: string;
    price?: { value: number; currencyCode: string };
  }>> {
    // GET /overTheBox/{serviceName}/migration/offers
    const response = await ovhApi.get<{ offers?: any[] }>(`/overTheBox/${serviceName}/migration/offers`);
    return response.offers || [];
  }
}

export const generalService = new GeneralService();
