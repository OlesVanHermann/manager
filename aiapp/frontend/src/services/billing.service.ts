import type { OvhCredentials } from "../types/auth.types";

const API_BASE = "/api/ovh";

export interface Bill {
  billId: string;
  date: string;
  orderId: number;
  password: string;
  pdfUrl: string;
  priceWithTax: {
    currencyCode: string;
    text: string;
    value: number;
  };
  priceWithoutTax: {
    currencyCode: string;
    text: string;
    value: number;
  };
  tax: {
    currencyCode: string;
    text: string;
    value: number;
  };
  url: string;
}

export interface PaymentMethod {
  paymentMethodId: number;
  paymentType: string;
  paymentSubType?: string;
  description: string;
  status: string;
  default: boolean;
  creationDate: string;
  lastUpdate?: string;
  expirationDate?: string;
  label?: string;
  icon?: {
    name: string;
    url: string;
  };
}

export interface Deposit {
  depositId: string;
  date: string;
  amount: {
    currencyCode: string;
    text: string;
    value: number;
  };
  orderId: number;
  paymentInfo?: {
    paymentType: string;
    description: string;
  };
  url: string;
  pdfUrl: string;
}

export interface DebtAccount {
  active: boolean;
  dueAmount: {
    currencyCode: string;
    text: string;
    value: number;
  };
  pendingAmount: {
    currencyCode: string;
    text: string;
    value: number;
  };
  todoAmount: {
    currencyCode: string;
    text: string;
    value: number;
  };
  unmaturedAmount: {
    currencyCode: string;
    text: string;
    value: number;
  };
}

async function ovhRequest<T>(
  credentials: OvhCredentials,
  method: string,
  path: string
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
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ FACTURES ============

export async function getBillIds(
  credentials: OvhCredentials,
  options?: { 
    "date.from"?: string; 
    "date.to"?: string;
  }
): Promise<string[]> {
  let path = "/me/bill";
  const params = new URLSearchParams();
  
  if (options?.["date.from"]) {
    params.append("date.from", options["date.from"]);
  }
  if (options?.["date.to"]) {
    params.append("date.to", options["date.to"]);
  }
  
  if (params.toString()) {
    path += `?${params.toString()}`;
  }
  
  return ovhRequest<string[]>(credentials, "GET", path);
}

export async function getBill(
  credentials: OvhCredentials,
  billId: string
): Promise<Bill> {
  return ovhRequest<Bill>(credentials, "GET", `/me/bill/${billId}`);
}

export async function getBills(
  credentials: OvhCredentials,
  options?: { 
    "date.from"?: string; 
    "date.to"?: string;
    limit?: number;
  }
): Promise<Bill[]> {
  const billIds = await getBillIds(credentials, options);
  const idsToFetch = options?.limit ? billIds.slice(0, options.limit) : billIds;
  
  const bills: Bill[] = [];
  const batchSize = 10;
  
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(id => getBill(credentials, id).catch(() => null))
    );
    bills.push(...batchResults.filter((b): b is Bill => b !== null));
  }
  
  return bills.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ PAIEMENTS / DEPOTS ============

export async function getDepositIds(
  credentials: OvhCredentials,
  options?: { 
    "date.from"?: string; 
    "date.to"?: string;
  }
): Promise<string[]> {
  let path = "/me/deposit";
  const params = new URLSearchParams();
  
  if (options?.["date.from"]) {
    params.append("date.from", options["date.from"]);
  }
  if (options?.["date.to"]) {
    params.append("date.to", options["date.to"]);
  }
  
  if (params.toString()) {
    path += `?${params.toString()}`;
  }
  
  return ovhRequest<string[]>(credentials, "GET", path);
}

export async function getDeposit(
  credentials: OvhCredentials,
  depositId: string
): Promise<Deposit> {
  return ovhRequest<Deposit>(credentials, "GET", `/me/deposit/${depositId}`);
}

export async function getDeposits(
  credentials: OvhCredentials,
  options?: { 
    "date.from"?: string; 
    "date.to"?: string;
    limit?: number;
  }
): Promise<Deposit[]> {
  const depositIds = await getDepositIds(credentials, options);
  const idsToFetch = options?.limit ? depositIds.slice(0, options.limit) : depositIds;
  
  const deposits: Deposit[] = [];
  const batchSize = 10;
  
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(id => getDeposit(credentials, id).catch(() => null))
    );
    deposits.push(...batchResults.filter((d): d is Deposit => d !== null));
  }
  
  return deposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ MOYENS DE PAIEMENT ============

export async function getPaymentMethodIds(
  credentials: OvhCredentials
): Promise<number[]> {
  return ovhRequest<number[]>(credentials, "GET", "/me/payment/method");
}

export async function getPaymentMethod(
  credentials: OvhCredentials,
  paymentMethodId: number
): Promise<PaymentMethod> {
  return ovhRequest<PaymentMethod>(credentials, "GET", `/me/payment/method/${paymentMethodId}`);
}

export async function getPaymentMethods(
  credentials: OvhCredentials
): Promise<PaymentMethod[]> {
  const ids = await getPaymentMethodIds(credentials);
  
  const methods = await Promise.all(
    ids.map(id => getPaymentMethod(credentials, id).catch(() => null))
  );
  
  return methods.filter((m): m is PaymentMethod => m !== null);
}

// ============ ENCOURS / DETTE ============

export async function getDebtAccount(
  credentials: OvhCredentials
): Promise<DebtAccount> {
  return ovhRequest<DebtAccount>(credentials, "GET", "/me/debtAccount");
}
