// ============================================================
// SERVICE MODEM OVH TAB - Isolé pour configuration modem OVH
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Modem, ModemWifi, ModemDhcp, DhcpLease, ModemNatRule, ModemRouter, ModemDns, ModemMtu, Task } from '../connections.types';

// ---------- SERVICE ----------

export const modemOvhService = {
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
  },

  /** Redémarrer modem. */
  async rebootModem(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/reboot`, {});
  },

  /** Reset usine modem. */
  async resetModemFactory(connectionId: string): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/reset`, { resetOvhConfig: true });
  },

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
  },

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
  },

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
  },

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
  },

  /** Baux DHCP. */
  async getModemLeases(connectionId: string): Promise<DhcpLease[]> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.get<DhcpLease[]>(`/xdsl/${accessNames[0]}/modem/connectedDevices`);
  },

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
  },

  /** Ajouter règle NAT. */
  async addModemNatRule(connectionId: string, rule: Partial<ModemNatRule>): Promise<ModemNatRule> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<ModemNatRule>(`/xdsl/${accessNames[0]}/modem/portMappings`, rule);
  },

  /** Supprimer règle NAT. */
  async deleteModemNatRule(connectionId: string, ruleId: string): Promise<void> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    await ovhApi.delete(`/xdsl/${accessNames[0]}/modem/portMappings/${ruleId}`);
  },

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
  },

  /** Changer mode routeur. */
  async updateModemRouter(connectionId: string, _config: Partial<ModemRouter>): Promise<Task> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    return ovhApi.post<Task>(`/xdsl/${accessNames[0]}/modem/reset`, { resetOvhConfig: true });
  },

  /** Config DNS du modem. */
  async getModemDns(connectionId: string): Promise<ModemDns> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const modem = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem`);
    return {
      primary: modem.dns1 || '8.8.8.8',
      secondary: modem.dns2 || '8.8.4.4',
    };
  },

  /** Config MTU du modem. */
  async getModemMtu(connectionId: string): Promise<ModemMtu> {
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${connectionId}/xdslAccess/services`);
    const modem = await ovhApi.get<any>(`/xdsl/${accessNames[0]}/modem`);
    return {
      size: modem.mtuSize || 1500,
    };
  },
};
