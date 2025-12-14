// ============================================================
// PROCEDURES SERVICE - KYC Fraud et MFA Disable
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
  // Statut possible: "required" (documents nécessaires), "pending" (en cours de vérification), "none" (pas de procédure)
}

export interface MfaDisableStatus extends ProcedureStatus {
  // Statut possible: "open" (procédure en cours), "closed" (terminé)
}

export interface UploadLink {
  link: string;
  method: string;
  headers: Record<string, string>;
}

// ============ KYC / FRAUD PROCEDURE ============

export async function getFraudStatus(): Promise<FraudStatus> {
  try {
    const status = await ovhGet<FraudStatus>("/me/procedure/fraud");
    return status;
  } catch {
    // Si erreur (404 = pas de procédure), retourner status "none"
    return { status: "none" };
  }
}

export async function initFraudProcedure(numberOfDocuments: number): Promise<{ uploadLinks: UploadLink[] }> {
  return ovhPost<{ uploadLinks: UploadLink[] }>("/me/procedure/fraud", { numberOfDocuments });
}

export async function finalizeFraudProcedure(): Promise<void> {
  await ovhPost("/me/procedure/fraud/finalize", {});
}

// ============ MFA DISABLE PROCEDURE ============

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

export async function initMfaDisableProcedure(numberOfDocuments: number): Promise<{ uploadLinks: UploadLink[] }> {
  return ovhPost<{ uploadLinks: UploadLink[] }>("/me/procedure/disableMfa", { numberOfDocuments });
}

export async function finalizeMfaDisableProcedure(): Promise<void> {
  await ovhPost("/me/procedure/disableMfa/finalize", {});
}

// ============ IDENTITY PROCEDURE ============

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
