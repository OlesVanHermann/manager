// ============================================================
// CRON TAB SERVICE - API calls for CronTab
// ============================================================

import { ovhGet, ovhPost, ovhPut, ovhDelete } from "../../../../../services/api";
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

  // Update cron with command normalization (from old_manager editCron - strip ./ from command)
  updateCron: (sn: string, id: number, data: Partial<CronJob>) => {
    const normalizedData = { ...data };
    // Strip ./ from command like old_manager does
    if (normalizedData.command && normalizedData.command.startsWith("./")) {
      normalizedData.command = normalizedData.command.slice(2);
    }
    return ovhPut<void>(`${BASE}/${sn}/cron/${id}`, normalizedData);
  },

  deleteCron: (sn: string, id: number) =>
    ovhDelete<void>(`${BASE}/${sn}/cron/${id}`),

  // --- Available Languages ---
  getAvailableLanguages: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/cronAvailableLanguage`).catch(() => ["php", "node", "python", "ruby"]),

  // ============ HELPERS (from old_manager hosting-cron.service.js) ============

  // Format language for display (from old_manager formatLanguage)
  formatLanguage: (language: string): string => {
    if (!language) return language;

    const LANGUAGES: Record<string, string> = {
      PHP: "PHP",
      NODEJS: "Node.js",
      PYTHON: "Python",
      RUBY: "Ruby",
      PERL: "Perl",
    };

    if (language.toLowerCase() === "other") {
      return "Other";
    }

    // Extract name and version (e.g., "php_82" -> "PHP 8.2")
    const versionPattern = /\d/;
    const versionIndex = language.search(versionPattern);

    if (versionIndex === -1) {
      return LANGUAGES[language.toUpperCase()] || language;
    }

    const name = language.substring(0, versionIndex).replace("_", "");
    const version = language.substring(versionIndex).replace("_", ".");

    return `${LANGUAGES[name.toUpperCase()] || name} ${version}`;
  },

  // Get all crons with details
  getAllCronsDetails: async (sn: string) => {
    const ids = await cronService.listCrons(sn);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id: number) => cronService.getCron(sn, id)));
  },

  // Get crons by status filter (from old_manager getCrons with filters)
  getCronsByStatus: (sn: string, status: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/cron`, { params: { status } } as any),
};

export default cronService;
