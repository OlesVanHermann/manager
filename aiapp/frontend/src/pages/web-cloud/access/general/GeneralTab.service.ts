// ============================================================
// SERVICE GENERAL TAB - Isolé pour le dashboard connexion
// ============================================================

import { ovhApi } from '../../../../services/api';
import type { Connection, TechType, OfferType } from '../connections.types';

// ---------- HELPERS LOCAUX ----------

const mapTechType = (type: string): TechType => {
  const map: Record<string, TechType> = {
    'adsl': 'ADSL',
    'vdsl': 'VDSL2',
    'ftth': 'FTTH',
    'sdsl': 'ADSL',
  };
  return map[type?.toLowerCase()] || 'ADSL';
};

const mapOfferType = (desc: string): OfferType => {
  if (!desc) return 'access-only';
  const lower = desc.toLowerCase();
  if (lower.includes('pro')) return 'pack-pro';
  if (lower.includes('business')) return 'pack-business';
  if (lower.includes('perso')) return 'pack-perso';
  return 'access-only';
};

const mapToConnection = (pack: any, xdsl: any): Connection => {
  return {
    id: pack.packName,
    name: pack.description || pack.packName,
    techType: mapTechType(xdsl?.accessType),
    offerType: mapOfferType(pack.offerDescription),
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
};

// ---------- SERVICE ----------

export const generalService = {
  /** Détails d'une connexion. */
  async getConnection(id: string): Promise<Connection> {
    const pack = await ovhApi.get<any>(`/pack/xdsl/${id}`);
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${id}/xdslAccess/services`);
    let xdslData: any = null;
    if (accessNames.length > 0) {
      xdslData = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    }
    const result = mapToConnection(pack, xdslData);
    return result;
  },

  /** Renommer une connexion. */
  async renameConnection(id: string, name: string): Promise<void> {
    await ovhApi.put(`/pack/xdsl/${id}`, { description: name });
  },

  /** Résilier la connexion (old_manager: OvhApiPackXdslResiliation). */
  async cancelConnection(id: string): Promise<void> {
    // Endpoint correct: /pack/xdsl/{packName}/resiliate
    await ovhApi.post(`/pack/xdsl/${id}/resiliate`, {});
  },
};
