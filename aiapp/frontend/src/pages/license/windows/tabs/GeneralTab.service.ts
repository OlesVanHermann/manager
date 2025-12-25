// ============================================================
// WINDOWS GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { WindowsLicense } from "../windows.types";

/** Récupère la liste des IDs de licences Windows */
export async function getWindowsLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/windows");
}

/** Récupère les détails d'une licence Windows */
export async function getWindowsLicense(licenseId: string): Promise<WindowsLicense> {
  return ovhGet<WindowsLicense>(`/license/windows/${licenseId}`);
}
