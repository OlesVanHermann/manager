import { apiClient } from "../../../../../../services/api";
import type { PdbLogEntry } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const logsService = {
  async getLogs(serviceName: string): Promise<PdbLogEntry[]> {
    return apiClient.get(`${BASE_PATH}/${serviceName}/log`);
  },
};
