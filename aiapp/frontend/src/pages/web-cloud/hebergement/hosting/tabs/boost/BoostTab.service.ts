// ============================================================
// BOOST TAB SERVICE - API calls for BoostTab
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../../services/api";
import type { Hosting } from "../../hosting.types";

const BASE = "/hosting/web";

export const boostService = {
  // --- Hosting ---
  getHosting: (sn: string) => 
    ovhGet<Hosting>(`${BASE}/${sn}`),

  // --- Boost Info ---
  getBoostInfo: (sn: string) => 
    ovhGet<any>(`${BASE}/${sn}/boost`).catch(() => null),

  getBoostHistory: (sn: string) => 
    ovhGet<any[]>(`${BASE}/${sn}/boostHistory`).catch(() => []),

  // --- Available Offers ---
  getAvailableBoostOffers: (sn: string) => 
    ovhGet<any[]>(`${BASE}/${sn}/availableBoostOffer`).catch(() => []),

  // --- Activate/Deactivate ---
  activateBoost: (sn: string, offer: string) => 
    ovhPost<void>(`${BASE}/${sn}/requestBoost`, { offer }),

  deactivateBoost: (sn: string) => 
    ovhDelete<void>(`${BASE}/${sn}/requestBoost`),
};

export default boostService;
