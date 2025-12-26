// ============================================================
// CPANEL GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CpanelLicense } from "../../cpanel.types";

/** Récupère la liste des IDs de licences cPanel */
export async function getCpanelLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/cpanel");
}

/** Récupère les détails d'une licence cPanel */
export async function getCpanelLicense(licenseId: string): Promise<CpanelLicense> {
  return ovhGet<CpanelLicense>(`/license/cpanel/${licenseId}`);
}
