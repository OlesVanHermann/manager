// ============================================================
// SERVICE ISOLÉ : DynHostTab - Gestion DynHost Records + Logins
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
import type { DynHostRecord, DynHostLogin } from "../../domains.types";

// ============ SERVICE ============

class DynHostService {
  // -------- DYNHOST RECORDS --------
  async listDynHostRecords(zone: string): Promise<number[]> {
    return ovhGet<number[]>(`/domain/zone/${zone}/dynHost/record`);
  }

  async getDynHostRecord(zone: string, id: number): Promise<DynHostRecord> {
    return ovhGet<DynHostRecord>(`/domain/zone/${zone}/dynHost/record/${id}`);
  }

  async createDynHostRecord(zone: string, data: { subDomain: string; ip: string }): Promise<DynHostRecord> {
    return ovhPost<DynHostRecord>(`/domain/zone/${zone}/dynHost/record`, data);
  }

  async updateDynHostRecord(zone: string, id: number, data: { ip: string; subDomain?: string }): Promise<void> {
    await ovhPut(`/domain/zone/${zone}/dynHost/record/${id}`, data);
  }

  async deleteDynHostRecord(zone: string, id: number): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dynHost/record/${id}`);
  }

  // -------- DYNHOST LOGINS --------
  async listDynHostLogins(zone: string): Promise<string[]> {
    return ovhGet<string[]>(`/domain/zone/${zone}/dynHost/login`);
  }

  async getDynHostLogin(zone: string, login: string): Promise<DynHostLogin> {
    return ovhGet<DynHostLogin>(`/domain/zone/${zone}/dynHost/login/${login}`);
  }

  async createDynHostLogin(zone: string, data: { loginSuffix: string; password: string; subDomain: string }): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/dynHost/login`, data);
  }

  async updateDynHostLogin(zone: string, login: string, data: { password?: string; subDomain?: string }): Promise<void> {
    await ovhPut(`/domain/zone/${zone}/dynHost/login/${login}`, data);
  }

  async deleteDynHostLogin(zone: string, login: string): Promise<void> {
    await ovhDelete(`/domain/zone/${zone}/dynHost/login/${login}`);
  }

  // Alias for modals
  async deleteLogin(zone: string, login: string): Promise<void> {
    return this.deleteDynHostLogin(zone, login);
  }

  async updateLogin(zone: string, login: string, data: { subDomain?: string }): Promise<void> {
    return this.updateDynHostLogin(zone, login, data);
  }

  async changeLoginPassword(zone: string, login: string, password: string): Promise<void> {
    await ovhPost(`/domain/zone/${zone}/dynHost/login/${login}/changePassword`, { password });
  }
}

export const dynHostService = new DynHostService();
