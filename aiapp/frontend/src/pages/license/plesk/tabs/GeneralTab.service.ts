// ============================================================
// PLESK GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { PleskLicense } from "../plesk.types";

/** Récupère la liste des IDs de licences Plesk */
export async function getPleskLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/plesk");
}

/** Récupère les détails d'une licence Plesk */
export async function getPleskLicense(licenseId: string): Promise<PleskLicense> {
  return ovhGet<PleskLicense>(`/license/plesk/${licenseId}`);
}
