// ============================================================
// SERVICE VOIP - Isolé pour VoipTab (Pack xDSL)
// ============================================================

import { ovhApi } from '../../../../../../services/api';
import type { VoipLine } from '../../pack-xdsl.types';

class VoipService {
  /** Récupère les lignes VoIP d'un pack. */
  async getVoipLines(packName: string): Promise<VoipLine[]> {
    const ids = await ovhApi.get<string[]>(`/pack/xdsl/${packName}/voipLine/services`).catch(() => []);
    return Promise.all(
      ids.map(id =>
        ovhApi.get<VoipLine>(`/telephony/${id.split('/')[0]}/line/${id}`)
          .catch(() => ({ serviceName: id, number: id, status: 'unknown', description: '' }))
      )
    );
  }
}

export const voipService = new VoipService();
