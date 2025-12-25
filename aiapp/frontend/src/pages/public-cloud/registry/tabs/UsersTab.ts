// ============================================================
// PUBLIC-CLOUD / REGISTRY / USERS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { RegistryUser } from "../registry.types";

// ======================== API ========================

export async function getUsers(projectId: string, registryId: string): Promise<RegistryUser[]> {
  return ovhGet<RegistryUser[]>(`/cloud/project/${projectId}/containerRegistry/${registryId}/users`).catch(() => []);
}

export async function createUser(projectId: string, registryId: string, email: string, login: string): Promise<RegistryUser> {
  return ovhPost<RegistryUser>(`/cloud/project/${projectId}/containerRegistry/${registryId}/users`, {
    email,
    login,
  });
}

export async function deleteUser(projectId: string, registryId: string, userId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/containerRegistry/${registryId}/users/${userId}`);
}

// ======================== Helpers (DUPLIQUÉS) ========================

// Pas de helpers spécifiques pour ce tab
