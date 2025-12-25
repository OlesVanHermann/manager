// ============================================================
// KYC TAB SERVICE - Service ISOLÉ pour la vérification d'identité
// ============================================================

import { ovhGet, ovhPost } from "../../../../../services/api";

// ============ TYPES ============

export interface KycProcedure {
  id: number;
  creationDate: string;
  lastUpdateDate: string;
  status: "cancelled" | "expired" | "ko" | "ok" | "open" | "pending" | "refused";
  ticketId?: number;
}

export interface KycDocument {
  id: string;
  creationDate: string;
  name: string;
  size: number;
  status: "pending" | "validated" | "rejected";
}

export interface FraudStatus {
  status: "ok" | "required" | "pending" | "refused" | "none" | "open" | "closed";
}

export interface UploadLink {
  url: string;
  method: string;
  headers?: Record<string, string>;
}

export interface InitProcedureResponse {
  uploadLinks: UploadLink[];
}

// ============ HELPERS LOCAUX ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    cancelled: "Annulée",
    expired: "Expirée",
    ko: "Rejetée",
    ok: "Validée",
    open: "En cours",
    pending: "En attente",
    refused: "Refusée",
    required: "Requise",
    none: "Non requise",
    closed: "Terminée",
  };
  return labels[status] || status;
}

// ============ FRAUD STATUS API ============

export async function getFraudStatus(): Promise<FraudStatus> {
  try {
    return await ovhGet<FraudStatus>("/me/procedure/fraud");
  } catch {
    return { status: "none" };
  }
}

export async function initFraudProcedure(numberOfDocuments: number): Promise<InitProcedureResponse> {
  return ovhPost<InitProcedureResponse>("/me/procedure/fraud", { numberOfDocuments });
}

export async function uploadDocument(uploadLink: UploadLink, file: File): Promise<void> {
  await fetch(uploadLink.url, {
    method: uploadLink.method || "PUT",
    headers: uploadLink.headers,
    body: file,
  });
}

export async function finalizeFraudProcedure(): Promise<void> {
  await ovhPost("/me/procedure/fraud/finalize", {});
}

// ============ KYC PROCEDURES API ============

export async function getProcedureIds(): Promise<number[]> {
  try {
    return await ovhGet<number[]>("/me/procedure/identity");
  } catch {
    return [];
  }
}

export async function getProcedure(id: number): Promise<KycProcedure | null> {
  try {
    return await ovhGet<KycProcedure>(`/me/procedure/identity/${id}`);
  } catch {
    return null;
  }
}

export async function getProcedures(): Promise<KycProcedure[]> {
  const ids = await getProcedureIds();
  const procedures = await Promise.all(ids.map((id) => getProcedure(id)));
  return procedures
    .filter((p): p is KycProcedure => p !== null)
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
}

export async function createProcedure(): Promise<KycProcedure> {
  return ovhPost<KycProcedure>("/me/procedure/identity", {});
}
