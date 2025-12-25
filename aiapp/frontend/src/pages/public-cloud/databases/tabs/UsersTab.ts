// ============================================================
// PUBLIC-CLOUD / DATABASES / USERS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { DbUser } from "../databases.types";

// ======================== API ========================

export async function getUsers(projectId: string, engine: string, serviceId: string): Promise<DbUser[]> {
  return ovhGet<DbUser[]>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/user`);
}

export async function createUser(projectId: string, engine: string, serviceId: string, username: string, password: string): Promise<DbUser> {
  return ovhPost<DbUser>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/user`, { name: username, password });
}

export async function deleteUser(projectId: string, engine: string, serviceId: string, userId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}`);
}

export async function resetPassword(projectId: string, engine: string, serviceId: string, userId: string): Promise<{ password: string }> {
  return ovhPost<{ password: string }>(`/cloud/project/${projectId}/database/${engine}/${serviceId}/user/${userId}/credentials/reset`, {});
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export function getUserStatusClass(status: string): string {
  const classes: Record<string, string> = {
    READY: "users-badge-success",
    PENDING: "users-badge-warning",
  };
  return classes[status] || "";
}
