// ============================================================
// LOCAL SEO TAB SERVICE - API calls for LocalSeoTab
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { LocalSeoLocation } from "../../hosting.types";

const BASE = "/hosting/web";

export const localseoService = {
  // --- Local SEO Locations ---
  listLocalSeoLocations: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/localSeo/location`).catch(() => []),

  getLocalSeoLocation: (sn: string, id: string) => 
    ovhGet<LocalSeoLocation>(`${BASE}/${sn}/localSeo/location/${id}`),

  // --- Account ---
  getLocalSeoAccount: (sn: string, id: string) => 
    ovhGet<any>(`${BASE}/${sn}/localSeo/location/${id}/account`),

  // --- Login ---
  loginLocalSeo: (sn: string, id: string) => 
    ovhPost<any>(`${BASE}/${sn}/localSeo/location/${id}/serviceInfosUpdate`, {}),

  // --- Terminate ---
  terminateLocalSeo: (sn: string, id: string) => 
    ovhPost<void>(`${BASE}/${sn}/localSeo/location/${id}/terminate`, {}),

  // --- Order ---
  orderLocalSeo: (sn: string, country: string) => 
    ovhPost<any>(`/order/cartServiceOption/webHosting/${sn}`, { 
      planCode: `localSeo-${country}`, 
      quantity: 1 
    }),
};

export default localseoService;
