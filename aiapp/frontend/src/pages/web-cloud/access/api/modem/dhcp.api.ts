// ============================================================
// API MODEM DHCP - Configuration DHCP
// Aligné avec old_manager: OvhApiXdslModemLanDhcp
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface ModemDhcp {
  dhcpName: string;
  dhcpEnabled: boolean;
  startAddress: string;
  endAddress: string;
  leaseTime: number;
  domainName?: string;
  serverEnabled: boolean;
  gateway?: string;
  primaryDNS?: string;
  secondaryDNS?: string;
}

export interface DhcpStaticAddress {
  name: string;
  MACAddress: string;
  IPAddress: string;
}

// ---------- API ----------

export const modemDhcpApi = {
  /** Liste les configurations DHCP. */
  async list(accessName: string, lanName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp`);
  },

  /** Récupère une configuration DHCP. */
  async get(accessName: string, lanName: string, dhcpName: string): Promise<ModemDhcp> {
    return ovhApi.get<ModemDhcp>(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp/${dhcpName}`);
  },

  /** Met à jour une configuration DHCP. */
  async update(accessName: string, lanName: string, dhcpName: string, data: Partial<{
    dhcpEnabled: boolean;
    startAddress: string;
    endAddress: string;
    leaseTime: number;
    domainName: string;
    gateway: string;
    primaryDNS: string;
    secondaryDNS: string;
  }>): Promise<{ taskId: number }> {
    return ovhApi.put<{ taskId: number }>(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp/${dhcpName}`, data);
  },

  /** Liste les adresses statiques DHCP. */
  async listStaticAddresses(accessName: string, lanName: string, dhcpName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp/${dhcpName}/DHCPStaticAddresses`);
  },

  /** Récupère une adresse statique. */
  async getStaticAddress(accessName: string, lanName: string, dhcpName: string, macAddress: string): Promise<DhcpStaticAddress> {
    return ovhApi.get<DhcpStaticAddress>(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp/${dhcpName}/DHCPStaticAddresses/${macAddress}`);
  },

  /** Crée une adresse statique. */
  async createStaticAddress(accessName: string, lanName: string, dhcpName: string, data: {
    name: string;
    MACAddress: string;
    IPAddress: string;
  }): Promise<DhcpStaticAddress> {
    return ovhApi.post<DhcpStaticAddress>(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp/${dhcpName}/DHCPStaticAddresses`, data);
  },

  /** Supprime une adresse statique. */
  async deleteStaticAddress(accessName: string, lanName: string, dhcpName: string, macAddress: string): Promise<void> {
    await ovhApi.delete(`/xdsl/${accessName}/modem/lan/${lanName}/dhcp/${dhcpName}/DHCPStaticAddresses/${macAddress}`);
  },
};
