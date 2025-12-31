// ============================================================
// LINES TYPES - Types spécifiques aux lignes VoIP
// ============================================================

export type LineTabId =
  | 'dashboard'
  | 'general'
  | 'phone'
  | 'options'
  | 'consumption'
  | 'calls'
  | 'click2call'
  | 'forward'
  | 'voicemail';

export interface LineServiceInfos {
  domain: string;
  serviceId: number;
  creation: string;
  expiration: string;
  contactAdmin: string;
  contactTech: string;
  contactBilling: string;
  status: 'ok' | 'expired' | 'inCreation';
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    period?: string;
  };
  engagedUpTo?: string;
}

export interface LineOptions {
  // Appels
  callWaiting: boolean;
  displayNumber: boolean;
  doNotDisturb: boolean;
  forwardUnconditional: boolean;
  forwardBusy: boolean;
  forwardNoReply: boolean;
  forwardBackup: boolean;
  // Messagerie
  voicemail: boolean;
  voicemailPassword?: string;
  voicemailActive: boolean;
  // Restrictions
  lockOutCall: boolean;
  lockOutCallPassword?: string;
  intercom: boolean;
}

export interface LineStatistics {
  incomingCalls: number;
  outgoingCalls: number;
  missedCalls: number;
  totalDuration: number;
  averageDuration: number;
}

export interface LineCall {
  id: string;
  callingNumber: string;
  calledNumber: string;
  type: 'incoming' | 'outgoing';
  date: string;
  duration: number;
  price: number;
  destination?: string;
}

export interface LineConsumption {
  date: string;
  type: 'call' | 'sms' | 'fax';
  destination: string;
  duration: number;
  price: number;
}

export interface Click2CallUser {
  id: number;
  login: string;
  creationDate: string;
  status: 'active' | 'inactive';
}

export interface PhoneConfiguration {
  macAddress: string;
  protocol: 'mgcp' | 'sip';
  ipAddress?: string;
  lastRegistration?: string;
  firmwareVersion?: string;
}
