// ============================================================
// SERVICE ISOLÉ : UsersTab - Private Database
// ============================================================

import { apiClient } from "../../../../../../services/api";
import type { PdbUser, PdbTask } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const usersService = {
  // ---------- LIST / GET ----------
  async listUsers(serviceName: string): Promise<string[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/user`);
  },

  async getUser(serviceName: string, userName: string): Promise<PdbUser> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/user/${userName}`);
  },

  // ---------- CREATE / DELETE ----------
  async createUser(serviceName: string, userName: string, password: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/user`, { userName, password });
  },

  async deleteUser(serviceName: string, userName: string): Promise<PdbTask> {
    return apiClient.delete(`${BASE_PATH}/${serviceName}/user/${userName}`);
  },

  // ---------- PASSWORD ----------
  async changeUserPassword(serviceName: string, userName: string, password: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/user/${userName}/changePassword`, { password });
  },

  // ---------- GRANTS ----------
  async setUserGrant(serviceName: string, userName: string, databaseName: string, grant: string): Promise<PdbTask> {
    return apiClient.post(`${BASE_PATH}/${serviceName}/user/${userName}/grant/${databaseName}`, { grant });
  },
};
