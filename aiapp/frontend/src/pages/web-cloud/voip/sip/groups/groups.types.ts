// ============================================================
// GROUPS TYPES - Types pour la gestion des groupes VoIP
// ============================================================

export interface GroupServiceInfos {
  domain: string;
  status: 'ok' | 'expired' | 'inCreation' | 'pendingValidation';
  creation: string;
  expiration: string;
  engagedUpTo: string | null;
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: string | null;
  };
}

export interface GroupOrder {
  orderId: number;
  date: string;
  status: 'delivered' | 'delivering' | 'cancelled' | 'checking' | 'unknown';
  items: Array<{
    description: string;
    quantity: number;
  }>;
}

export interface GroupPortability {
  id: number;
  status: 'todo' | 'doing' | 'done' | 'error' | 'cancelled';
  creationDate: string;
  desiredExecutionDate: string;
  numbersList: string[];
  operator: string;
}

export interface GroupBillingItem {
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'refunded';
  downloadUrl?: string;
}

export interface GroupRepayment {
  id: number;
  date: string;
  amount: number;
  currency: string;
  status: 'pending' | 'done' | 'refused';
  consumptionId: number;
}

export interface GroupEventToken {
  token: string;
  type: 'acd' | 'all' | 'voicemail';
  creationDate: string;
  expirationDate: string;
  callbackUrl: string;
}

export interface GroupSecuritySettings {
  incomingCallsFiltering: 'all' | 'none' | 'blacklist' | 'whitelist';
  outgoingCallsFiltering: 'all' | 'none' | 'blacklist' | 'whitelist';
  simultaneousCalls: number;
  callRecording: boolean;
  anonymousCallRejection: boolean;
}

export type GroupTabId =
  | 'dashboard'
  | 'general'
  | 'services'
  | 'orders'
  | 'portability'
  | 'billing'
  | 'repayments'
  | 'security';
