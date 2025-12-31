// ============================================================
// FAX TYPES - Types locaux
// ============================================================

export interface FreefaxAccount {
  number: string;
  fromName: string;
  fromEmail: string;
  redirectionEmail: string[];
  faxQuality: 'best' | 'high' | 'normal';
  faxMaxCall: number;
  faxTagLine: string;
}

export interface FreefaxServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}
