// ============================================================
// SUPPORT TYPES - Types partagés pour NAV2=support
// ============================================================

// ============ CREDENTIALS ============

export interface OvhCredentials {
  appKey: string;
  appSecret: string;
  consumerKey?: string;
}

// ============ TICKETS ============

export interface SupportTicket {
  ticketId: number;
  ticketNumber: number;
  serviceName?: string;
  subject: string;
  state: "closed" | "open" | "unknown";
  type: "assistance" | "billing" | "incident";
  creationDate: string;
  lastMessageFrom: "customer" | "support";
  updateDate: string;
  score?: string;
}

export interface TicketMessage {
  messageId: string;
  body: string;
  creationDate: string;
  from: "customer" | "support";
  updateDate: string;
}

// ============ SUPPORT LEVEL ============

export interface SupportLevel {
  level: "standard" | "premium" | "premium-accredited" | "business" | "enterprise";
}

// ============ CONTACT MEANS ============

export type ContactMeanStatus = "DISABLED" | "ERROR" | "VALID" | "TO_VALIDATE";
export type ContactMeanType = "EMAIL";

export interface ContactMean {
  id: string;
  createdAt: string;
  default: boolean;
  description: string | null;
  email: string | null;
  error: string | null;
  status: ContactMeanStatus;
  type: ContactMeanType;
}

// ============ NOTIFICATIONS ============

export interface NotificationHistory {
  id: string;
  createdAt: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  contentHtml?: string;
  contentText?: string;
}

export interface NotificationRouting {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  rules: NotificationRoutingRule[];
}

export interface NotificationRoutingRule {
  continue: boolean;
  condition: {
    category: string[];
    priority: string[];
  };
  contactMeans: { id: string; email: string; status: string }[];
}

export interface NotificationReference {
  categories: { id: string; name: string }[];
  priorities: { id: string; name: string }[];
}

// ============ MARKETING ============

export interface MarketingPreferences {
  email: boolean;
  phone: boolean;
  sms: boolean;
  fax: boolean;
}
