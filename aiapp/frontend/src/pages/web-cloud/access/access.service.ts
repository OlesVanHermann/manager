// ============================================================
// SERVICE ACCESS - API page principale (listing uniquement)
// ============================================================
// NOTE: Les méthodes détaillées sont dans connections/connections.service.ts
// Ce service ne gère que le listing pour la page access/index.tsx

import { ovhApi } from '../../../services/api';

class AccessService {
  // ============================================================
  // LISTING - Utilisé par access/index.tsx
  // ============================================================

  /** Liste toutes les connexions pack xDSL. */
  async listConnections(): Promise<string[]> {
    return ovhApi.get<string[]>('/pack/xdsl');
  }

  /** Liste tous les services OverTheBox. */
  async listOvertheboxServices(): Promise<string[]> {
    return ovhApi.get<string[]>('/overTheBox');
  }

  /** Détails basiques d'une connexion (pour le listing). */
  async getConnection(id: string): Promise<{
    id: string;
    name: string;
    techType: string;
    offerLabel: string;
    status: string;
    downSpeed: number;
    upSpeed: number;
    modem: { name: string; type: 'ovh' | 'custom' } | null;
  }> {
    const pack = await ovhApi.get<any>(`/pack/xdsl/${id}`);
    const accessNames = await ovhApi.get<string[]>(`/pack/xdsl/${id}/xdslAccess/services`);
    let xdslData: any = null;
    if (accessNames.length > 0) {
      xdslData = await ovhApi.get<any>(`/xdsl/${accessNames[0]}`);
    }
    return {
      id: pack.packName,
      name: pack.description || pack.packName,
      techType: this.mapTechType(xdslData?.accessType),
      offerLabel: pack.offerDescription || 'Pack xDSL',
      status: xdslData?.status === 'active' ? 'connected' : 'disconnected',
      downSpeed: xdslData?.accessCurrentSpeed?.down || 0,
      upSpeed: xdslData?.accessCurrentSpeed?.up || 0,
      modem: null,
    };
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private mapTechType(type: string): string {
    const map: Record<string, string> = {
      'adsl': 'ADSL',
      'adsl2': 'ADSL2+',
      'adsl2+': 'ADSL2+',
      'vdsl': 'VDSL2',
      'vdsl2': 'VDSL2',
      'sdsl': 'SDSL',
      'ftth': 'FTTH',
      'ftto': 'FTTO',
      'ftte': 'FTTE',
      'fiber': 'FTTH',
      '4g': '4G/LTE',
      'lte': '4G/LTE',
      '5g': '5G',
      'satellite': 'SAT',
      'sat': 'SAT',
    };
    return map[type?.toLowerCase()] || type?.toUpperCase() || 'xDSL';
  }
}

export const accessService = new AccessService();
