// ============================================================
// NUMBERS TYPES - Types spécifiques aux numéros VoIP
// ============================================================

export type NumberTabId =
  | 'dashboard'
  | 'general'
  | 'configuration'
  | 'calls'
  | 'consumption'
  | 'scheduler'
  | 'options'
  | 'records'
  | 'agents'
  | 'ddi'
  | 'sounds'
  | 'stats'
  | 'svi';

export interface NumberServiceInfos {
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

export interface NumberConfiguration {
  featureType: 'redirect' | 'ddi' | 'conference' | 'ivr' | 'voicemail' | 'svi' | 'easyHunting' | 'miniPabx';
  destination?: string;
  destinationType?: 'line' | 'number' | 'voicemail' | 'external';
}

export interface NumberRedirect {
  destination: string;
  featureType: 'redirect';
}

export interface NumberDDI {
  destination: string;
  featureType: 'ddi';
}

export interface NumberConference {
  featureType: 'conference';
  pin?: string;
  announceFile?: boolean;
  recordStatus: boolean;
  reportEmail?: string;
  reportStatus: 'none' | 'customer' | 'other';
  language: string;
}

export interface NumberIVR {
  featureType: 'ivr';
  name: string;
  ivrMenuId: number;
  timeout: number;
  maxWaitTime: number;
}

export interface NumberScheduler {
  id: number;
  name: string;
  status: 'enabled' | 'disabled';
  timeConditions: ScheduleTimeCondition[];
}

export interface ScheduleTimeCondition {
  id: number;
  weekDay: string;
  timeFrom: string;
  timeTo: string;
  policy: 'available' | 'unavailable';
  destination?: string;
}

export interface NumberCall {
  id: string;
  callingNumber: string;
  calledNumber: string;
  type: 'incoming' | 'outgoing';
  date: string;
  duration: number;
  price: number;
  destination?: string;
}

export interface NumberConsumption {
  date: string;
  type: 'call' | 'sms';
  destination: string;
  duration: number;
  price: number;
}

export interface NumberRecord {
  id: string;
  filename: string;
  date: string;
  duration: number;
  callingNumber: string;
  calledNumber: string;
  status: 'available' | 'deleted';
}

export interface NumberOptions {
  displayNumber: boolean;
  recordIncomingCalls: boolean;
  antiSpam: boolean;
}

// ============================================================
// AGENTS TYPES
// ============================================================

export interface NumberAgent {
  agentId: number;
  number: string;
  description: string;
  simultaneousLines: number;
  status: 'available' | 'loggedOut' | 'onACall' | 'wrapUp';
  timeout: number;
  wrapUpTime: number;
  callsCount?: number;
  avgDuration?: number;
  priority?: number;
  type?: 'internal' | 'external';
}

// ============================================================
// DDI TYPES
// ============================================================

export interface NumberDDIRule {
  id: number;
  extension: string;
  destination: string;
  destinationType: 'internal' | 'external' | 'queue' | 'svi';
  description?: string;
  status: 'active' | 'inactive';
}

export interface NumberDDIRange {
  start: string;
  end: string;
}

// ============================================================
// SOUNDS TYPES
// ============================================================

export interface NumberSound {
  soundId: number;
  name: string;
  type: 'welcome' | 'waiting' | 'closed' | 'svi';
  filename: string;
  duration?: number;
  size?: number;
  url?: string;
  usedIn?: string[];
}

// ============================================================
// STATS TYPES
// ============================================================

export interface NumberStats {
  callsReceived: number;
  callsAnswered: number;
  callsLost: number;
  avgWaitingTime: number;
  avgTalkTime: number;
  serviceLevel: number;
  callsPerHour: number;
}

export interface NumberStatsAgent {
  agentId: number;
  name: string;
  callsCount: number;
  avgDuration: number;
  rate: number;
}

export interface NumberStatsChart {
  date: string;
  answered: number;
  lost: number;
}

// ============================================================
// SVI (IVR) TYPES
// ============================================================

export interface NumberSVIMenu {
  menuId: number;
  name: string;
  greetSound?: string;
  greetSoundTts?: string;
  invalidSound?: string;
  timeout: number;
  entries: NumberSVIEntry[];
}

export interface NumberSVIEntry {
  entryId: number;
  dtmf: string;
  action: 'queue' | 'menu' | 'line' | 'voicemail' | 'hangup' | 'repeat';
  actionParam?: string;
  position: number;
}
