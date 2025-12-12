import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

export interface SupportLevel {
  level: "standard" | "premium" | "premium-accredited" | "business" | "enterprise";
}

export interface MarketingConsent {
  denyAll: boolean;
  email?: {
    events: boolean;
    newProductRecommendation: boolean;
    newsletter: boolean;
    offerAndDiscount: boolean;
  };
  sms?: {
    events: boolean;
    newProductRecommendation: boolean;
    newsletter: boolean;
    offerAndDiscount: boolean;
  };
}

export interface PrivacyRequest {
  id: number;
  creationDate: string;
  status: "blocked" | "cancelled" | "completed" | "confirm_verification_code" | "in_progress";
  type: "erasure";
  ticketId?: number;
  reasons?: string[];
}

export interface PrivacyCapabilities {
  canRequestErasure: boolean;
  ineligibilityReasons?: string[];
}

export interface Consent {
  name: string;
  value: boolean;
}

export interface DeveloperMode {
  enabled: boolean;
}

export interface Preference {
  key: string;
  value: string;
}

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============ SUPPORT LEVEL ============

export async function getSupportLevel(credentials: OvhCredentials): Promise<SupportLevel> {
  return ovhRequest<SupportLevel>(credentials, "GET", "/me/supportLevel");
}

// ============ MARKETING ============

export async function getMarketing(credentials: OvhCredentials): Promise<MarketingConsent> {
  return ovhRequest<MarketingConsent>(credentials, "GET", "/me/marketing");
}

export async function updateMarketing(
  credentials: OvhCredentials,
  consent: MarketingConsent
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", "/me/marketing", consent);
}

// ============ PRIVACY / GDPR ============
// Note: Ces endpoints existent dans le manager officiel mais ne sont pas exposes publiquement.
// Les try/catch retournent des valeurs par defaut en cas de 404.

export async function getPrivacyRequests(credentials: OvhCredentials): Promise<number[]> {
  try {
    return await ovhRequest<number[]>(credentials, "GET", "/me/privacy/requests");
  } catch {
    console.warn("getPrivacyRequests: endpoint non disponible (404 attendu)");
    return [];
  }
}

export async function getPrivacyRequest(
  credentials: OvhCredentials,
  requestId: number
): Promise<PrivacyRequest> {
  return ovhRequest<PrivacyRequest>(credentials, "GET", `/me/privacy/requests/${requestId}`);
}

export async function getPrivacyCapabilities(credentials: OvhCredentials): Promise<PrivacyCapabilities> {
  try {
    return await ovhRequest<PrivacyCapabilities>(credentials, "GET", "/me/privacy/requests/capabilities");
  } catch {
    console.warn("getPrivacyCapabilities: endpoint non disponible (404 attendu)");
    return { canRequestErasure: false, ineligibilityReasons: ["API non disponible"] };
  }
}

export async function createErasureRequest(credentials: OvhCredentials): Promise<PrivacyRequest> {
  return ovhRequest<PrivacyRequest>(credentials, "POST", "/me/privacy/requests/erasure");
}

// ============ CONSENTS ============

export async function getConsents(credentials: OvhCredentials): Promise<string[]> {
  return ovhRequest<string[]>(credentials, "GET", "/me/consent");
}

export async function getConsent(credentials: OvhCredentials, name: string): Promise<Consent> {
  return ovhRequest<Consent>(credentials, "GET", `/me/consent/${name}`);
}

export async function updateConsent(
  credentials: OvhCredentials,
  name: string,
  value: boolean
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", `/me/consent/${name}/decision`, { value });
}

// ============ PRIVACY / GDPR (suite) ============

export async function getAllPrivacyRequests(credentials: OvhCredentials): Promise<PrivacyRequest[]> {
  try {
    return await ovhRequest<PrivacyRequest[]>(credentials, "GET", "/me/privacy/requests");
  } catch {
    console.warn("getAllPrivacyRequests: endpoint non disponible (404 attendu)");
    return [];
  }
}

export async function cancelErasureRequest(
  credentials: OvhCredentials,
  requestId: string
): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/privacy/requests/erasure/${requestId}/cancel`);
}

export async function sendErasureConfirmationEmail(
  credentials: OvhCredentials,
  requestId: string
): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/privacy/requests/erasure/${requestId}/confirmationEmail`);
}

export async function confirmErasure(
  credentials: OvhCredentials,
  requestId: string,
  code: string
): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/privacy/requests/erasure/${requestId}/confirm`, { code });
}

// ============ DEVELOPER MODE ============

export async function getDeveloperMode(credentials: OvhCredentials): Promise<DeveloperMode> {
  try {
    const me = await ovhRequest<{ developerMode: boolean }>(credentials, "GET", "/me");
    return { enabled: me.developerMode || false };
  } catch {
    return { enabled: false };
  }
}

export async function updateDeveloperMode(
  credentials: OvhCredentials,
  enabled: boolean
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", "/me", { developerMode: enabled });
}

// ============ BETA / PREFERENCES ============
// Note: L'endpoint /me/preferences/manager/* n'est pas expose publiquement.
// Le try/catch retourne false par defaut en cas de 404.

const BETA_PREFERENCE_KEY = "NAV_RESHUFFLE_BETA_ACCESS";

export async function getBetaPreference(credentials: OvhCredentials): Promise<boolean> {
  try {
    const pref = await ovhRequest<Preference>(
      credentials, 
      "GET", 
      `/me/preferences/manager/${BETA_PREFERENCE_KEY}`
    );
    return pref.value === "true";
  } catch {
    console.warn("getBetaPreference: endpoint non disponible (404 attendu)");
    return false;
  }
}

export async function setBetaPreference(
  credentials: OvhCredentials,
  enabled: boolean
): Promise<void> {
  const value = enabled.toString();
  
  try {
    await ovhRequest<void>(
      credentials, 
      "PUT", 
      `/me/preferences/manager/${BETA_PREFERENCE_KEY}`,
      { key: BETA_PREFERENCE_KEY, value }
    );
  } catch {
    try {
      await ovhRequest<void>(
        credentials, 
        "POST", 
        "/me/preferences/manager",
        { key: BETA_PREFERENCE_KEY, value }
      );
    } catch {
      console.warn("setBetaPreference: impossible de creer la preference (404 attendu)");
    }
  }
}
