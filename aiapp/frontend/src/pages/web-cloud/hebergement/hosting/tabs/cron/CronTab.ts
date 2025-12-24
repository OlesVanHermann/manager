// ============================================================
// CRON TAB SERVICE - API calls for CronTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../../services/api";
import type { CronJob } from "../../hosting.types";

const BASE = "/hosting/web";

export const cronService = {
  // --- Crons ---
  listCrons: (sn: string) => 
    ovhGet<number[]>(`${BASE}/${sn}/cron`),

  getCron: (sn: string, id: number) => 
    ovhGet<CronJob>(`${BASE}/${sn}/cron/${id}`),

  createCron: (sn: string, data: {
    command: string;
    frequency: string;
    language: string;
    description?: string;
    email?: string;
    status?: string;
  }) => 
    ovhPost<void>(`${BASE}/${sn}/cron`, data),

  updateCron: (sn: string, id: number, data: Partial<CronJob>) => 
    ovhPut<void>(`${BASE}/${sn}/cron/${id}`, data),

  deleteCron: (sn: string, id: number) => 
    ovhDelete<void>(`${BASE}/${sn}/cron/${id}`),

  // --- Available Languages ---
  getAvailableLanguages: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/cronAvailableLanguage`).catch(() => ["php", "node", "python", "ruby"]),
};

export default cronService;
