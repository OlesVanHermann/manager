// ============================================================
// LOCAL SEO TAB SERVICE - API calls for LocalSeoTab
// (from old_manager hosting-local-seo.service.js)
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { LocalSeoLocation } from "../../hosting.types";

const BASE = "/hosting/web";

export const localseoService = {
  // --- Local SEO Accounts (from old_manager getAccounts) ---
  listAccounts: (sn: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/localSeo/account`).catch(() => []),

  getAccount: (sn: string, accountId: number) =>
    ovhGet<{
      id: number;
      email: string;
      status: string;
      creationDate: string;
    }>(`${BASE}/${sn}/localSeo/account/${accountId}`),

  // Login to account (from old_manager login) - returns SSO URL
  loginAccount: (sn: string, accountId: number) =>
    ovhPost<{ url: string }>(`${BASE}/${sn}/localSeo/account/${accountId}/login`, {}),

  // Get all accounts with details
  getAllAccounts: async (sn: string) => {
    const ids = await localseoService.listAccounts(sn);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id: number) => localseoService.getAccount(sn, id)));
  },

  // --- Local SEO Locations (from old_manager getLocations) ---
  listLocations: (sn: string) =>
    ovhGet<number[]>(`${BASE}/${sn}/localSeo/location`).catch(() => []),

  getLocation: (sn: string, locationId: number) =>
    ovhGet<{
      id: number;
      name: string;
      address: string;
      city: string;
      country: string;
      status: string;
      creationDate: string;
    }>(`${BASE}/${sn}/localSeo/location/${locationId}`),

  // Delete location (from old_manager deleteLocation - via terminate)
  deleteLocation: (sn: string, locationId: number) =>
    ovhPost<void>(`${BASE}/${sn}/localSeo/location/${locationId}/terminate`, {}),

  // Get all locations with details
  getAllLocations: async (sn: string) => {
    const ids = await localseoService.listLocations(sn);
    if (ids.length === 0) return [];
    return Promise.all(ids.map((id: number) => localseoService.getLocation(sn, id)));
  },

  // --- Order (not from old_manager API but needed for UI) ---
  orderLocalSeo: (sn: string, country: string) =>
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, {
      planCode: `localSeo-${country}`,
      quantity: 1,
    }),

  // --- Aliases for backward compatibility ---
  listLocalSeoLocations: (sn: string) => localseoService.listLocations(sn),
  getLocalSeoLocation: (sn: string, id: number) => localseoService.getLocation(sn, id),
  terminateLocalSeo: (sn: string, id: number) => localseoService.deleteLocation(sn, id),
};

export default localseoService;
