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

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Silent request - returns null on any error (for optional endpoints)
async function ovhRequestOptional<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
): Promise<T | null> {
  try {
    return await ovhRequest<T>(credentials, method, path);
  } catch {
    // Silently fail for optional endpoints
    return null;
  }
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
// Note: These endpoints may not be available for all accounts

export async function getPrivacyRequests(credentials: OvhCredentials): Promise<number[]> {
  const result = await ovhRequestOptional<number[]>(credentials, "GET", "/me/privacy/requests");
  return result || [];
}

export async function getPrivacyRequest(
  credentials: OvhCredentials,
  requestId: number
): Promise<PrivacyRequest | null> {
  return ovhRequestOptional<PrivacyRequest>(credentials, "GET", `/me/privacy/requests/${requestId}`);
}

export async function getPrivacyCapabilities(credentials: OvhCredentials): Promise<PrivacyCapabilities> {
  const result = await ovhRequestOptional<PrivacyCapabilities>(
    credentials, 
    "GET", 
    "/me/privacy/requests/capabilities"
  );
  // Default: allow erasure request if endpoint not available
  return result || { canRequestErasure: true };
}

export async function createErasureRequest(credentials: OvhCredentials): Promise<PrivacyRequest> {
  return ovhRequest<PrivacyRequest>(credentials, "POST", "/me/privacy/requests/erasure");
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

// ============ PRIVACY / GDPR (suite) ============

export async function getAllPrivacyRequests(credentials: OvhCredentials): Promise<PrivacyRequest[]> {
  const result = await ovhRequestOptional<PrivacyRequest[]>(credentials, "GET", "/me/privacy/requests");
  return result || [];
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

const BETA_PREFERENCE_KEY = "NAV_RESHUFFLE_BETA_ACCESS";

export async function getBetaPreference(credentials: OvhCredentials): Promise<boolean> {
  const pref = await ovhRequestOptional<Preference>(
    credentials, 
    "GET", 
    `/me/preferences/manager/${BETA_PREFERENCE_KEY}`
  );
  return pref?.value === "true";
}

export async function setBetaPreference(
  credentials: OvhCredentials,
  enabled: boolean
): Promise<void> {
  const value = enabled.toString();
  
  try {
    // Try to update existing preference
    await ovhRequest<void>(
      credentials, 
      "PUT", 
      `/me/preferences/manager/${BETA_PREFERENCE_KEY}`,
      { key: BETA_PREFERENCE_KEY, value }
    );
  } catch {
    // If not found, create it
    await ovhRequest<void>(
      credentials, 
      "POST", 
      "/me/preferences/manager",
      { key: BETA_PREFERENCE_KEY, value }
    );
  }
}
