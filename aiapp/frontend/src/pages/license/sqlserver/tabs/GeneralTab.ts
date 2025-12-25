// ============================================================
// SQLSERVER GENERAL SERVICE - API isolée
// ============================================================

import { ovhGet } from "../../../../services/api";
import type { SqlServerLicense } from "../sqlserver.types";

/** Récupère la liste des IDs de licences SQL Server */
export async function getSqlServerLicenses(): Promise<string[]> {
  return ovhGet<string[]>("/license/sqlserver");
}

/** Récupère les détails d'une licence SQL Server */
export async function getSqlServerLicense(licenseId: string): Promise<SqlServerLicense> {
  return ovhGet<SqlServerLicense>(`/license/sqlserver/${licenseId}`);
}
