// ============================================================
// GENERAL TAB SERVICE - Dashboard principal OVHcloud
// NAV1: general / NAV2: general / NAV3: general
// ISOLÉ - Aucune dépendance vers d'autres tabs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhGet, isAuthenticated, redirectToAuth } from "../../../../../services/api";
import type {
  UserInfo,
  ServiceSummary,
  Bill,
  DebtAccount,
  DashboardAlerts,
  LoadingState,
  ErrorState,
  HomeData,
  Order,
  Ticket,
} from "../../general.types";

// ============ RE-EXPORT TYPES ============

export type { UserInfo, ServiceSummary, Bill, DashboardAlerts, HomeData };

// ============ CONSTANTS ============

const STORAGE_KEY = "ovh_user";

export const SERVICE_TYPE_MAP: Record<string, string> = {
  "Noms de domaine": "domain",
  "Hebergements Web": "hosting",
  "Emails": "email",
  "VPS": "vps",
  "Serveurs dedies": "dedicated",
  "Public Cloud": "cloud",
  "IP": "ip",
  "Logs Data Platform": "dbaas",
};

// ============ HELPERS ============

/** Récupère les infos utilisateur depuis le sessionStorage. */
export function getUser(): UserInfo | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// ============ API CALLS ============

async function getServicesSummary(): Promise<ServiceSummary> {
  const services = await ovhGet<string[]>("/services");
  const typeCounts: Record<string, number> = {};
  
  for (const serviceId of services.slice(0, 50)) {
    try {
      const svc = await ovhGet<{ serviceId: string; resource: { name: string }; route?: { path?: string } }>(`/services/${serviceId}`);
      const type = svc.route?.path?.split("/")[1] || "other";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    } catch {
      // Ignorer les erreurs individuelles
    }
  }

  const types = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return { total: services.length, types };
}

async function getBills(options: { limit?: number } = {}): Promise<Bill[]> {
  const billIds = await ovhGet<string[]>("/me/bill");
  const limitedIds = billIds.slice(0, options.limit || 10);
  
  const bills = await Promise.all(
    limitedIds.map(async (id) => {
      try {
        return await ovhGet<Bill>(`/me/bill/${id}`);
      } catch {
        return null;
      }
    })
  );
  
  return bills.filter((b): b is Bill => b !== null);
}

async function getDebtAccount(): Promise<DebtAccount | null> {
  try {
    return await ovhGet<DebtAccount>("/me/debtAccount");
  } catch {
    return null;
  }
}

async function getDashboardAlerts(): Promise<DashboardAlerts> {
  const alerts: DashboardAlerts = {};
  
  try {
    const orderIds = await ovhGet<number[]>("/me/order");
    if (orderIds.length > 0) {
      const order = await ovhGet<Order>(`/me/order/${orderIds[0]}`);
      alerts.lastOrder = { order };
    }
  } catch {
    // Ignorer
  }

  try {
    const ticketIds = await ovhGet<number[]>("/support/tickets?status=open");
    if (ticketIds.length > 0) {
      const tickets = await Promise.all(
        ticketIds.slice(0, 5).map((id) => ovhGet<Ticket>(`/support/tickets/${id}`).catch(() => null))
      );
      alerts.openTickets = tickets.filter((t): t is Ticket => t !== null);
    }
  } catch {
    // Ignorer
  }

  return alerts;
}

// ============ HOOK ============

export function useHomeData(): HomeData {
  const { t } = useTranslation("general/general/general");

  const [services, setServices] = useState<ServiceSummary | null>(null);
  const [lastBill, setLastBill] = useState<Bill | null>(null);
  const [debtAmount, setDebtAmount] = useState(0);
  const [alerts, setAlerts] = useState<DashboardAlerts | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    services: true,
    billing: true,
    alerts: true,
  });

  const [errors, setErrors] = useState<ErrorState>({
    services: null,
    billing: null,
    alerts: null,
  });

  const loadServices = useCallback(async () => {
    setLoading((prev) => ({ ...prev, services: true }));
    setErrors((prev) => ({ ...prev, services: null }));
    try {
      const data = await getServicesSummary();
      setServices(data);
    } catch {
      setErrors((prev) => ({ ...prev, services: t("errors.servicesLoad", "Erreur de chargement") }));
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  }, [t]);

  const loadBilling = useCallback(async () => {
    setLoading((prev) => ({ ...prev, billing: true }));
    setErrors((prev) => ({ ...prev, billing: null }));
    try {
      const [bills, debt] = await Promise.all([
        getBills({ limit: 1 }),
        getDebtAccount(),
      ]);
      setLastBill(bills.length > 0 ? bills[0] : null);
      setDebtAmount(debt?.dueAmount?.value || 0);
    } catch {
      setErrors((prev) => ({ ...prev, billing: t("errors.billingLoad", "Erreur de chargement") }));
    } finally {
      setLoading((prev) => ({ ...prev, billing: false }));
    }
  }, [t]);

  const loadAlerts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, alerts: true }));
    try {
      const data = await getDashboardAlerts();
      setAlerts(data);
    } catch {
      setAlerts(null);
    } finally {
      setLoading((prev) => ({ ...prev, alerts: false }));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }
    loadServices();
    loadBilling();
    loadAlerts();
  }, [loadServices, loadBilling, loadAlerts]);

  return {
    services,
    lastBill,
    debtAmount,
    alerts,
    loading,
    errors,
    loadServices,
    loadBilling,
    loadAlerts,
  };
}
