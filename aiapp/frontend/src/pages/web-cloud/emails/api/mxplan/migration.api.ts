// ============================================================
// API MX PLAN - Migration vers autre service
// Endpoints: /email/domain/{domain}/account/{account}/migrate/*
// ============================================================

import { apiFetch } from "../../../../../services/api";

const BASE = "/email/domain";

// ---------- TYPES ----------

export interface MigrationDestinationService {
  name: string;
  type: "EMAIL_PRO" | "EXCHANGE" | "HOSTED_EXCHANGE" | "PROVIDER_EXCHANGE";
}

export interface MigrationDestinationDetails {
  destination: string;
  quota: number;
}

export interface MigrationCheckResult {
  error?: string[];
  warning?: string[];
}

// ---------- MIGRATION API ----------

/**
 * Liste des services de destination disponibles (APIv6)
 * Équivalent old_manager: getDestinationServices
 */
export async function getDestinationServices(
  domain: string,
  accountName: string,
  type?: "EMAIL_PRO" | "EXCHANGE" | "HOSTED_EXCHANGE" | "PROVIDER_EXCHANGE"
): Promise<string[]> {
  const params = type ? `?type=${type}` : "";
  return apiFetch<string[]>(
    `${BASE}/${domain}/account/${accountName}/migrate${params}`
  );
}

/**
 * Détails d'un service de destination (APIv6)
 * Équivalent old_manager: getDestinationService
 */
export async function getDestinationService(
  domain: string,
  accountName: string,
  destinationServiceName: string
): Promise<MigrationDestinationDetails> {
  return apiFetch<MigrationDestinationDetails>(
    `${BASE}/${domain}/account/${accountName}/migrate/${destinationServiceName}`
  );
}

/**
 * Liste des adresses email de destination disponibles (APIv6)
 * Équivalent old_manager: getDestinationEmailAddresses
 */
export async function getDestinationEmailAddresses(
  domain: string,
  accountName: string,
  destinationServiceName: string
): Promise<string[]> {
  return apiFetch<string[]>(
    `${BASE}/${domain}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress`
  );
}

/**
 * Vérifier si la migration est possible (APIv6)
 * Équivalent old_manager: checkMigrate
 */
export async function checkMigrate(
  domain: string,
  accountName: string,
  destinationServiceName: string,
  destinationEmailAddress: string
): Promise<MigrationCheckResult> {
  const result = await apiFetch<MigrationCheckResult>(
    `${BASE}/${domain}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress/${destinationEmailAddress}/checkMigrate`
  );

  // L'API retourne les erreurs dans le champ "error" même en cas de succès HTTP
  if (result.error && result.error.length > 0) {
    throw new Error(result.error.join(", "));
  }

  return result;
}

/**
 * Migrer le compte vers la destination (APIv6)
 * Équivalent old_manager: migrateAccountToDestinationAccount
 */
export async function migrate(
  domain: string,
  accountName: string,
  destinationServiceName: string,
  destinationEmailAddress: string,
  password: string
): Promise<void> {
  await apiFetch(
    `${BASE}/${domain}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress/${destinationEmailAddress}/migrate`,
    {
      method: "POST",
      body: JSON.stringify({ password }),
    }
  );
}

/**
 * Vérifier et migrer en une seule opération
 * Combine checkMigrate et migrate
 */
export async function checkAndMigrate(
  domain: string,
  accountName: string,
  destinationServiceName: string,
  destinationEmailAddress: string,
  password: string
): Promise<void> {
  // Vérifier d'abord si la migration est possible
  await checkMigrate(domain, accountName, destinationServiceName, destinationEmailAddress);

  // Si pas d'erreur, procéder à la migration
  await migrate(domain, accountName, destinationServiceName, destinationEmailAddress, password);
}
