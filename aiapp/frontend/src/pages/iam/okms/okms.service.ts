// Service pour la page principale OKMS
import { ovhGet } from "../../../services/api";
import type { OkmsInfo } from "./okms.types";

export async function getOkms(serviceName: string): Promise<OkmsInfo> {
  return ovhGet<OkmsInfo>(`/okms/resource/${serviceName}`);
}
