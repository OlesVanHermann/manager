// ============================================================
// EMAILS TAB SERVICE - API calls for EmailsTab
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "../../../../../services/api";
import type { EmailQuota } from "../../hosting.types";

const BASE = "/hosting/web";

export const emailsService = {
  // --- Email Quota & State ---
  getEmailQuota: (sn: string) => 
    ovhGet<EmailQuota>(`${BASE}/${sn}/email`).catch(() => null),

  getEmailState: (sn: string) => 
    ovhGet<any>(`${BASE}/${sn}/email`).catch(() => null),

  updateEmailState: (sn: string, state: string) => 
    ovhPut<void>(`${BASE}/${sn}/email`, { state }),

  // --- Bounces ---
  getEmailBounces: (sn: string) => 
    ovhGet<string[]>(`${BASE}/${sn}/email/bounces`).catch(() => []),

  updateEmailBounce: (sn: string, email: string) => 
    ovhPut<void>(`${BASE}/${sn}/email`, { bounce: email }),

  // --- Purge ---
  purgeEmails: (sn: string) => 
    ovhPost<void>(`${BASE}/${sn}/email/request`, { action: "PURGE" }),

  // --- Metrics ---
  getEmailMetricsToken: (sn: string) => 
    ovhGet<any>(`${BASE}/${sn}/metricsToken`).catch(() => null),
};

export default emailsService;
