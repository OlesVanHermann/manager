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

export interface UserProfile {
  firstname: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  language?: string;
  legalform?: string;
  companyNationalIdentificationNumber?: string;
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

async function ovhRequestOptional<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T | null> {
  try {
    return await ovhRequest<T>(credentials, method, path);
  } catch {
    return null;
  }
}

// ============ PROFILE ============

export async function getProfile(credentials: OvhCredentials): Promise<UserProfile> {
  return ovhRequest<UserProfile>(credentials, "GET", "/me");
}

export async function updateProfile(
  credentials: OvhCredentials,
  data: Partial<UserProfile>
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", "/me", data);
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

export async function getPrivacyRequestIds(credentials: OvhCredentials): Promise<number[]> {
  const result = await ovhRequestOptional<number[]>(credentials, "GET", "/me/privacy/requests");
  return result || [];
}

export async function getPrivacyRequest(
  credentials: OvhCredentials,
  requestId: number
): Promise<PrivacyRequest | null> {
  return ovhRequestOptional<PrivacyRequest>(credentials, "GET", `/me/privacy/requests/${requestId}`);
}

export async function getAllPrivacyRequests(credentials: OvhCredentials): Promise<PrivacyRequest[]> {
  const ids = await getPrivacyRequestIds(credentials);
  if (ids.length === 0) return [];
  
  const results = await Promise.all(
    ids.map(id => getPrivacyRequest(credentials, id))
  );
  return results.filter((r): r is PrivacyRequest => r !== null);
}

export async function getPrivacyCapabilities(credentials: OvhCredentials): Promise<PrivacyCapabilities> {
  const result = await ovhRequestOptional<PrivacyCapabilities>(
    credentials, 
    "GET", 
    "/me/privacy/requests/capabilities"
  );
  return result || { canRequestErasure: true };
}

export async function createErasureRequest(credentials: OvhCredentials): Promise<PrivacyRequest> {
  return ovhRequest<PrivacyRequest>(credentials, "POST", "/me/privacy/requests/erasure");
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

// ============ CONSENTS ============

export async function getConsents(credentials: OvhCredentials): Promise<string[]> {
  const result = await ovhRequestOptional<string[]>(credentials, "GET", "/me/consent");
  return result || [];
}

export async function getConsent(credentials: OvhCredentials, name: string): Promise<Consent | null> {
  return ovhRequestOptional<Consent>(credentials, "GET", `/me/consent/${name}`);
}

export async function updateConsent(
  credentials: OvhCredentials,
  name: string,
  value: boolean
): Promise<void> {
  await ovhRequest<void>(credentials, "PUT", `/me/consent/${name}/decision`, { value });
}

// ============ BETA / PREFERENCES ============

const BETA_PREFERENCE_KEY = "ACCOUNT_BETA_FEATURES";
const DEV_MODE_STORAGE_KEY = "ovh_developer_mode";

export async function getBetaPreference(credentials: OvhCredentials): Promise<boolean> {
  try {
    // Si la préférence existe, beta est activée
    await ovhRequest<Preference>(
      credentials, 
      "GET", 
      `/me/preferences/manager/${BETA_PREFERENCE_KEY}`
    );
    return true;
  } catch {
    // Si 404 ou erreur, beta est désactivée
    return false;
  }
}

export async function setBetaPreference(
  credentials: OvhCredentials,
  enabled: boolean
): Promise<void> {
  if (enabled) {
    // Créer la préférence pour activer beta
    await ovhRequest<void>(
      credentials,
      "POST",
      "/me/preferences/manager",
      { key: BETA_PREFERENCE_KEY, value: "true" }
    );
  } else {
    // Supprimer la préférence pour désactiver beta
    await ovhRequest<void>(
      credentials,
      "DELETE",
      `/me/preferences/manager/${BETA_PREFERENCE_KEY}`
    );
  }
}

// ============ DEVELOPER MODE ============

export async function getDeveloperMode(credentials: OvhCredentials): Promise<DeveloperMode> {
  try {
    const me = await ovhRequest<{ developerMode?: boolean }>(credentials, "GET", "/me");
    if (typeof me.developerMode === "boolean") {
      return { enabled: me.developerMode };
    }
  } catch {
    // Ignore API errors
  }
  return { enabled: localStorage.getItem(DEV_MODE_STORAGE_KEY) === "true" };
}

export async function updateDeveloperMode(
  credentials: OvhCredentials,
  enabled: boolean
): Promise<void> {
  try {
    await ovhRequest<void>(credentials, "PUT", "/me", { developerMode: enabled });
  } catch {
    // Fallback localStorage si API échoue
    localStorage.setItem(DEV_MODE_STORAGE_KEY, enabled.toString());
    throw new Error("Sauvegardé localement uniquement");
  }
}
