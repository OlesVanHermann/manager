// ============================================================
// GENERAL TAB SERVICE - Service ISOLÉ pour l'édition du profil
// Import UNIQUEMENT depuis ../../account.types (niveau NAV2)
// ============================================================

import { ovhGet, ovhPut } from "../../../../../services/api";

// ============ TYPES LOCAUX ============

export interface ProfileUpdateData {
  firstname?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
}

// ============ API ============

/** Met à jour le profil utilisateur */
export async function updateProfile(data: ProfileUpdateData): Promise<void> {
  await ovhPut("/me", data);
}

/** Récupère le profil utilisateur */
export async function getProfile(): Promise<Record<string, unknown>> {
  return ovhGet("/me");
}
