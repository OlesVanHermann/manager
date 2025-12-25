import { apiClient } from "../../../../../../services/api";
import type { PdbMetrics } from "../../private-database.types";

const BASE_PATH = "/hosting/privateDatabase";

export const metricsService = {
  async getMetrics(serviceName: string, period?: string): Promise<PdbMetrics> {
    const query = period ? `?period=${period}` : "";
    return apiClient.get(`${BASE_PATH}/${serviceName}/metrics${query}`);
  },
};
