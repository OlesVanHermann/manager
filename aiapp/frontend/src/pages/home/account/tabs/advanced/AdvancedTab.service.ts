// ============================================================
// ADVANCED TAB SERVICE - Service ISOLÉ pour les paramètres avancés
// ============================================================

import { ovhGet, ovhPut } from "../../../../../services/api";

// ============ TYPES ============

export interface DeveloperModeStatus {
  enabled: boolean;
}

// ============ BETA PREFERENCES API ============

/** Récupère la préférence beta de l'utilisateur */
export async function getBetaPreference(): Promise<boolean> {
  try {
    const prefs = await ovhGet<{ value: string }>("/me/preferences/manager/BETA");
    return prefs?.value === "true";
  } catch {
    return false;
  }
}

/** Met à jour la préférence beta */
export async function setBetaPreference(enabled: boolean): Promise<void> {
  await ovhPut("/me/preferences/manager/BETA", { value: enabled ? "true" : "false" });
}

// ============ DEVELOPER MODE API ============

/** Récupère le statut du mode développeur */
export async function getDeveloperMode(): Promise<DeveloperModeStatus> {
  try {
    const prefs = await ovhGet<{ value: string }>("/me/preferences/manager/DEVELOPER_MODE");
    return { enabled: prefs?.value === "true" };
  } catch {
    return { enabled: false };
  }
}

/** Met à jour le mode développeur */
export async function updateDeveloperMode(enabled: boolean): Promise<void> {
  await ovhPut("/me/preferences/manager/DEVELOPER_MODE", { value: enabled ? "true" : "false" });
}
