// ============================================================
// EMAIL SERVICE DISPATCHER
// Détection automatique du type de service email
// ============================================================

import { apiFetch } from "../../../../services/api";

// ---------- TYPES ----------

/**
 * Types de services email OVH
 *
 * - exchange: Microsoft Exchange (org/service format)
 * - emailpro: Email Pro standard
 * - mxplan-modern: MXPlan migré (utilise /email/mxplan)
 * - mxplan-legacy: MXPlan legacy (utilise /email/domain)
 * - zimbra: Zimbra collaborative
 */
export type EmailServiceType =
  | "exchange"
  | "emailpro"
  | "mxplan-modern"
  | "mxplan-legacy"
  | "zimbra";

export interface EmailServiceInfo {
  type: EmailServiceType;
  serviceId: string;
  apiBase: string;
  api2Base: string;
  displayName: string;
}

// Cache pour éviter les appels répétés
const serviceTypeCache = new Map<string, EmailServiceType>();

// ---------- DETECTION ----------

/**
 * Détecte le type de service email à partir de l'ID
 *
 * Logique de détection:
 * 1. Format "org/service" → Exchange ou Zimbra
 * 2. Tester /email/pro/{service}/billingMigrated
 *    - Succès → EmailPro
 *    - Échec → MXPlan Modern ou Legacy
 */
export async function detectServiceType(serviceId: string): Promise<EmailServiceType> {
  // Vérifier le cache
  const cached = serviceTypeCache.get(serviceId);
  if (cached) return cached;

  let detectedType: EmailServiceType;

  // 1. Format org/service → Exchange ou Zimbra
  if (serviceId.includes("/")) {
    const [org] = serviceId.split("/");
    // Zimbra a un format spécifique avec "zimbra" dans l'org
    if (org.toLowerCase().includes("zimbra")) {
      detectedType = "zimbra";
    } else {
      detectedType = "exchange";
    }
  } else {
    // 2. Tester si c'est EmailPro ou MXPlan
    try {
      await apiFetch(`/email/pro/${serviceId}/billingMigrated`, {
        method: "GET",
      });
      // Succès = EmailPro standard
      detectedType = "emailpro";
    } catch {
      // Échec = MXPlan (migré ou legacy)
      try {
        // Tester si c'est un MXPlan Modern (/email/mxplan)
        await apiFetch(`/email/mxplan/${serviceId}`, {
          method: "GET",
        });
        detectedType = "mxplan-modern";
      } catch {
        // Fallback = MXPlan Legacy (/email/domain)
        detectedType = "mxplan-legacy";
      }
    }
  }

  // Mettre en cache
  serviceTypeCache.set(serviceId, detectedType);
  return detectedType;
}

/**
 * Récupère les informations complètes du service
 */
export async function getServiceInfo(serviceId: string): Promise<EmailServiceInfo> {
  const type = await detectServiceType(serviceId);

  const configs: Record<EmailServiceType, Omit<EmailServiceInfo, "serviceId">> = {
    exchange: {
      type: "exchange",
      apiBase: "/email/exchange",
      api2Base: "/sws/exchange",
      displayName: "Microsoft Exchange",
    },
    emailpro: {
      type: "emailpro",
      apiBase: "/email/pro",
      api2Base: "/sws/emailpro",
      displayName: "Email Pro",
    },
    "mxplan-modern": {
      type: "mxplan-modern",
      apiBase: "/email/mxplan",
      api2Base: "/sws/emailpro", // Même 2API avec isMXPlan=true
      displayName: "MX Plan",
    },
    "mxplan-legacy": {
      type: "mxplan-legacy",
      apiBase: "/email/domain",
      api2Base: "/sws/email-domain",
      displayName: "Email Domain",
    },
    zimbra: {
      type: "zimbra",
      apiBase: "/email/zimbra",
      api2Base: "/v2/email/zimbra/platform",
      displayName: "Zimbra",
    },
  };

  return {
    ...configs[type],
    serviceId,
  };
}

// ---------- HELPERS ----------

/**
 * Vérifie si un service est de type MXPlan (modern ou legacy)
 */
export function isMXPlan(type: EmailServiceType): boolean {
  return type === "mxplan-modern" || type === "mxplan-legacy";
}

/**
 * Vérifie si un service supporte les mailing lists
 */
export function supportsMailingLists(type: EmailServiceType): boolean {
  return type !== "zimbra"; // Zimbra n'a pas de mailing lists natives
}

/**
 * Vérifie si un service supporte les ressources (salles, équipements)
 */
export function supportsResources(type: EmailServiceType): boolean {
  return type === "exchange"; // Exchange only
}

/**
 * Vérifie si un service supporte les appareils ActiveSync
 */
export function supportsDevices(type: EmailServiceType): boolean {
  return type === "exchange"; // Exchange only
}

/**
 * Vérifie si un service supporte les contacts externes
 */
export function supportsExternalContacts(type: EmailServiceType): boolean {
  return type === "exchange" || type === "emailpro";
}

/**
 * Vérifie si un service supporte les disclaimers (signatures)
 */
export function supportsDisclaimers(type: EmailServiceType): boolean {
  return type === "exchange" || type === "emailpro";
}

/**
 * Vérifie si un service permet de commander des comptes supplémentaires
 */
export function supportsAccountOrdering(type: EmailServiceType): boolean {
  return type === "exchange" || type === "emailpro";
}

// ---------- CACHE MANAGEMENT ----------

/**
 * Vide le cache de détection (utile après changement de service)
 */
export function clearCache(): void {
  serviceTypeCache.clear();
}

/**
 * Vide le cache pour un service spécifique
 */
export function clearCacheFor(serviceId: string): void {
  serviceTypeCache.delete(serviceId);
}

/**
 * Précharge le type d'un service dans le cache
 */
export function preloadServiceType(serviceId: string, type: EmailServiceType): void {
  serviceTypeCache.set(serviceId, type);
}
