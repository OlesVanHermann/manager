// ============================================================
// METHODS TAB SERVICE - Service ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { ovhGet, ovhPost, ovhDelete } from "../../../../../services/api";

// ============ TYPES ============

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

// ============ HELPERS ============

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export function getPaymentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CREDIT_CARD: "Carte bancaire",
    SEPA_DIRECT_DEBIT: "Prélèvement SEPA",
    PAYPAL: "PayPal",
    BANK_ACCOUNT: "Compte bancaire",
  };
  return labels[type] || type;
}

// ============ PAYMENT METHODS API ============

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

export async function deletePaymentMethod(paymentMethodId: number): Promise<void> {
  return ovhDelete<void>(`/me/payment/method/${paymentMethodId}`);
}

export async function setDefaultPaymentMethod(paymentMethodId: number): Promise<PaymentMethod> {
  return ovhPost<PaymentMethod>(`/me/payment/method/${paymentMethodId}/setAsDefault`, {});
}

export async function createPaymentMethod(params: {
  paymentType: string;
  description?: string;
  default?: boolean;
  callbackUrl?: string;
}): Promise<{ paymentMethodId: number; validationUrl?: string }> {
  return ovhPost<{ paymentMethodId: number; validationUrl?: string }>("/me/payment/method", params);
}

export async function getAvailablePaymentTypes(): Promise<string[]> {
  try {
    return await ovhGet<string[]>("/me/payment/availableMethods");
  } catch {
    return ["CREDIT_CARD", "SEPA_DIRECT_DEBIT", "PAYPAL", "BANK_ACCOUNT"];
  }
}
