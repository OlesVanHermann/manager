// ============================================================
// PROCEDURES SERVICE - KYC Fraud, Identity et MFA Disable
// Utilise le helper centralisé api.ts
// ============================================================

import { ovhGet, ovhPost } from "./api";

// ============ TYPES ============

export interface ProcedureStatus {
  status: "required" | "open" | "closed" | "pending" | "none";
  required?: boolean;
  finalized?: boolean;
}

export interface FraudStatus extends ProcedureStatus {
  ticketId?: string;
  documentsRequired?: boolean;
}

export interface MfaDisableStatus extends ProcedureStatus {}

export interface UploadLink {
  link: string;
  method: string;
  headers: Record<string, string>;
}

export interface InitProcedureResponse {
  uploadLinks: UploadLink[];
}

// ============ KYC / FRAUD PROCEDURE ============

/** Récupère le statut de la procédure KYC/Fraud. */
export async function getFraudStatus(): Promise<FraudStatus> {
  try {
    const status = await ovhGet<FraudStatus>("/me/procedure/fraud");
    return status;
  } catch {
    return { status: "none" };
  }
}

/** Initie une procédure KYC avec le nombre de documents à uploader. Retourne les liens d'upload. */
export async function initFraudProcedure(numberOfDocuments: number): Promise<InitProcedureResponse> {
  return ovhPost<InitProcedureResponse>("/me/procedure/fraud", { numberOfDocuments });
}

/** Upload un fichier vers le lien fourni par OVH. */
export async function uploadDocument(uploadLink: UploadLink, file: File): Promise<void> {
  const response = await fetch(uploadLink.link, {
    method: uploadLink.method,
    headers: {
      ...uploadLink.headers,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
}

/** Finalise la procédure KYC après upload des documents. */
export async function finalizeFraudProcedure(): Promise<void> {
  await ovhPost("/me/procedure/fraud/finalize", {});
}

// ============ IDENTITY PROCEDURE ============

/** Récupère le statut de la procédure d'identité. */
export async function getIdentityStatus(): Promise<ProcedureStatus> {
  try {
    const status = await ovhGet<ProcedureStatus>("/me/procedure/identity");
    return status;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404) {
      return { status: "none" };
    }
    throw err;
  }
}

/** Initie une procédure d'identité avec le nombre de documents. */
export async function initIdentityProcedure(numberOfDocuments: number): Promise<InitProcedureResponse> {
  return ovhPost<InitProcedureResponse>("/me/procedure/identity", { numberOfDocuments });
}

/** Finalise la procédure d'identité. */
export async function finalizeIdentityProcedure(): Promise<void> {
  await ovhPost("/me/procedure/identity/finalize", {});
}

// ============ MFA DISABLE PROCEDURE ============

/** Récupère le statut de la procédure de désactivation MFA. */
export async function getMfaDisableStatus(): Promise<MfaDisableStatus> {
  try {
    const status = await ovhGet<MfaDisableStatus>("/me/procedure/disableMfa");
    return status;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 404) {
      return { status: "none" };
    }
    throw err;
  }
}

/** Initie une procédure de désactivation MFA. */
export async function initMfaDisableProcedure(numberOfDocuments: number): Promise<InitProcedureResponse> {
  return ovhPost<InitProcedureResponse>("/me/procedure/disableMfa", { numberOfDocuments });
}

/** Finalise la procédure de désactivation MFA. */
export async function finalizeMfaDisableProcedure(): Promise<void> {
  await ovhPost("/me/procedure/disableMfa/finalize", {});
}
