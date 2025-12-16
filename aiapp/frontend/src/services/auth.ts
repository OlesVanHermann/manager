import type { OvhCredentials, OvhUser, CredentialResponse } from "../types/auth.types";

const API_BASE = "/api/ovh";

async function ovhFetch<T>(
  path: string,
  credentials: OvhCredentials,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function requestCredential(
  appKey: string,
  appSecret: string,
  redirectUrl: string
): Promise<CredentialResponse> {
  const credentials: OvhCredentials = { appKey, appSecret };

  return ovhFetch<CredentialResponse>("/auth/credential", credentials, {
    method: "POST",
    body: JSON.stringify({
      accessRules: [
        { method: "GET", path: "/*" },
        { method: "POST", path: "/*" },
        { method: "PUT", path: "/*" },
        { method: "DELETE", path: "/*" },
      ],
      redirection: redirectUrl,
    }),
  });
}

export async function getMe(credentials: OvhCredentials): Promise<OvhUser> {
  return ovhFetch<OvhUser>("/me", credentials);
}

export async function logout(credentials: OvhCredentials): Promise<void> {
  await ovhFetch("/auth/logout", credentials, { method: "POST" });
}

export async function checkSession(credentials: OvhCredentials): Promise<boolean> {
  try {
    await getMe(credentials);
    return true;
  } catch {
    return false;
  }
}
