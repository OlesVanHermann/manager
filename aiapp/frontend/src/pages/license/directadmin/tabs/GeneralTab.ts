// ============================================================
// DIRECTADMIN GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { DirectAdminLicense } from "../directadmin.types";

/** Récupère la liste des IDs de licences DirectAdmin */
export async function getDirectAdminLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/directadmin");
}

/** Récupère les détails d'une licence DirectAdmin */
export async function getDirectAdminLicense(licenseId: string): Promise<DirectAdminLicense> {
  return ovhGet<DirectAdminLicense>(`/license/directadmin/${licenseId}`);
}
