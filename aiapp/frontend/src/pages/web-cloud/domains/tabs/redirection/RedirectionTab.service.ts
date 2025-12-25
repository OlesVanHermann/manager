// ============================================================
// SERVICE ISOLÉ : RedirectionTab - Gestion Redirections web
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { Redirection, RedirectionCreate } from "../../domains.types";

// ============ SERVICE ============

class RedirectionService {
  async listRedirections(domain: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/${domain}/redirection`);
  }

  async getRedirection(domain: string, id: number): Promise<Redirection> {
    return ovhGet<Redirection>(`/domain/${domain}/redirection/${id}`);
  }

  async createRedirection(domain: string, data: RedirectionCreate): Promise<Redirection> {
    return ovhPost<Redirection>(`/domain/${domain}/redirection`, data);
  }

  async updateRedirection(domain: string, id: number, data: Partial<RedirectionCreate>): Promise<void> {
    await ovhPut(`/domain/${domain}/redirection/${id}`, data);
  }

  async deleteRedirection(domain: string, id: number): Promise<void> {
    await ovhDelete(`/domain/${domain}/redirection/${id}`);
  }
}

export const redirectionService = new RedirectionService();
