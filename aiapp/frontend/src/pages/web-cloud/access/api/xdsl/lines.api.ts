// ============================================================
// API XDSL LINES - Lignes et DSLAM
// Aligné avec old_manager: OvhApiXdslLines, OvhApiXdslLinesDslamPort
// ============================================================

import { ovhApi } from '../../../../../services/api';

// ---------- TYPES ----------

export interface XdslLine {
  number: string;
  deconsolidation: 'none' | 'partial' | 'total';
  directDistribution: boolean;
  distance?: number;
  faultRepairTime?: string;
  lineSectionsLength?: Array<{
    section: string;
    length: number;
  }>;
  mitigation?: number;
  nra?: string;
  originalNumber?: string;
  portability?: boolean;
  status: string;
  syncDown?: number;
  syncUp?: number;
}

export interface DslamProfile {
  name: string;
  checked: boolean;
}

export interface DslamPortInfo {
  status: string;
  lastDesyncDate?: string;
  syncUp?: number;
  syncDown?: number;
  snrUp?: number;
  snrDown?: number;
  attenuationUp?: number;
  attenuationDown?: number;
}

// ---------- API ----------

export const xdslLinesApi = {
  /** Liste les lignes d'un accès. */
  async list(accessName: string): Promise<string[]> {
    return ovhApi.get<string[]>(`/xdsl/${accessName}/lines`);
  },

  /** Récupère les détails d'une ligne. */
  async get(accessName: string, lineNumber: string): Promise<XdslLine> {
    return ovhApi.get<XdslLine>(`/xdsl/${accessName}/lines/${lineNumber}`);
  },

  /** Récupère les statistiques d'une ligne. */
  async getStatistics(accessName: string, lineNumber: string): Promise<any> {
    return ovhApi.get<any>(`/xdsl/${accessName}/lines/${lineNumber}/statistics`);
  },

  /** Récupère les profils DSLAM disponibles. */
  async getDslamAvailableProfiles(accessName: string, lineNumber: string): Promise<DslamProfile[]> {
    return ovhApi.get<DslamProfile[]>(`/xdsl/${accessName}/lines/${lineNumber}/dslamPort/availableProfiles`);
  },

  /** Change le profil DSLAM. */
  async changeDslamProfile(accessName: string, lineNumber: string, profile: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/lines/${lineNumber}/dslamPort/changeProfile`, { profile });
  },

  /** Récupère les infos du port DSLAM. */
  async getDslamPort(accessName: string, lineNumber: string): Promise<DslamPortInfo> {
    return ovhApi.get<DslamPortInfo>(`/xdsl/${accessName}/lines/${lineNumber}/dslamPort`);
  },

  /** Reset le port DSLAM. */
  async resetDslamPort(accessName: string, lineNumber: string): Promise<{ taskId: number }> {
    return ovhApi.post<{ taskId: number }>(`/xdsl/${accessName}/lines/${lineNumber}/dslamPort/reset`, {});
  },
};
