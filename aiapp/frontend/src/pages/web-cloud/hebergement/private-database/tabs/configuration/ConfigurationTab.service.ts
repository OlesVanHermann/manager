import { apiClient } from "../../../../../../services/api";
import type { PdbConfigParam, PdbTask } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const configurationService = {
  async getConfiguration(serviceName: string): Promise<PdbConfigParam[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/config`);
  },

  async updateConfiguration(serviceName: string, parameters: Record<string, string>): Promise<PdbTask> {
    return apiClient.put(`${BASE_PATH}/${serviceName}/config`, { parameters });
  },
};
