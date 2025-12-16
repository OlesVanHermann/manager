// ============================================================
// NOTIFICATIONS SERVICE - Notifications, Bannières, Commandes
// Utilise 2API avec cookies session
// ============================================================

import { ovh2apiGet, ovhGet } from "./api";

// ============ TYPES - NOTIFICATIONS ============

export interface Notification {
  id: string;
  date: string;
  subject: string;
  description?: string;
  level: "info" | "warning" | "error" | "success";
  status: "unread" | "read" | "acknowledged";
  urlDetails?: string;
}

interface NotificationsResponse {
  data?: Notification[];
  list?: Notification[];
}

// ============ TYPES - BANNIERES ============

export interface Banner {
  id: string;
  message: string;
  level: "info" | "warning" | "error";
  linkUrl?: string;
  linkLabel?: string;
  dismissible?: boolean;
  startDate?: string;
  endDate?: string;
}

interface BannerResponse {
  data?: Banner[];
  banners?: Banner[];
}

// ============ TYPES - COMMANDES ============

export interface LastOrder {
  orderId: number;
  date: string;
  expirationDate?: string;
  status: string;
  priceWithTax: { currencyCode: string; text: string; value: number };
  priceWithoutTax: { currencyCode: string; text: string; value: number };
  url?: string;
}

export interface OrderTracking {
  orderId: number;
  status: string;
  step?: string;
  stepDescription?: string;
  progress?: number;
  estimatedDelivery?: string;
  history?: OrderTrackingStep[];
}

export interface OrderTrackingStep {
  date: string;
  status: string;
  description?: string;
}

// ============ TYPES - SUPPORT ============

export interface SupportTicket {
  ticketId: number;
  subject: string;
  status: string;
  creationDate: string;
  updateDate?: string;
  category?: string;
  serviceName?: string;
}

interface SupportResponse {
  data?: SupportTicket[];
  list?: SupportTicket[];
}

// ============ TYPES - KYC ============

export interface KycStatus {
  required: boolean;
  status: "none" | "pending" | "validated" | "rejected";
  procedures?: KycProcedure[];
}

export interface KycProcedure {
  id: string;
  type: string;
  status: string;
  creationDate?: string;
}

// ============ NOTIFICATIONS ============

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await ovh2apiGet<NotificationsResponse>(
      "/me/notifications",
      { count: 10 },
      { skipAuthRedirect: true }
    );
    return response?.data || response?.list || [];
  } catch {
    console.warn("Notifications non disponibles");
    return [];
  }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  try {
    await ovh2apiGet(`/me/notifications/${notificationId}/read`, undefined, { skipAuthRedirect: true });
  } catch {
    console.warn("Impossible de marquer la notification comme lue");
  }
}

// ============ BANNIERES ============

export async function getBanners(): Promise<Banner[]> {
  try {
    const response = await ovh2apiGet<BannerResponse>(
      "/banner",
      undefined,
      { skipAuthRedirect: true }
    );
    return response?.data || response?.banners || [];
  } catch {
    console.warn("Bannières non disponibles");
    return [];
  }
}

// ============ COMMANDES ============

export async function getLastOrder(): Promise<LastOrder | null> {
  try {
    const response = await ovh2apiGet<LastOrder>(
      "/lastOrder",
      undefined,
      { skipAuthRedirect: true }
    );
    if (response?.orderId) {
      return response;
    }
  } catch {
    try {
      const orderIds = await ovhGet<number[]>("/me/order", { skipAuthRedirect: true });
      if (orderIds && orderIds.length > 0) {
        const lastOrderId = orderIds[0];
        const order = await ovhGet<LastOrder>(`/me/order/${lastOrderId}`, { skipAuthRedirect: true });
        return order;
      }
    } catch {
      console.warn("Commandes non disponibles");
    }
  }
  return null;
}

export async function getOrderTracking(orderId: number): Promise<OrderTracking | null> {
  try {
    const response = await ovh2apiGet<OrderTracking>(
      `/order/${orderId}/tracking`,
      undefined,
      { skipAuthRedirect: true }
    );
    return response || null;
  } catch {
    console.warn("Suivi commande non disponible");
    return null;
  }
}

export async function getLastOrderWithTracking(): Promise<{ order: LastOrder; tracking: OrderTracking | null } | null> {
  const order = await getLastOrder();
  if (!order) return null;

  const orderDate = new Date(order.date);
  const now = new Date();
  const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
  
  const inProgressStatuses = ["checking", "delivering", "delivered", "notPaid", "pending"];
  const isInProgress = inProgressStatuses.includes(order.status.toLowerCase());

  if (daysDiff <= 7 && isInProgress) {
    const tracking = await getOrderTracking(order.orderId);
    return { order, tracking };
  }

  return { order, tracking: null };
}

// ============ SUPPORT ============

export async function getOpenTickets(): Promise<SupportTicket[]> {
  try {
    const response = await ovh2apiGet<SupportResponse>(
      "/support/tickets",
      { status: "open", count: 5 },
      { skipAuthRedirect: true }
    );
    return response?.data || response?.list || [];
  } catch {
    try {
      const ticketIds = await ovhGet<number[]>("/support/tickets?status=open", { skipAuthRedirect: true });
      if (ticketIds && ticketIds.length > 0) {
        const tickets: SupportTicket[] = [];
        const idsToFetch = ticketIds.slice(0, 5);
        for (const id of idsToFetch) {
          try {
            const ticket = await ovhGet<SupportTicket>(`/support/tickets/${id}`, { skipAuthRedirect: true });
            tickets.push(ticket);
          } catch {
            // Skip
          }
        }
        return tickets;
      }
    } catch {
      console.warn("Tickets support non disponibles");
    }
  }
  return [];
}

// ============ KYC ============

export async function getKycStatus(): Promise<KycStatus | null> {
  try {
    const response = await ovh2apiGet<KycStatus>(
      "/me/kyc",
      undefined,
      { skipAuthRedirect: true }
    );
    return response || null;
  } catch {
    return null;
  }
}

// ============ DASHBOARD AGGREGATOR ============

export interface DashboardAlerts {
  notifications: Notification[];
  banners: Banner[];
  lastOrder: { order: LastOrder; tracking: OrderTracking | null } | null;
  openTickets: SupportTicket[];
  kycStatus: KycStatus | null;
}

export async function getDashboardAlerts(): Promise<DashboardAlerts> {
  const [notifications, banners, lastOrder, openTickets, kycStatus] = await Promise.all([
    getNotifications(),
    getBanners(),
    getLastOrderWithTracking(),
    getOpenTickets(),
    getKycStatus(),
  ]);

  return {
    notifications,
    banners,
    lastOrder,
    openTickets,
    kycStatus,
  };
}
