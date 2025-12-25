// ============================================================
// INPUTS TAB SERVICE - Service API isolé pour l'onglet Inputs
// ============================================================
// ⚠️ DÉFACTORISÉ : Ce service est ISOLÉ et ne doit JAMAIS être
// importé par un autre tab. Duplication volontaire.
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";
import type { Input } from "../dbaas-logs.types";

// ============================================================
// API INPUTS
// ============================================================

/** Récupère la liste des inputs d'un service. */
export async function getInputs(serviceName: string): Promise<Input[]> {
  const ids = await ovhGet<string[]>(`/dbaas/logs/${serviceName}/input`);
  const inputs = await Promise.all(
    ids.map((id) => ovhGet<Input>(`/dbaas/logs/${serviceName}/input/${id}`))
  );
  return inputs;
}

/** Crée un nouvel input. */
export async function createInput(
  serviceName: string,
  data: { title: string; engineId: string; streamId: string }
): Promise<Input> {
  return ovhPost<Input>(`/dbaas/logs/${serviceName}/input`, data);
}

// ============================================================
// SERVICE OBJECT
// ============================================================

export const inputsService = {
  getInputs,
  createInput,
};
