// ============================================================
// VOIP TYPES - Types partagés (SEUL partage autorisé)
// ============================================================

export interface TelephonyBillingAccount {
  billingAccount: string;
  description: string;
  status: 'enabled' | 'expired';
  trusted: boolean;
  version: number;
  securityDeposit: number;
  currentOutplan: number;
  allowedOutplan: number;
}

export interface TelephonyLine {
  serviceName: string;
  serviceType: 'line' | 'trunk';
  description: string;
  simultaneousLines: number;
  offers: string[];
  getPublicOffer: { name: string; description: string };
}

export interface TelephonyNumber {
  serviceName: string;
  serviceType: 'alias' | 'ddi';
  description: string;
  featureType: 'conference' | 'contactCenterSolution' | 'ddi' | 'easyHunting' | 'easyPabx' | 'empty' | 'fax' | 'miniPabx' | 'redirect' | 'svi' | 'voicemail';
  country: string;
}

export interface TelephonyVoicemail {
  serviceName: string;
  offers: string[];
  description: string;
}

export interface TelephonyServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}
