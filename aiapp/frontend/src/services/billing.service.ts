// ============================================================
// BILLING SERVICE - OVHcloud API via proxy nginx
// Proxy: /api/ovh/* → https://eu.api.ovh.com/1.0/*
// Auth: Headers X-Ovh-App-Key, X-Ovh-App-Secret, X-Ovh-Consumer-Key
// ============================================================

const API_BASE = "/api/ovh";

// ============ TYPES ============

export interface OvhCredentials {
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

export interface Bill {
  billId: string;
  date: string;
  orderId: number;
  password: string;
  pdfUrl: string;
  priceWithTax: { currencyCode: string; text: string; value: number };
  priceWithoutTax: { currencyCode: string; text: string; value: number };
  tax: { currencyCode: string; text: string; value: number };
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
  icon?: { name: string; url: string };
}

export interface Deposit {
  depositId: string;
  date: string;
  amount: { currencyCode: string; text: string; value: number };
  orderId: number;
  paymentInfo?: { paymentType: string; description: string };
  url: string;
  pdfUrl: string;
}

export interface DebtAccount {
  active: boolean;
  dueAmount: { currencyCode: string; text: string; value: number };
  pendingAmount: { currencyCode: string; text: string; value: number };
  todoAmount: { currencyCode: string; text: string; value: number };
  unmaturedAmount: { currencyCode: string; text: string; value: number };
}

export interface Debt {
  debtId: number;
  amount: { currencyCode: string; text: string; value: number };
  date: string;
  dueAmount: { currencyCode: string; text: string; value: number };
  dueDate?: string;
  orderId: number;
  pendingAmount: { currencyCode: string; text: string; value: number };
  status: string;
  todoAmount: { currencyCode: string; text: string; value: number };
  unmaturedAmount: { currencyCode: string; text: string; value: number };
}

export interface OvhAccount {
  alertThreshold?: number;
  balance: { currencyCode: string; text: string; value: number };
  canBeCredited: boolean;
  isActive: boolean;
  lastUpdate: string;
  openDate: string;
}

export interface OvhAccountMovement {
  movementId: number;
  amount: { currencyCode: string; text: string; value: number };
  balance: { currencyCode: string; text: string; value: number };
  date: string;
  description: string;
  operation: string;
  order?: number;
  previousBalance: { currencyCode: string; text: string; value: number };
}

export interface Voucher {
  balance: { currencyCode: string; text: string; value: number };
  bill?: string;
  creationDate: string;
  expirationDate: string;
  lastUpdate: string;
  productId?: string;
  usedAmount: { currencyCode: string; text: string; value: number };
  validity: string;
  voucherAccount: string;
}

export interface FidelityAccount {
  balance: number;
  canBeCredited: boolean;
  lastUpdate: string;
  openDate: string;
}

export interface FidelityMovement {
  movementId: number;
  amount: number;
  balance: number;
  date: string;
  description: string;
  operation: string;
  order?: number;
  previousBalance: number;
}

export interface Credit {
  refundId: string;
  date: string;
  amount: { currencyCode: string; text: string; value: number };
  orderId?: number;
  originalBillId?: string;
  pdfUrl: string;
  url: string;
}

// ============ CREDENTIALS HELPER ============

const STORAGE_KEY = "ovh_credentials";

export function getStoredCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeCredentials(credentials: OvhCredentials): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function clearCredentials(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

// ============ API REQUEST HELPER ============

async function apiRequest<T>(credentials: OvhCredentials, method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Ovh-App-Key": credentials.appKey,
    "X-Ovh-App-Secret": credentials.appSecret,
  };

  if (credentials.consumerKey) {
    headers["X-Ovh-Consumer-Key"] = credentials.consumerKey;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur HTTP ${response.status}`);
  }

  return response.json();
}

// ============ FACTURES (/me/bill) ============

export async function getBillIds(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<string[]>(credentials, "GET", `/me/bill${query}`);
}

export async function getBill(credentials: OvhCredentials, billId: string): Promise<Bill> {
  return apiRequest<Bill>(credentials, "GET", `/me/bill/${encodeURIComponent(billId)}`);
}

export async function getBills(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Bill[]> {
  const billIds = await getBillIds(credentials, options);
  const idsToFetch = options?.limit ? billIds.slice(0, options.limit) : billIds;
  const bills: Bill[] = [];
  const batchSize = 10;
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => getBill(credentials, id).catch(() => null)));
    bills.push(...results.filter((b): b is Bill => b !== null));
  }
  return bills.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ AVOIRS / REFUNDS (/me/refund) ============

export async function getRefundIds(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<string[]>(credentials, "GET", `/me/refund${query}`);
}

export async function getRefund(credentials: OvhCredentials, refundId: string): Promise<Credit> {
  return apiRequest<Credit>(credentials, "GET", `/me/refund/${encodeURIComponent(refundId)}`);
}

export async function getCredits(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Credit[]> {
  const refundIds = await getRefundIds(credentials, options);
  const idsToFetch = options?.limit ? refundIds.slice(0, options.limit) : refundIds;
  const credits: Credit[] = [];
  const batchSize = 10;
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => getRefund(credentials, id).catch(() => null)));
    credits.push(...results.filter((c): c is Credit => c !== null));
  }
  return credits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ PAIEMENTS / DEPOTS (/me/deposit) ============

export async function getDepositIds(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<string[]>(credentials, "GET", `/me/deposit${query}`);
}

export async function getDeposit(credentials: OvhCredentials, depositId: string): Promise<Deposit> {
  return apiRequest<Deposit>(credentials, "GET", `/me/deposit/${encodeURIComponent(depositId)}`);
}

export async function getDeposits(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Deposit[]> {
  const depositIds = await getDepositIds(credentials, options);
  const idsToFetch = options?.limit ? depositIds.slice(0, options.limit) : depositIds;
  const deposits: Deposit[] = [];
  const batchSize = 10;
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => getDeposit(credentials, id).catch(() => null)));
    deposits.push(...results.filter((d): d is Deposit => d !== null));
  }
  return deposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ MOYENS DE PAIEMENT (/me/payment/method) ============

export async function getPaymentMethodIds(credentials: OvhCredentials): Promise<number[]> {
  return apiRequest<number[]>(credentials, "GET", "/me/payment/method");
}

export async function getPaymentMethod(credentials: OvhCredentials, paymentMethodId: number): Promise<PaymentMethod> {
  return apiRequest<PaymentMethod>(credentials, "GET", `/me/payment/method/${paymentMethodId}`);
}

export async function getPaymentMethods(credentials: OvhCredentials): Promise<PaymentMethod[]> {
  const ids = await getPaymentMethodIds(credentials);
  const methods = await Promise.all(ids.map((id) => getPaymentMethod(credentials, id).catch(() => null)));
  return methods.filter((m): m is PaymentMethod => m !== null);
}

// ============ ENCOURS / DETTE (/me/debtAccount) ============

export async function getDebtAccount(credentials: OvhCredentials): Promise<DebtAccount> {
  return apiRequest<DebtAccount>(credentials, "GET", "/me/debtAccount");
}

export async function getDebtIds(credentials: OvhCredentials): Promise<number[]> {
  return apiRequest<number[]>(credentials, "GET", "/me/debtAccount/debt");
}

export async function getDebt(credentials: OvhCredentials, debtId: number): Promise<Debt> {
  return apiRequest<Debt>(credentials, "GET", `/me/debtAccount/debt/${debtId}`);
}

export async function getDebts(credentials: OvhCredentials): Promise<Debt[]> {
  const ids = await getDebtIds(credentials);
  const debts = await Promise.all(ids.map((id) => getDebt(credentials, id).catch(() => null)));
  return debts.filter((d): d is Debt => d !== null);
}

// ============ COMPTE PREPAYE OVH (/me/ovhAccount) ============

export async function getOvhAccountIds(credentials: OvhCredentials): Promise<string[]> {
  return apiRequest<string[]>(credentials, "GET", "/me/ovhAccount");
}

export async function getOvhAccount(credentials: OvhCredentials, ovhAccountId: string): Promise<OvhAccount> {
  return apiRequest<OvhAccount>(credentials, "GET", `/me/ovhAccount/${encodeURIComponent(ovhAccountId)}`);
}

export async function getOvhAccountMovementIds(credentials: OvhCredentials, ovhAccountId: string, options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<number[]>(credentials, "GET", `/me/ovhAccount/${encodeURIComponent(ovhAccountId)}/movements${query}`);
}

export async function getOvhAccountMovement(credentials: OvhCredentials, ovhAccountId: string, movementId: number): Promise<OvhAccountMovement> {
  return apiRequest<OvhAccountMovement>(credentials, "GET", `/me/ovhAccount/${encodeURIComponent(ovhAccountId)}/movements/${movementId}`);
}

export async function getOvhAccountMovements(credentials: OvhCredentials, ovhAccountId: string, options?: { "date.from"?: string; "date.to"?: string }): Promise<OvhAccountMovement[]> {
  const movementIds = await getOvhAccountMovementIds(credentials, ovhAccountId, options);
  const movements = await Promise.all(
    movementIds.map((id) => getOvhAccountMovement(credentials, ovhAccountId, id).catch(() => null))
  );
  return movements.filter((m): m is OvhAccountMovement => m !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ BONS D'ACHAT / VOUCHERS (/me/voucherAccount) ============

export async function getVoucherAccountIds(credentials: OvhCredentials): Promise<string[]> {
  return apiRequest<string[]>(credentials, "GET", "/me/voucherAccount");
}

export async function getVoucherAccount(credentials: OvhCredentials, voucherId: string): Promise<Voucher> {
  return apiRequest<Voucher>(credentials, "GET", `/me/voucherAccount/${encodeURIComponent(voucherId)}`);
}

export async function getVouchers(credentials: OvhCredentials): Promise<Voucher[]> {
  const ids = await getVoucherAccountIds(credentials);
  const vouchers = await Promise.all(ids.map((id) => getVoucherAccount(credentials, id).catch(() => null)));
  return vouchers.filter((v): v is Voucher => v !== null);
}

// ============ FIDELITE (/me/fidelityAccount) ============

export async function getFidelityAccount(credentials: OvhCredentials): Promise<FidelityAccount> {
  return apiRequest<FidelityAccount>(credentials, "GET", "/me/fidelityAccount");
}

export async function getFidelityMovementIds(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<number[]>(credentials, "GET", `/me/fidelityAccount/movements${query}`);
}

export async function getFidelityMovement(credentials: OvhCredentials, movementId: number): Promise<FidelityMovement> {
  return apiRequest<FidelityMovement>(credentials, "GET", `/me/fidelityAccount/movements/${movementId}`);
}

export async function getFidelityMovements(credentials: OvhCredentials, options?: { "date.from"?: string; "date.to"?: string }): Promise<FidelityMovement[]> {
  const ids = await getFidelityMovementIds(credentials, options);
  const movements = await Promise.all(ids.map((id) => getFidelityMovement(credentials, id).catch(() => null)));
  return movements.filter((m): m is FidelityMovement => m !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
