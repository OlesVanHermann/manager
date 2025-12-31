// ============================================================
// SERVICE CONNECTIONS - API isolée pour Connexions Internet
// ============================================================

import { ovhApi } from '../../../../services/api';
import type {
  Connection,
  Modem,
  LineStatus,
  LineDiagnostic,
  LineStats,
  LineAlert,
  ModemWifi,
  ModemDhcp,
  DhcpLease,
  ModemNatRule,
  ModemRouter,
  ModemDns,
  ModemMtu,
  ModemCredentials,
  Service,
  VoipLine,
  EcoFax,
  Option,
  AvailableOption,
  Task,
  TechType,
  OfferType,
} from './connections.types';

class ConnectionsService {
  // ============================================================
  // CONNEXIONS - Liste et détails
  // ============================================================

  /** Liste toutes les connexions. */
  async listConnections(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  }

  /** Détails d'une connexion. */
  async getConnection(id: string): Promise<Connection> {
    const pack = await ovhApi.get<any>(`/pack/xdsl/${id}`);
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${id}/xdslAccess/services`);
    let xdslData: any = null;
    if (accessNames.length > 0) {
      xdslData = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    }
    return this.mapToConnection(pack, xdslData);
  }

  /** Renommer une connexion. */
  async renameConnection(id: string, name: string): Promise<void> {
    await ovhApi.put(`/pack/xdsl/${id}`, { description: name });
  }

  /** Migrer une offre. */
  async migrateOffer(id: string, offerId: string): Promise<Task> {
    return ovhApi.post<Task>(`/pack/xdsl/${id}/migrate`, { offerId });
  }

  /** Déménager. */
  async moveConnection(id: string, address: any): Promise<Task> {
    return ovhApi.post<Task>(`/pack/xdsl/${id}/addressMove`, address);
  }

  /** Résilier. */
  async cancelConnection(id: string): Promise<void> {
    await ovhApi.post(`/pack/xdsl/${id}/resiliate`, {});
  }

  // ============================================================
  // LIGNE - Statut et diagnostic
  // ============================================================

  /** Statut de la ligne. */
  async getLineStatus(connectionId: string): Promise<LineStatus> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    if (accessNames.length === 0) throw new Error('No xDSL access');
    const xdsl = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    const ips = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/ips`);
    return this.mapToLineStatus(xdsl, ips);
  }

  /** Resynchroniser la ligne. */
  async resyncLine(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/requestPPPLoginLogs`, {});
  }

  /** Lancer un diagnostic. */
  async runDiagnostic(connectionId: string): Promise<LineDiagnostic> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<LineDiagnostic>(`/xdsl/${accessNames[0]}/diagnostic`, {});
  }

  /** Récupérer le diagnostic. */
  async getDiagnostic(connectionId: string): Promise<LineDiagnostic | null> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    try {
      return await ovhApi.get<LineDiagnostic>(`/xdsl/${accessNames[0]}/diagnostic`);
    } catch {
      return null;
    }
  }

  /** Statistiques de la ligne. */
  async getLineStats(connectionId: string, period: string = '24h'): Promise<LineStats> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.get<LineStats>(`/xdsl/${accessNames[0]}/statistics?period=${period}`);
  }

  /** Liste des alertes. */
  async getLineAlerts(connectionId: string): Promise<LineAlert[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const ids = await ovhApi.get<number[]>(`/xdsl/${accessNames[0]}/monitoringNotifications`);
    return Promise.all(ids.map(id =>
      ovhApi.get<LineAlert>(`/xdsl/${accessNames[0]}/monitoringNotifications/${id}`)
    ));
  }

  /** Ajouter une alerte. */
  async addLineAlert(connectionId: string, alert: Partial<LineAlert>): Promise<LineAlert> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<LineAlert>(`/xdsl/${accessNames[0]}/monitoringNotifications`, alert);
  }

  /** Supprimer une alerte. */
  async deleteLineAlert(connectionId: string, alertId: string): Promise<void> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    await ovhApi.delete(`/xdsl/${accessNames[0]}/monitoringNotifications/${alertId}`);
  }

  /** Reset du port (réinitialiser la ligne). */
  async resetLine(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/resetDslStats`, {});
  }

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
  }

  // ============================================================
  // MODEM OVH
  // ============================================================

  /** Infos modem. */
  async getModem(connectionId: string): Promise<Modem> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const modem = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem`);
    return {
      id: modem.macAddress || connectionId,
      name: modem.model || 'Modem OVH',
      type: 'ovh',
      brand: modem.brandName || 'OVH',
      model: modem.model || '',
      serial: modem.serialNumber || '',
      mac: modem.macAddress || '',
      firmware: modem.firmwareVersion || '',
      uptime: modem.lastCwmpRequestDate || '',
      lastReboot: modem.lastCwmpRequestDate || '',
      wanIp: modem.wanIp || '',
      lanIp: modem.lanIp || '192.168.1.1',
      connectedDevices: 0,
      managed: true,
    };
  }

  /** Redémarrer modem. */
  async rebootModem(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/reboot`, {});
  }

  /** Reset usine modem. */
  async resetModemFactory(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/reset`, { resetOvhConfig: true });
  }

  /** Config WiFi. */
  async getModemWifi(connectionId: string): Promise<ModemWifi> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const wifiIds = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/wifi`);
    const wifis = await Promise.all(wifiIds.map(id =>
      ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem/wifi/${id}`)
    ));
    const wifi24 = wifis.find(w => w.wifiName?.includes('2.4') || w.frequency === '2.4GHz') || {};
    const wifi5 = wifis.find(w => w.wifiName?.includes('5') || w.frequency === '5GHz') || {};
    return {
      enabled24: wifi24.enabled ?? true,
      ssid24: wifi24.SSID || '',
      password24: wifi24.securityKey || '',
      channel24: wifi24.channel || 'auto',
      enabled5: wifi5.enabled ?? true,
      ssid5: wifi5.SSID || '',
      password5: wifi5.securityKey || '',
      channel5: wifi5.channel || 'auto',
      security: 'WPA2/WPA3',
      connectedDevices: 0,
    };
  }

  /** Modifier WiFi. */
  async updateModemWifi(connectionId: string, config: Partial<ModemWifi>): Promise<ModemWifi> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const wifiIds = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/wifi`);
    for (const wifiId of wifiIds) {
      const wifi = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem/wifi/${wifiId}`);
      const is24 = wifi.wifiName?.includes('2.4') || wifi.frequency === '2.4GHz';
      const updateData: any = {};
      if (is24) {
        if (config.enabled24 !== undefined) updateData.enabled = config.enabled24;
        if (config.ssid24) updateData.SSID = config.ssid24;
        if (config.channel24) updateData.channel = config.channel24;
      } else {
        if (config.enabled5 !== undefined) updateData.enabled = config.enabled5;
        if (config.ssid5) updateData.SSID = config.ssid5;
        if (config.channel5) updateData.channel = config.channel5;
      }
      if (Object.keys(updateData).length > 0) {
        await ovhApi.put(`/xdsl/${accessNames[0]}/modem/wifi/${wifiId}`, updateData);
      }
    }
    return this.getModemWifi(connectionId);
  }

  /** Config DHCP. */
  async getModemDhcp(connectionId: string): Promise<ModemDhcp> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lans = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/lan`);
    const dhcpIds = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/lan/${lans[0]}/dhcp`);
    const dhcp = dhcpIds.length > 0
      ? await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem/lan/${lans[0]}/dhcp/${dhcpIds[0]}`)
      : {};
    return {
      enabled: dhcp.dhcpEnabled ?? true,
      rangeStart: dhcp.startAddress || '192.168.1.100',
      rangeEnd: dhcp.endAddress || '192.168.1.200',
      leaseTime: dhcp.leaseTime || 86400,
      leases: [],
      staticLeases: [],
    };
  }

  /** Modifier DHCP. */
  async updateModemDhcp(connectionId: string, config: Partial<ModemDhcp>): Promise<ModemDhcp> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const lans = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/lan`);
    const dhcpIds = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/lan/${lans[0]}/dhcp`);
    if (dhcpIds.length > 0) {
      await ovhApi.put(`/xdsl/${accessNames[0]}/modem/lan/${lans[0]}/dhcp/${dhcpIds[0]}`, {
        dhcpEnabled: config.enabled,
        startAddress: config.rangeStart,
        endAddress: config.rangeEnd,
        leaseTime: config.leaseTime,
      });
    }
    return this.getModemDhcp(connectionId);
  }

  /** Baux DHCP. */
  async getModemLeases(connectionId: string): Promise<DhcpLease[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.get<DhcpLease[]>(`/xdsl/${accessNames[0]}/modem/connectedDevices`);
  }

  /** Règles NAT. */
  async getModemNat(connectionId: string): Promise<ModemNatRule[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const ids = await ovhApi.get<string[]>(`/xdsl/${accessNames[0]}/modem/portMappings`);
    const rules = await Promise.all(ids.map(id =>
      ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem/portMappings/${id}`)
    ));
    return rules.map(r => ({
      id: r.name || String(r.id),
      name: r.description || r.name || '',
      protocol: r.protocol || 'TCP',
      externalPort: r.externalPortStart || 0,
      internalIp: r.internalClient || '',
      internalPort: r.internalPort || r.externalPortStart || 0,
      enabled: r.status === 'enabled',
    }));
  }

  /** Ajouter règle NAT. */
  async addModemNatRule(connectionId: string, rule: Partial<ModemNatRule>): Promise<ModemNatRule> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<ModemNatRule>(`/xdsl/${accessNames[0]}/modem/portMappings`, rule);
  }

  /** Supprimer règle NAT. */
  async deleteModemNatRule(connectionId: string, ruleId: string): Promise<void> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    await ovhApi.delete(`/xdsl/${accessNames[0]}/modem/portMappings/${ruleId}`);
  }

  /** Mode routeur. */
  async getModemRouter(connectionId: string): Promise<ModemRouter> {
    const modem = await this.getModem(connectionId) as any;
    return {
      mode: modem.isBridged ? 'bridge' : 'router',
      dmzEnabled: modem.dmzIP !== null,
      dmzIp: modem.dmzIP,
      firewallEnabled: true,
      upnpEnabled: true,
    };
  }

  /** Changer mode routeur. */
  async updateModemRouter(connectionId: string, _config: Partial<ModemRouter>): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/reset`, { resetOvhConfig: true });
  }

  /** Config DNS du modem. */
  async getModemDns(connectionId: string): Promise<ModemDns> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const modem = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem`);
    return {
      primary: modem.dns1 || '8.8.8.8',
      secondary: modem.dns2 || '8.8.4.4',
    };
  }

  /** Config MTU du modem. */
  async getModemMtu(connectionId: string): Promise<ModemMtu> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const modem = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem`);
    return {
      size: modem.mtuSize || 1500,
    };
  }

  // ============================================================
  // MODEM PERSO
  // ============================================================

  /** Infos modem perso. */
  async getModemCustom(_connectionId: string): Promise<{ brand: string; model: string; mac: string } | null> {
    return null;
  }

  /** Credentials connexion. */
  async getModemCredentials(connectionId: string): Promise<ModemCredentials> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const xdsl = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    return {
      mode: 'PPPoE',
      username: xdsl.login || '',
      password: '••••••••',
      vlan: 835,
    };
  }

  // ============================================================
  // SERVICES
  // ============================================================

  /** Liste des services inclus. */
  async getServices(connectionId: string): Promise<Service[]> {
    const services: Service[] = [];
    const domains = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/domain/services`).catch(() => []);
    domains.forEach(d => services.push({ id: d, type: 'domain', name: d, status: 'active' }));
    const emails = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/emailPro/services`).catch(() => []);
    emails.forEach(e => services.push({ id: e, type: 'email', name: e, status: 'active' }));
    const voips = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/voipLine/services`).catch(() => []);
    voips.forEach(v => services.push({ id: v, type: 'voip', name: v, status: 'active' }));
    const hostings = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/hostedEmail/services`).catch(() => []);
    hostings.forEach(h => services.push({ id: h, type: 'hosting', name: h, status: 'active' }));
    return services;
  }

  // ============================================================
  // VOIP
  // ============================================================

  /** Lignes VoIP. */
  async getVoipLines(connectionId: string): Promise<VoipLine[]> {
    const lines = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/voipLine/services`);
    return Promise.all(lines.map(async (line) => {
      const details = await ovhApi.get<any>(`/telephony/line/${line}`).catch(() => ({}));
      return {
        id: line,
        number: details.number || line,
        status: details.status || 'active',
        type: 'line' as const,
      };
    }));
  }

  /** EcoFax. */
  async getEcoFax(_connectionId: string): Promise<EcoFax> {
    return { enabled: false, email: '' };
  }

  /** Configurer EcoFax. */
  async updateEcoFax(_connectionId: string, _config: Partial<EcoFax>): Promise<void> {
    // API EcoFax update
  }

  // ============================================================
  // OPTIONS
  // ============================================================

  /** Options actives. */
  async getOptions(connectionId: string): Promise<Option[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const xdsl = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    const options: Option[] = [];
    if (xdsl.ipv6) options.push({ id: 'ipv6', type: 'ipv6', label: 'IPv6', active: true });
    return options;
  }

  /** Options disponibles. */
  async getAvailableOptions(connectionId: string): Promise<AvailableOption[]> {
    return [
      { id: 'backup-4g', type: 'backup-4g', label: 'Backup 4G', description: 'Basculement auto si panne', price: 19.99, period: 'monthly' },
      { id: 'fixed-ip', type: 'fixed-ip', label: 'IP Failover', description: 'Adresses IP supplémentaires', price: 2.99, period: 'monthly' },
      { id: 'anti-ddos', type: 'anti-ddos', label: 'Anti-DDoS', description: 'Protection renforcée', price: 9.99, period: 'monthly' },
      { id: 'qos', type: 'qos', label: 'QoS Avancée', description: 'Priorisation trafic', price: 4.99, period: 'monthly' },
      { id: 'gtr', type: 'gtr', label: 'GTR 4h', description: 'Garantie rétablissement 4h', price: 29.99, period: 'monthly' },
    ];
  }

  /** Ajouter option. */
  async addOption(connectionId: string, optionId: string): Promise<Task> {
    return ovhApi.post<Task>(`/pack/xdsl/${connectionId}/options`, { optionId });
  }

  /** Supprimer option. */
  async removeOption(connectionId: string, optionId: string): Promise<void> {
    await ovhApi.delete(`/pack/xdsl/${connectionId}/options/${optionId}`);
  }

  // ============================================================
  // TASKS
  // ============================================================

  /** Tâches connexion. */
  async getTasks(connectionId: string): Promise<Task[]> {
    const ids = await ovhApi.get<number[]>(`/pack/xdsl/${connectionId}/tasks`);
    return Promise.all(ids.map(id =>
      ovhApi.get<Task>(`/pack/xdsl/${connectionId}/tasks/${id}`)
    ));
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private mapToConnection(pack: any, xdsl: any): Connection {
    return {
      id: pack.packName,
      name: pack.description || pack.packName,
      techType: this.mapTechType(xdsl?.accessType),
      offerType: this.mapOfferType(pack.offerDescription),
      offerLabel: pack.offerDescription || 'Pack xDSL',
      status: xdsl?.status === 'active' ? 'connected' : 'disconnected',
      address: {
        street: xdsl?.address?.street || '',
        city: xdsl?.address?.city || '',
        zipCode: xdsl?.address?.zipCode || '',
        country: 'France',
      },
      modem: null,
      services: [],
      options: [],
      billing: {
        amount: 0,
        currency: 'EUR',
        period: 'monthly',
        nextBilling: '',
      },
      downSpeed: 0,
      upSpeed: 0,
      maxDownSpeed: 0,
      maxUpSpeed: 0,
      connectedSince: '',
      lastSync: '',
      otbId: null,
    };
  }

  private mapToLineStatus(xdsl: any, ips: any): LineStatus {
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
  }

  private mapTechType(type: string): TechType {
    const map: Record<string, TechType> = {
      'adsl': 'ADSL',
      'vdsl': 'VDSL2',
      'ftth': 'FTTH',
      'sdsl': 'ADSL',
    };
    return map[type?.toLowerCase()] || 'ADSL';
  }

  private mapOfferType(desc: string): OfferType {
    if (!desc) return 'access-only';
    const lower = desc.toLowerCase();
    if (lower.includes('pro')) return 'pack-pro';
    if (lower.includes('business')) return 'pack-business';
    if (lower.includes('perso')) return 'pack-perso';
    return 'access-only';
  }
}

export const connectionsService = new ConnectionsService();
