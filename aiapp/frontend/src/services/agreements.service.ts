import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

// ============ TYPES ============

export interface Agreement {
  id: number;
  agreed: "todo" | "ok" | "ko";
  contractId: number;
  date: string;
}

export interface AgreementContract {
  active: boolean;
  date: string;
  name: string;
  pdf: string;
  text: string;
}

export interface AgreementDetails extends Agreement {
  contract?: AgreementContract;
}

// ============ API REQUEST HELPER ============

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

// ============ AGREEMENTS ============

export async function getAgreementIds(credentials: OvhCredentials): Promise<number[]> {
  const result = await ovhRequestOptional<number[]>(credentials, "GET", "/me/agreements");
  return result || [];
}

export async function getAgreement(credentials: OvhCredentials, id: number): Promise<Agreement | null> {
  return ovhRequestOptional<Agreement>(credentials, "GET", `/me/agreements/${id}`);
}

export async function getAgreementContract(credentials: OvhCredentials, id: number): Promise<AgreementContract | null> {
  return ovhRequestOptional<AgreementContract>(credentials, "GET", `/me/agreements/${id}/contract`);
}

export async function acceptAgreement(credentials: OvhCredentials, id: number): Promise<void> {
  await ovhRequest<void>(credentials, "POST", `/me/agreements/${id}/accept`);
}

export async function getAllAgreements(credentials: OvhCredentials): Promise<AgreementDetails[]> {
  const ids = await getAgreementIds(credentials);
  const agreements = await Promise.all(
    ids.map(async (id) => {
      const agreement = await getAgreement(credentials, id);
      if (!agreement) return null;
      const contract = await getAgreementContract(credentials, id);
      return { ...agreement, contract: contract || undefined };
    })
  );
  return agreements
    .filter((a): a is AgreementDetails => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPendingAgreements(credentials: OvhCredentials): Promise<AgreementDetails[]> {
  const all = await getAllAgreements(credentials);
  return all.filter(a => a.agreed === "todo");
}

export async function getAcceptedAgreements(credentials: OvhCredentials): Promise<AgreementDetails[]> {
  const all = await getAllAgreements(credentials);
  return all.filter(a => a.agreed === "ok");
}
