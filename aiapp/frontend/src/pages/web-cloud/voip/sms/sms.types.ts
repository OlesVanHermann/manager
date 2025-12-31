// ============================================================
// SMS TYPES - Types partagés (SEUL partage autorisé)
// ============================================================

export interface SmsAccount {
  name: string;
  description: string;
  creditsLeft: number;
  status: 'disable' | 'enable';
  smsResponse: {
    cgiUrl: string | null;
    responseType: string;
    text: string | null;
    trackingDefaultSmsSender: string | null;
  };
  creditThresholdForAutomaticRecredit: number;
  automaticRecreditAmount: { quantity: number; amount: number } | null;
  callBack: string | null;
  templates: { customizedEmailMode: boolean; customizedSmsMode: boolean };
}

export interface SmsServiceInfos {
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: string;
  renew: { automatic: boolean; deleteAtExpiration: boolean; period: number | null };
}

export interface SmsSender {
  sender: string;
  status: 'disable' | 'enable' | 'waitingValidation';
  type: 'alpha' | 'numeric' | 'shortcode' | 'virtual';
  comment: string | null;
  validationMedia: string | null;
}

export interface SmsOutgoing {
  id: number;
  creationDatetime: string;
  credits: number;
  deliveryReceipt: number;
  differedDelivery: number;
  message: string;
  numberOfSms: number;
  ptt: number;
  receiver: string;
  sender: string;
  tag: string | null;
  tariffCode: string;
}

export interface SmsIncoming {
  id: number;
  creationDatetime: string;
  credits: number;
  message: string;
  sender: string;
  tag: string | null;
}
