// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE / GENERAL - Service ISOLÉ
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../services/api";
import type { Container } from "../object-storage.types";

// ======================== API ========================

export async function getContainers(projectId: string): Promise<Container[]> {
  return ovhGet<Container[]>(`/cloud/project/${projectId}/storage`);
}

export async function getContainer(projectId: string, region: string, containerId: string): Promise<Container> {
  const containers = await getContainers(projectId);
  const container = containers.find(c => c.name === containerId && c.region === region);
  if (!container) throw new Error("Container not found");
  return container;
}

export async function deleteContainer(projectId: string, region: string, containerId: string): Promise<void> {
  return ovhDelete(`/cloud/project/${projectId}/storage/${containerId}?region=${region}`);
}

export async function setContainerVisibility(projectId: string, region: string, containerId: string, isPublic: boolean): Promise<void> {
  return ovhPost(`/cloud/project/${projectId}/storage/${containerId}?region=${region}`, {
    containerType: isPublic ? "public" : "private",
  });
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function formatSize(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${bytes} B`;
}
