// ============================================================
// API EXCHANGE - MFA (Multi-Factor Authentication)
// Endpoints: /msServices/{service}/account/{user}/mfa/*
// API NON DOCUMENTÉE - Basée sur OvhApiMsServices (AngularJS)
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/msServices";

// ---------- TYPES ----------

export interface MfaStatus {
  status: "disabled" | "enabled" | "needsReset";
  lastUpdate?: string;
}

// ---------- MFA ACCOUNT ----------

/**
 * Créer/configurer MFA pour un compte (APIv6)
 * Équivalent old_manager: OvhApiMsServices.Account().Mfa().v6().create()
 */
export async function create(serviceName: string, userPrincipalName: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/account/${userPrincipalName}/mfa`, {
    method: "POST",
  });
}

/**
 * Activer MFA pour un compte (APIv6)
 * Équivalent old_manager: enableMfa
 */
export async function enable(serviceName: string, userPrincipalName: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/account/${userPrincipalName}/mfa/enable`, {
    method: "POST",
  });
}

/**
 * Désactiver MFA pour un compte (APIv6)
 * Équivalent old_manager: disableMfa
 */
export async function disable(
  serviceName: string,
  userPrincipalName: string,
  period?: number
): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/account/${userPrincipalName}/mfa/disable`, {
    method: "POST",
    body: period ? JSON.stringify({ period }) : undefined,
  });
}

/**
 * Supprimer MFA d'un compte (APIv6)
 * Équivalent old_manager: OvhApiMsServices.Account().Mfa().v6().delete()
 */
export async function remove(serviceName: string, userPrincipalName: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/account/${userPrincipalName}/mfa`, {
    method: "DELETE",
  });
}

export { remove as delete };

/**
 * Réinitialiser MFA pour un compte (APIv6)
 * Équivalent old_manager: resetMfa
 */
export async function reset(serviceName: string, userPrincipalName: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/account/${userPrincipalName}/mfa/reset`, {
    method: "POST",
  });
}

// ---------- MFA GLOBAL ----------

/**
 * Activer MFA sur tous les comptes (APIv6)
 * Équivalent old_manager: createMfaOnAllAccount
 */
export async function enableOnAllUsers(serviceName: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/createMfaOnAllUsers`, {
    method: "POST",
  });
}

/**
 * Supprimer MFA de tous les comptes (APIv6)
 * Équivalent old_manager: deleteMfaOnAllAccounts
 */
export async function disableOnAllUsers(serviceName: string): Promise<void> {
  await apiFetch(`${BASE}/${serviceName}/removeMfaOnAllUsers`, {
    method: "DELETE",
  });
}
