// ============================================================
// OKMS SERVICE - Service pour la page principale OKMS
// ============================================================

import { ovhGet } from "../../../services/api";
import type { OkmsInfo } from "./okms.types";

/** Récupère les informations d'un service OKMS. */
export async function getOkms(serviceName: string): Promise<OkmsInfo> {
  return ovhGet<OkmsInfo>(`/okms/resource/${serviceName}`);
}
