// ============================================================
// PUBLIC-CLOUD / KUBERNETES / KUBECONFIG - Service ISOLÉ
// ============================================================

import { ovhPost } from "../../../../services/api";

// ======================== API ========================

export async function getKubeconfig(projectId: string, kubeId: string): Promise<string> {
  const resp = await ovhPost<{ content: string }>(`/cloud/project/${projectId}/kube/${kubeId}/kubeconfig`, {});
  return resp.content;
}

// ======================== Helpers (DUPLIQUÉS) ========================

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
