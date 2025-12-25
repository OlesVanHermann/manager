// Service pour la page principale HSM
import { ovhGet } from "../../../services/api";
import type { Hsm } from "./hsm.types";

export async function getHsm(serviceName: string): Promise<Hsm> {
  return ovhGet<Hsm>(`/dedicated/nasha/${serviceName}`);
}
