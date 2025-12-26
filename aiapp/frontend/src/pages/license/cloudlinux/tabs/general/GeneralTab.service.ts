// ============================================================
// CLOUDLINUX GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../../services/api";
import type { CloudLinuxLicense } from "../../cloudlinux.types";

/** Récupère la liste des IDs de licences CloudLinux */
export async function getCloudLinuxLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/cloudlinux");
}

/** Récupère les détails d'une licence CloudLinux */
export async function getCloudLinuxLicense(licenseId: string): Promise<CloudLinuxLicense> {
  return ovhGet<CloudLinuxLicense>(`/license/cloudlinux/${licenseId}`);
}
