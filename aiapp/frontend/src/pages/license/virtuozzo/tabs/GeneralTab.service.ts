// ============================================================
// VIRTUOZZO GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { VirtuozzoLicense } from "../virtuozzo.types";

/** Récupère la liste des IDs de licences Virtuozzo */
export async function getVirtuozzoLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/virtuozzo");
}

/** Récupère les détails d'une licence Virtuozzo */
export async function getVirtuozzoLicense(licenseId: string): Promise<VirtuozzoLicense> {
  return ovhGet<VirtuozzoLicense>(`/license/virtuozzo/${licenseId}`);
}
