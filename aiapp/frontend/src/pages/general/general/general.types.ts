// ============================================================
// GENERAL TYPES - Types partagés pour NAV2=general (dashboard)
// ============================================================

// ============ USER ============

export interface UserInfo {
  firstname?: string;
  name?: string;
  nichandle?: string;
  isTrusted?: boolean;
}

// ============ SERVICES ============

export interface ServiceType {
  type: string;
  count: number;
}

export interface ServiceSummary {
  total: number;
  types: ServiceType[];
}

// ============ BILLING ============

export interface Bill {
  billId: string;
  date: string;
  priceWithTax: { text: string; value: number };
  pdfUrl: string;
}

export interface DebtAccount {
  dueAmount?: { value: number };
}

export interface Order {
  orderId: number;
  date: string;
  status: string;
  priceWithTax: { text: string; value: number };
}

// ============ ALERTS ============

export interface Notification {
  id: string;
  subject: string;
  date: string;
  level: string;
}

export interface Ticket {
  ticketId: number;
  subject: string;
  creationDate: string;
}

export interface DashboardAlerts {
  lastOrder?: { order: Order; tracking?: { progress?: number } };
  notifications?: Notification[];
  openTickets?: Ticket[];
}

// ============ STATE ============

export interface LoadingState {
  services: boolean;
  billing: boolean;
  alerts: boolean;
}

export interface ErrorState {
  services: string | null;
  billing: string | null;
  alerts: string | null;
}

export interface HomeData {
  services: ServiceSummary | null;
  lastBill: Bill | null;
  debtAmount: number;
  alerts: DashboardAlerts | null;
  loading: LoadingState;
  errors: ErrorState;
  loadServices: () => Promise<void>;
  loadBilling: () => Promise<void>;
  loadAlerts: () => Promise<void>;
}
