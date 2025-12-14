// ============================================================
// BILLING SERVICE - Facturation OVHcloud
// Utilise le helper centralisé api.ts
// ============================================================

import { ovhGet, ovhPost, ovhPut } from "./api";

// ============ TYPES ============

export interface PurchaseOrder {
  id: number;
  reference: string;
  creationDate: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  status: string; // CREATED, etc.
  type: string; // REFERENCE_ORDER, PURCHASE_ORDER
}

export interface PurchaseOrderCreate {
  reference: string;
  startDate: string;
  endDate?: string;
  type?: string;
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
  paymentInfo?: { paymentType: string; publicLabel?: string; description?: string | null };
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

// ============ FACTURES (/me/bill) ============

export async function getBillIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/bill${query}`);
}

export async function getBill(billId: string): Promise<Bill> {
  return ovhGet<Bill>(`/me/bill/${encodeURIComponent(billId)}`);
}

export async function getBills(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Bill[]> {
  const billIds = await getBillIds(options);
  const idsToFetch = options?.limit ? billIds.slice(0, options.limit) : billIds;
  const bills: Bill[] = [];
  const batchSize = 10;
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => getBill(id).catch(() => null)));
    bills.push(...results.filter((b): b is Bill => b !== null));
  }
  return bills.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ AVOIRS / REFUNDS (/me/refund) ============

export async function getRefundIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/refund${query}`);
}

export async function getRefund(refundId: string): Promise<Credit> {
  return ovhGet<Credit>(`/me/refund/${encodeURIComponent(refundId)}`);
}

export async function getCredits(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Credit[]> {
  const refundIds = await getRefundIds(options);
  const idsToFetch = options?.limit ? refundIds.slice(0, options.limit) : refundIds;
  const credits: Credit[] = [];
  const batchSize = 10;
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => getRefund(id).catch(() => null)));
    credits.push(...results.filter((c): c is Credit => c !== null));
  }
  return credits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ PAIEMENTS / DEPOTS (/me/deposit) ============

