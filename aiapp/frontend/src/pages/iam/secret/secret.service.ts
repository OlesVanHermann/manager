// Service pour la page principale Secret Manager
import { ovhGet } from "../../../services/api";
import type { SecretManager } from "./secret.types";

export async function getSecretManager(serviceName: string): Promise<SecretManager> {
  return ovhGet<SecretManager>(`/secret/${serviceName}`);
}
