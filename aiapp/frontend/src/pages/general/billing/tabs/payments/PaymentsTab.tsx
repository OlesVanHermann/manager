// ============================================================
// PAYMENTS TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as paymentsService from "./PaymentsTab.service";
import { CreditCardIcon, FileTextIcon } from "./PaymentsTab.icons";
import type { TabProps } from "../../billing.types";
import "./PaymentsTab.css";

// ============ TYPES ============

interface PeriodState {
  year: number;
  startMonth: number;
  endMonth: number;
  anchorYear: number | null;
  anchorStartMonth: number | null;
  anchorEndMonth: number | null;
}

// ============ HOOK ============

function usePeriodNavigation() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [period, setPeriod] = useState<PeriodState>({
    year: currentYear,
    startMonth: currentMonth,
    endMonth: currentMonth,
    anchorYear: null,
    anchorStartMonth: null,
    anchorEndMonth: null,
  });

  const monthCount = period.endMonth - period.startMonth + 1;
  const windowSize = paymentsService.getWindowSizeFromRange(monthCount);

  const canGoPrevious = period.year > paymentsService.MIN_YEAR || period.startMonth > 0;
  const canGoNext = (() => {
    if (period.year < currentYear) return true;
    if (period.year === currentYear) {
      const blocks = paymentsService.getBlocks(windowSize);
      const idx = blocks.findIndex(([s]) => s === period.startMonth);
      if (idx >= 0 && idx < blocks.length - 1) return blocks[idx + 1][1] <= currentMonth;
    }
    return false;
  })();

  const showReset = period.anchorYear !== null && 
    (period.year !== period.anchorYear || period.startMonth !== period.anchorStartMonth || period.endMonth !== period.anchorEndMonth);

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    setPeriod((p) => {
      const blocks = paymentsService.getBlocks(windowSize);
      const idx = blocks.findIndex(([s]) => s === p.startMonth);
      if (idx > 0) {
        const [s, e] = blocks[idx - 1];
        return { ...p, startMonth: s, endMonth: e };
      } else if (idx === 0) {
        const [s, e] = blocks[blocks.length - 1];
        return { ...p, year: p.year - 1, startMonth: s, endMonth: e };
      }
      return p;
    });
  }, [canGoPrevious, windowSize]);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    setPeriod((p) => {
      const blocks = paymentsService.getBlocks(windowSize);
      const idx = blocks.findIndex(([s]) => s === p.startMonth);
      if (idx >= 0 && idx < blocks.length - 1) {
        const [s, e] = blocks[idx + 1];
        return { ...p, startMonth: s, endMonth: e };
      } else if (idx === blocks.length - 1) {
        const [s, e] = blocks[0];
        return { ...p, year: p.year + 1, startMonth: s, endMonth: e };
      }
      return p;
    });
  }, [canGoNext, windowSize]);

  const resetToAnchor = useCallback(() => {
    setPeriod((p) => {
      if (p.anchorYear === null) return p;
      return { ...p, year: p.anchorYear, startMonth: p.anchorStartMonth!, endMonth: p.anchorEndMonth! };
    });
  }, []);

  const setAnchor = useCallback(() => {
    setPeriod((p) => ({ ...p, anchorYear: p.year, anchorStartMonth: p.startMonth, anchorEndMonth: p.endMonth }));
  }, []);

  const handleStartMonthChange = useCallback((v: number) => {
    setPeriod((p) => ({ ...p, startMonth: v }));
  }, []);

  const handleEndMonthChange = useCallback((v: number) => {
    setPeriod((p) => ({ ...p, endMonth: v }));
  }, []);

  const getDateRangeISO = useCallback(() => {
    return paymentsService.getDateRange(period.year, period.startMonth, period.endMonth);
  }, [period.year, period.startMonth, period.endMonth]);

  return {
    year: period.year,
    startMonth: period.startMonth,
    endMonth: period.endMonth,
    canGoPrevious,
    canGoNext,
    showReset,
    goToPrevious,
    goToNext,
    resetToAnchor,
    setAnchor,
    handleStartMonthChange,
    handleEndMonthChange,
    getDateRangeISO,
  };
}