export async function getDepositIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/deposit${query}`);
}

export async function getDeposit(depositId: string): Promise<Deposit> {
  return ovhGet<Deposit>(`/me/deposit/${encodeURIComponent(depositId)}`);
}

export async function getDeposits(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Deposit[]> {
  const depositIds = await getDepositIds(options);
  const idsToFetch = options?.limit ? depositIds.slice(0, options.limit) : depositIds;
  const deposits: Deposit[] = [];
  const batchSize = 10;
  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((id) => getDeposit(id).catch(() => null)));
    deposits.push(...results.filter((d): d is Deposit => d !== null));
  }
  return deposits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ MOYENS DE PAIEMENT (/me/payment/method) ============

export async function getPaymentMethodIds(): Promise<number[]> {
  return ovhGet<number[]>("/me/payment/method");
}

export async function getPaymentMethod(paymentMethodId: number): Promise<PaymentMethod> {
  return ovhGet<PaymentMethod>(`/me/payment/method/${paymentMethodId}`);
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const ids = await getPaymentMethodIds();
  const methods = await Promise.all(ids.map((id) => getPaymentMethod(id).catch(() => null)));
  return methods.filter((m): m is PaymentMethod => m !== null);
}

// ============ ENCOURS / DETTE (/me/debtAccount) ============

export async function getDebtAccount(): Promise<DebtAccount> {
  return ovhGet<DebtAccount>("/me/debtAccount");
}

export async function getDebtIds(): Promise<number[]> {
  return ovhGet<number[]>("/me/debtAccount/debt");
}

export async function getDebt(debtId: number): Promise<Debt> {
  return ovhGet<Debt>(`/me/debtAccount/debt/${debtId}`);
}

export async function getDebts(): Promise<Debt[]> {
  const ids = await getDebtIds();
  const debts = await Promise.all(ids.map((id) => getDebt(id).catch(() => null)));
  return debts.filter((d): d is Debt => d !== null);
}

// ============ COMPTE PREPAYE OVH (/me/ovhAccount) ============

export async function getOvhAccountIds(): Promise<string[]> {
  return ovhGet<string[]>("/me/ovhAccount");
}

export async function getOvhAccount(ovhAccountId: string): Promise<OvhAccount> {
  return ovhGet<OvhAccount>(`/me/ovhAccount/${encodeURIComponent(ovhAccountId)}`);
}

export async function getOvhAccountMovementIds(ovhAccountId: string, options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<number[]>(`/me/ovhAccount/${encodeURIComponent(ovhAccountId)}/movements${query}`);
}

export async function getOvhAccountMovement(ovhAccountId: string, movementId: number): Promise<OvhAccountMovement> {
  return ovhGet<OvhAccountMovement>(`/me/ovhAccount/${encodeURIComponent(ovhAccountId)}/movements/${movementId}`);
}

export async function getOvhAccountMovements(ovhAccountId: string, options?: { "date.from"?: string; "date.to"?: string }): Promise<OvhAccountMovement[]> {
  const movementIds = await getOvhAccountMovementIds(ovhAccountId, options);
  const movements = await Promise.all(
    movementIds.map((id) => getOvhAccountMovement(ovhAccountId, id).catch(() => null))
  );
  return movements.filter((m): m is OvhAccountMovement => m !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============ BONS D'ACHAT / VOUCHERS (/me/voucherAccount) ============

export async function getVoucherAccountIds(): Promise<string[]> {
  return ovhGet<string[]>("/me/voucherAccount");
}

export async function getVoucherAccount(voucherId: string): Promise<Voucher> {
  return ovhGet<Voucher>(`/me/voucherAccount/${encodeURIComponent(voucherId)}`);
}

export async function getVouchers(): Promise<Voucher[]> {
  const ids = await getVoucherAccountIds();
  const vouchers = await Promise.all(ids.map((id) => getVoucherAccount(id).catch(() => null)));
  return vouchers.filter((v): v is Voucher => v !== null);
}

// ============ FIDELITE (/me/fidelityAccount) ============

export async function getFidelityAccount(): Promise<FidelityAccount> {
  return ovhGet<FidelityAccount>("/me/fidelityAccount");
}

export async function getFidelityMovementIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<number[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<number[]>(`/me/fidelityAccount/movements${query}`);
}

export async function getFidelityMovement(movementId: number): Promise<FidelityMovement> {
  return ovhGet<FidelityMovement>(`/me/fidelityAccount/movements/${movementId}`);
}

export async function getFidelityMovements(options?: { "date.from"?: string; "date.to"?: string }): Promise<FidelityMovement[]> {
  const ids = await getFidelityMovementIds(options);
  const movements = await Promise.all(ids.map((id) => getFidelityMovement(id).catch(() => null)));
  return movements.filter((m): m is FidelityMovement => m !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


// ============ ALIAS MANQUANTS ============

export async function getRefunds(options?: { "date.from"?: string; "date.to"?: string }): Promise<Credit[]> {
  const refundIds = await getRefundIds(options);
  const batches = [];
  for (let i = 0; i < refundIds.length; i += 10) {
    batches.push(refundIds.slice(i, i + 10));
  }
  const allRefunds: Credit[] = [];
  for (const batch of batches) {
    const results = await Promise.all(batch.map((id) => getRefund(id).catch(() => null)));
    allRefunds.push(...results.filter((r): r is Credit => r !== null));
  }
  return allRefunds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getVoucherAccounts(): Promise<Voucher[]> {
  return getVouchers();
}

// ============ REFERENCES INTERNES / PURCHASE ORDERS (/me/billing/purchaseOrder) ============

export async function getPurchaseOrderIds(): Promise<number[]> {
  return ovhGet<number[]>("/me/billing/purchaseOrder");
}

export async function getPurchaseOrder(id: number): Promise<PurchaseOrder> {
  return ovhGet<PurchaseOrder>(`/me/billing/purchaseOrder/${id}`);
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const ids = await getPurchaseOrderIds();
  const orders = await Promise.all(ids.map((id) => getPurchaseOrder(id).catch(() => null)));
  return orders
    .filter((o): o is PurchaseOrder => o !== null)
    .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
}

export async function createPurchaseOrder(data: PurchaseOrderCreate): Promise<PurchaseOrder> {
  return ovhPost<PurchaseOrder>("/me/billing/purchaseOrder", data);
}

export async function updatePurchaseOrder(id: number, data: Partial<PurchaseOrderCreate> & { active?: boolean }): Promise<PurchaseOrder> {
  return ovhPut<PurchaseOrder>(`/me/billing/purchaseOrder/${id}`, data);
}
