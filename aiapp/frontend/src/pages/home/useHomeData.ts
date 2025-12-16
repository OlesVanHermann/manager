// ============================================================
// USE HOME DATA - Hook de chargement des données du dashboard
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { isAuthenticated, redirectToAuth } from "../../services/api";
import * as servicesService from "../../services/home.billing.services";
import * as billingService from "../../services/home.billing";
import * as notificationsService from "../../services/home.notifications";

// ============ TYPES ============

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
  services: servicesService.ServiceSummary | null;
  lastBill: billingService.Bill | null;
  debtAmount: number;
  alerts: notificationsService.DashboardAlerts | null;
  loading: LoadingState;
  errors: ErrorState;
  loadServices: () => Promise<void>;
  loadBilling: () => Promise<void>;
  loadAlerts: () => Promise<void>;
}

// ============ HOOK ============

/** Hook de chargement des données du dashboard (services, billing, alerts). */
export function useHomeData(): HomeData {
  const { t } = useTranslation('home/dashboard');

  // ---------- STATE ----------
  const [services, setServices] = useState<servicesService.ServiceSummary | null>(null);
  const [lastBill, setLastBill] = useState<billingService.Bill | null>(null);
  const [debtAmount, setDebtAmount] = useState(0);
  const [alerts, setAlerts] = useState<notificationsService.DashboardAlerts | null>(null);

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

  // ---------- LOADERS ----------
  const loadServices = useCallback(async () => {
    setLoading((prev) => ({ ...prev, services: true }));
    setErrors((prev) => ({ ...prev, services: null }));
    try {
      const data = await servicesService.getServicesSummary();
      setServices(data);
    } catch (err) {
      setErrors((prev) => ({ ...prev, services: t('errors.servicesLoad') }));
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  }, [t]);

  const loadBilling = useCallback(async () => {
    setLoading((prev) => ({ ...prev, billing: true }));
    setErrors((prev) => ({ ...prev, billing: null }));
    try {
      const [bills, debt] = await Promise.all([
        billingService.getBills({ limit: 1 }),
        billingService.getDebtAccount().catch(() => null),
      ]);
      setLastBill(bills.length > 0 ? bills[0] : null);
      setDebtAmount(debt?.dueAmount?.value || 0);
    } catch (err) {
      setErrors((prev) => ({ ...prev, billing: t('errors.billingLoad') }));
    } finally {
      setLoading((prev) => ({ ...prev, billing: false }));
    }
  }, [t]);

  const loadAlerts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, alerts: true }));
    setErrors((prev) => ({ ...prev, alerts: null }));
    try {
      const data = await notificationsService.getDashboardAlerts();
      setAlerts(data);
    } catch (err) {
      setAlerts(null);
    } finally {
      setLoading((prev) => ({ ...prev, alerts: false }));
    }
  }, []);

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }
    loadServices();
    loadBilling();
    loadAlerts();
  }, [loadServices, loadBilling, loadAlerts]);

  // ---------- RETURN ----------
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