// ============ COMPOSANT ============

export function PaymentsTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/payments");
  const { t: tCommon } = useTranslation("common");

  const [payments, setPayments] = useState<paymentsService.Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nav = usePeriodNavigation();
  const MONTHS_SHORT = t("months.short", { returnObjects: true }) as string[];

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = nav.getDateRangeISO();
      const data = await paymentsService.getPayments({ "date.from": range.from, "date.to": range.to });
      setPayments(data);
      nav.setAnchor();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  }, [nav.getDateRangeISO, nav.setAnchor, t]);

  useEffect(() => {
    loadPayments();
  }, [nav.year, nav.startMonth, nav.endMonth]);

  const exportCSV = () => {
    const headers = ["ID", "Date", "Montant", "Type", "Statut", "Facture"];
    const rows = payments.map((p) => [
      p.paymentId,
      paymentsService.formatDate(p.date),
      p.amount.text,
      p.paymentType,
      p.status,
      p.billId || "-",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paiements_${nav.year}_${nav.startMonth + 1}-${nav.endMonth + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PAID": return "billing-payments-badge-success";
      case "PENDING": return "billing-payments-badge-warning";
      case "CANCELLED": return "billing-payments-badge-neutral";
      case "FAILED": return "billing-payments-badge-error";
      default: return "billing-payments-badge-neutral";
    }
  };

  if (loading) {
    return (
      <div className="billing-payments-tab-panel">
        <div className="billing-payments-loading-state">
          <div className="billing-payments-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-payments-tab-panel">
        <div className="billing-payments-error-banner">
          {error}
          <button onClick={loadPayments} className="billing-payments-btn payments-btn-sm payments-btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-payments-tab-panel">
      <div className="billing-payments-toolbar">
        <div className="billing-payments-toolbar-left">
          <span className="billing-payments-year-label">{nav.year}</span>
          <button className="billing-payments-btn payments-nav-btn" onClick={nav.goToPrevious} disabled={!nav.canGoPrevious} title={t("nav.previous")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <select className="billing-payments-period-select" value={nav.startMonth} onChange={(e) => nav.handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          <span className="billing-payments-date-separator">→</span>
          <select className="billing-payments-period-select" value={nav.endMonth} onChange={(e) => nav.handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          <button className="billing-payments-btn payments-nav-btn" onClick={nav.goToNext} disabled={!nav.canGoNext} title={t("nav.next")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          {nav.showReset && (
            <button className="billing-payments-btn payments-reset-btn" onClick={nav.resetToAnchor} title={t("nav.reset")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        <div className="billing-payments-toolbar-right">
          {payments.length > 0 && (
            <button className="billing-payments-btn payments-btn-sm payments-btn-secondary" onClick={exportCSV} title={t("export.csv")}>
              <FileTextIcon /> CSV
            </button>
          )}
          <span className="billing-payments-result-count">{t("count", { count: payments.length })}</span>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="billing-payments-empty-state">
          <CreditCardIcon />
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="billing-payments-table-container">
          <table className="billing-payments-data-table">
            <thead>
              <tr>
                <th>{t("columns.id")}</th>
                <th>{t("columns.date")}</th>
                <th>{t("columns.amount")}</th>
                <th>{t("columns.type")}</th>
                <th>{t("columns.status")}</th>
                <th>{t("columns.bill")}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.paymentId}>
                  <td className="billing-payments-payment-id">{payment.paymentId}</td>
                  <td>{paymentsService.formatDate(payment.date)}</td>
                  <td className="billing-payments-amount">{payment.amount.text}</td>
                  <td>{payment.paymentType}</td>
                  <td>
                    <span className={`payments-status-badge ${getStatusBadgeClass(payment.status)}`}>
                      {t(`status.${payment.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td>{payment.billId || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
