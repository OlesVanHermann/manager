// ============================================================
// VOIP TYPES - Types partagés pour le module VoIP complet
// ============================================================

// ---------- BILLING ACCOUNT (Groupe) ----------

export interface TelephonyBillingAccount {
  billingAccount: string;
  description: string;
  status: 'enabled' | 'disabled' | 'expired';
  trusted: boolean;
  version: number;
  securityDeposit: number;
  currentOutplan: number;
  allowedOutplan: number;
  creditThreshold: number;
}

export interface TelephonyBillingAccountServiceInfos {
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

export interface TelephonyGroupSummary {
  billingAccount: string;
  description: string;
  status: 'enabled' | 'disabled' | 'expired';
  linesCount: number;
  numbersCount: number;
  faxCount: number;
  creditThreshold: number;
}

// ---------- LINE ----------

export interface TelephonyLine {
  serviceName: string;
  description: string;
  simultaneousLines: number;
  serviceType: 'line' | 'trunk';
  featureType: 'sip' | 'mgcp' | 'trunk';
  offers: string[];
  getPublicOffer: {
    name: string;
    description: string;
    price?: { value: number; currencyCode: string };
  };
  infrastructure: string;
}

export interface TelephonyLineServiceInfos {
  domain: string;
  status: 'ok' | 'expired' | 'inCreation';
  creation: string;
  expiration: string;
}

export interface TelephonyPhone {
  macAddress: string;
  brand: string;
  model: string;
  protocol: 'sip' | 'mgcp';
  ip: string;
  userPassword: string;
  description: string;
  phonebookId: number | null;
  maxLine: number;
}

export interface TelephonyLineOptions {
  forwardUnconditional: boolean;
  forwardUnconditionalNumber: string;
  forwardNoReply: boolean;
  forwardNoReplyDelay: number;
  forwardNoReplyNumber: string;
  forwardBusy: boolean;
  forwardBusyNumber: string;
  forwardBackup: boolean;
  forwardBackupNumber: string;
  displayNumber: string;
  identificationRestriction: boolean;
  callWaiting: boolean;
  intercom: 'no' | 'prefixed' | 'yes';
  doNotDisturb: boolean;
}

// ---------- NUMBER (Alias) ----------

export interface TelephonyNumber {
  serviceName: string;
  description: string;
  serviceType: 'alias' | 'ddi';
  featureType: 'redirect' | 'ddi' | 'conference' | 'fax' | 'voicefax' | 'easyHunting' | 'miniPabx' | 'voicemail' | 'empty' | 'svi' | 'contactCenterSolution' | 'easyPabx';
  country: string;
  partOfPool: number | null;
}

export interface TelephonyEasyHunting {
  serviceName: string;
  featureType: 'easyHunting';
  strategy: 'sequentiallyByAgentOrder' | 'ringAll' | 'random' | 'cumulationByAgentOrder' | 'longestHangUpAgent' | 'longestIdleAgent';
  maxWaitTime: number;
  queueSize: number;
  toneOnHold: boolean;
  showCallerNumber: 'caller' | 'alias' | 'both';
  pattern: 'all' | 'external' | 'internal';
  voicemail: string | null;
}

export interface TelephonyHuntingAgent {
  agentId: number;
  number: string;
  description: string;
  status: 'available' | 'onACall' | 'loggedOut';
  position: number;
  timeout: number;
  wrapUpTime: number;
  simultaneousLines: number;
}

// ---------- VOICEMAIL ----------

export interface TelephonyVoicemail {
  serviceName: string;
  offers: string[];
  description: string;
  email: string;
  forcePassword: boolean;
  isNewVersion: boolean;
  keepMessage: boolean;
  audioFormat: 'aiff' | 'au' | 'flac' | 'mp3' | 'ogg' | 'wav';
  doNotRecord: boolean;
  fromName: string;
  fromEmail: string;
}

export interface TelephonyVoicemailMessage {
  id: number;
  creationDatetime: string;
  duration: number;
  callerIdName: string;
  callerIdNumber: string;
}

// ---------- FAX ----------

export interface TelephonyFax {
  serviceName: string;
  description: string;
  serviceType: 'line' | 'alias';
  featureType: 'fax' | 'voicefax';
  notifications: {
    sendBySms: boolean;
    smsAccount: string | null;
    sendByEmail: boolean;
    email: string | null;
  };
}

export interface TelephonyFaxCampaign {
  id: number;
  name: string;
  status: 'todo' | 'doing' | 'done' | 'failed' | 'error' | 'pause';
  startDate: string;
  recipientsCount: number;
  sentCount: number;
  failedCount: number;
  reference: string;
}

// ---------- COMMON ----------

export interface TelephonyTask {
  taskId: number;
  action: string;
  status: 'todo' | 'doing' | 'done' | 'error';
  serviceType: string;
  creationDate: string;
  finishDate: string | null;
}

export interface TelephonyHistoryConsumption {
  date: string;
  price: { value: number; currencyCode: string };
  priceOutplan: { value: number; currencyCode: string };
  status: 'paid' | 'pending' | 'refunded';
}

export interface TelephonyAbbreviatedNumber {
  abbreviatedNumber: number;
  destinationNumber: string;
  name: string;
  surname: string;
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

// ---------- VIEW TYPES ----------

export type VoipViewType = 'groups' | 'lines' | 'numbers' | 'fax';

// Type pour les filtres de service dans le Left Panel
export type ServiceFilterType = 'voip' | 'sms' | 'fax';

export interface VoipLeftPanelItem {
  id: string;
  type: ServiceFilterType;
  title: string;
  subtitle: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'error' | 'info';
  counts?: { lines?: number; numbers?: number; fax?: number };
}

// ---------- SMS TYPES ----------

export interface SmsAccount {
  name: string;
  description: string;
  status: 'enable' | 'disable';
  creditsLeft: number;
  creditsHoldByQuota: number;
  automaticRecreditAmount: number | null;
  callBack: string | null;
  smsResponse: {
    cgiUrl: string | null;
    responseType: 'none' | 'cgi' | 'sms';
    trackingDefaultSmsSender: string | null;
  };
}

export interface SmsSender {
  sender: string;
  description: string;
  status: 'enable' | 'disable' | 'waitingValidation';
  referer: 'custom' | 'domain' | 'line' | 'nichandle' | 'virtual';
}

export interface SmsJob {
  id: number;
  message: string;
  sender: string;
  receiver: string;
  deliveryReceipt: number;
  differedDelivery: number;
  ptt: number;
  credits: number;
  createdAt: string;
  sentAt: string | null;
}
