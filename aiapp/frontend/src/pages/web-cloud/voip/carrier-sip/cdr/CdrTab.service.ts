// ============================================================
// CDR TAB SERVICE - Service ISOLÉ (défactorisé)
// ============================================================

import { ovhApi } from "../../../../../services/api";
import type { CdrRecord } from "../carrier-sip.types";

// ============================================================
// SERVICE ISOLÉ - Aucun import croisé entre tabs
// ============================================================

// GET /telephony/{ba}/carrierSip/{sn}/cdrs - Récupérer les CDR (Call Detail Records)
async function getCdrRecords(billingAccount: string, serviceName: string): Promise<CdrRecord[]> {
  // API correcte: GET /telephony/{ba}/carrierSip/{sn}/cdrs
  return ovhApi.get<CdrRecord[]>(`/telephony/${billingAccount}/carrierSip/${serviceName}/cdrs`).catch(() => []);
}

async function getCdr(billingAccount: string, serviceName: string): Promise<CdrRecord[]> {
  // API correcte: GET /telephony/{ba}/carrierSip/{sn}/cdrs
  return ovhApi.get<CdrRecord[]>(`/telephony/${billingAccount}/carrierSip/${serviceName}/cdrs`).catch(() => []);
}

// Helper DUPLIQUÉ volontairement (défactorisation)
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Helper DUPLIQUÉ volontairement (défactorisation)
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR");
}

export const cdrService = {
  getCdrRecords,
  getCdr,
  formatDuration,
  formatDate,
};
