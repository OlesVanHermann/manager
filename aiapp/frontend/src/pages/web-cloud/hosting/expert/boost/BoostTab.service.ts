// ============================================================
// BOOST TAB SERVICE - API calls for BoostTab
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { Hosting } from "../../hosting.types";

const BASE = "/hosting/web";

export const boostService = {
  // --- Hosting ---
  getHosting: (sn: string) =>
    ovhGet<Hosting>(`${BASE}/${sn}`),

  // --- Boost Info ---
  getBoostInfo: (sn: string) =>
    ovhGet<any>(`${BASE}/${sn}/boost`).catch(() => null),

  // --- Boost History (list dates) ---
  getBoostHistory: (sn: string) =>
    ovhGet<string[]>(`${BASE}/${sn}/boostHistory`).catch(() => []),

  // --- Boost History Entry by date (from old_manager getHistoryEntry) ---
  getBoostHistoryEntry: (sn: string, date: string) =>
    ovhGet<any>(`${BASE}/${sn}/boostHistory/${date}`),

  // --- Available Offers ---
  getAvailableBoostOffers: (sn: string) =>
    ovhGet<any[]>(`${BASE}/${sn}/availableBoostOffer`).catch(() => []),

  // --- Activate Boost (from old_manager requestBoost) ---
  activateBoost: (sn: string, offer: string) =>
    ovhPost<any>(`${BASE}/${sn}/requestBoost`, { offer }),

  // --- Deactivate Boost (from old_manager disableBoost - POST with offer: null, NOT DELETE) ---
  deactivateBoost: (sn: string) =>
    ovhPost<any>(`${BASE}/${sn}/requestBoost`, { offer: null }),

  // --- Get boost price from catalog (from old_manager getBoostPrice) ---
  getBoostPrice: (ovhSubsidiary: string) =>
    ovhGet<any>(`/order/catalog/public/webHosting`, {
      params: { ovhSubsidiary },
    } as any),

  // --- Get tasks for changeSlot (from old_manager getTasks) ---
  getBoostTasks: async (sn: string) => {
    const [upgradeIds, downgradeIds] = await Promise.all([
      ovhGet<number[]>(`${BASE}/${sn}/tasks`, {
        params: { function: "changeSlot/upgrade" },
      } as any).catch(() => []),
      ovhGet<number[]>(`${BASE}/${sn}/tasks`, {
        params: { function: "changeSlot/downgrade" },
      } as any).catch(() => []),
    ]);
    return { upgradeIds, downgradeIds };
  },

  // --- Get all history entries with details ---
  getAllBoostHistoryDetails: async (sn: string) => {
    const dates = await ovhGet<string[]>(`${BASE}/${sn}/boostHistory`).catch(() => []);
    if (dates.length === 0) return [];

    return Promise.all(
      dates.map((date: string) => ovhGet<any>(`${BASE}/${sn}/boostHistory/${date}`))
    );
  },
};

export default boostService;
