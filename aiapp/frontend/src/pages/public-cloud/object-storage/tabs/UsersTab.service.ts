// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE / USERS - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { S3User } from "../object-storage.types";

// ======================== API ========================

export async function getS3Users(projectId: string): Promise<S3User[]> {
  return ovhGet<S3User[]>(`/cloud/project/${projectId}/user`).catch(() => []);
}

export async function createS3User(projectId: string, description: string): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/user`, {
    description,
    role: "objectstore_operator",
  });
}

export async function deleteS3User(projectId: string, userId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/user/${userId}`);
}

export async function getS3Credentials(projectId: string, userId: string): Promise<{ access: string; secret: string }> {
  return ovhPost<{ access: string; secret: string }>(`/cloud/project/${projectId}/user/${userId}/s3Credentials`, {});
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR");
}
