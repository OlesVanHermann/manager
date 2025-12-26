// ============================================================
// BILLING TYPES - Types partagés (SEUL fichier partagé autorisé)
// Types AUTONOMES - Pas d'import externe
// ============================================================

// ============ CREDENTIALS (internalisé) ============

export interface OvhCredentials {
  nichandle: string;
  password: string;
  appKey?: string;
  appSecret?: string;
  consumerKey?: string;
}

// ============ TAB PROPS ============

/** Props communes pour tous les tabs billing */
export interface TabProps {
  credentials: OvhCredentials;
}

// ============ COMMON TYPES ============

export interface BillingService {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  status: "active" | "expired" | "suspended";
  renewalType: "automaticV2016" | "automaticV2014" | "manual";
  expirationDate?: string;
  creationDate?: string;
}

export interface Invoice {
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

export interface Order {
  orderId: number;
  date: string;
  expirationDate?: string;
  password?: string;
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
  retractionDate?: string;
  tax: {
    currencyCode: string;
    text: string;
    value: number;
  };
  url: string;
}

export interface PaymentMethod {
  paymentMethodId: number;
  paymentType: "CREDIT_CARD" | "BANK_ACCOUNT" | "PAYPAL" | "DEFERRED_PAYMENT";
  default: boolean;
  description: string;
  status: "VALID" | "EXPIRED" | "BLOCKED" | "PENDING_VALIDATION";
  label?: string;
  icon?: string;
  expirationDate?: string;
  creationDate: string;
  lastUpdate?: string;
}

export interface FidelityAccount {
  balance: number;
  canBeCredited: boolean;
  lastUpdate: string;
  openDate: string;
}

export interface FidelityMovement {
  amount: number;
  balance: number;
  date: string;
  description: string;
  movementId: number;
  operation: "credit" | "debit";
  order?: number;
  previousBalance: number;
}

export interface PrepaidAccount {
  balance: {
    currencyCode: string;
    text: string;
    value: number;
  };
  lastUpdate: string;
  openDate: string;
}

export interface Voucher {
  balance: {
    currencyCode: string;
    text: string;
    value: number;
  };
  bill?: string;
  creationDate: string;
  expirationDate: string;
  lastUpdate: string;
  movement?: string;
  paymentMeanId: number;
  productId?: string;
  validity?: "Valid" | "Cancelled" | "Expired";
  voucher: string;
}

export interface Refund {
  refundId: string;
  date: string;
  orderId?: number;
  originalBillId?: string;
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

export interface Payment {
  paymentId: string;
  date: string;
  paymentInfo?: {
    paymentType?: string;
    description?: string;
  };
  priceWithTax?: {
    currencyCode: string;
    text: string;
    value: number;
  };
  status?: string;
}

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
