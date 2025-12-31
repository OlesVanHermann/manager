// ============================================================
// ORDERS TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as ordersService from "./OrdersTab.service";
import { ShoppingCartIcon, FileTextIcon, FileIcon } from "./OrdersTab.icons";
import type { TabProps } from "../../billing.types";
import "./OrdersTab.css";

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
  const windowSize = ordersService.getWindowSizeFromRange(monthCount);

  const canGoPrevious = period.year > ordersService.MIN_YEAR || period.startMonth > 0;
  const canGoNext = (() => {
    if (period.year < currentYear) return true;
    if (period.year === currentYear) {
      const blocks = ordersService.getBlocks(windowSize);
      const isAligned = blocks.some(([s, e]) => s === period.startMonth && e === period.endMonth);

      if (isAligned) {
        const idx = blocks.findIndex(([s]) => s === period.startMonth);
        if (idx >= 0 && idx < blocks.length - 1) return blocks[idx + 1][1] <= currentMonth;
      } else {
        // DESALIGNE: check if there's a block with B.end > endMonth
        const candidates = blocks.filter(([, e]) => e > period.endMonth);
        if (candidates.length > 0) return candidates[0][1] <= currentMonth;
      }
    }
    return false;
  })();

  const showReset = period.anchorYear !== null && 
    (period.year !== period.anchorYear || period.startMonth !== period.anchorStartMonth || period.endMonth !== period.anchorEndMonth);

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    setPeriod((p) => {
      const blocks = ordersService.getBlocks(windowSize);
      const isAligned = blocks.some(([s, e]) => s === p.startMonth && e === p.endMonth);

      if (isAligned) {
        const idx = blocks.findIndex(([s]) => s === p.startMonth);
        if (idx > 0) {
          const [s, e] = blocks[idx - 1];
          return { ...p, startMonth: s, endMonth: e };
        } else {
          const [s, e] = blocks[blocks.length - 1];
          return { ...p, year: p.year - 1, startMonth: s, endMonth: e };
        }
      } else {
        // DESALIGNE: snap vers bloc strictement avant (B.start < startMonth)
        const candidates = blocks.filter(([s]) => s < p.startMonth);
        if (candidates.length > 0) {
          const [s, e] = candidates[candidates.length - 1];
          return { ...p, startMonth: s, endMonth: e };
        } else {
          const [s, e] = blocks[blocks.length - 1];
          return { ...p, year: p.year - 1, startMonth: s, endMonth: e };
        }
      }
    });
  }, [canGoPrevious, windowSize]);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    setPeriod((p) => {
      const blocks = ordersService.getBlocks(windowSize);
      const isAligned = blocks.some(([s, e]) => s === p.startMonth && e === p.endMonth);

      if (isAligned) {
        const idx = blocks.findIndex(([s]) => s === p.startMonth);
        if (idx < blocks.length - 1) {
          const [s, e] = blocks[idx + 1];
          return { ...p, startMonth: s, endMonth: e };
        } else {
          const [s, e] = blocks[0];
          return { ...p, year: p.year + 1, startMonth: s, endMonth: e };
        }
      } else {
        // DESALIGNE: snap vers bloc strictement apres (B.end > endMonth)
        const candidates = blocks.filter(([, e]) => e > p.endMonth);
        if (candidates.length > 0) {
          const [s, e] = candidates[0];
          return { ...p, startMonth: s, endMonth: e };
        } else {
          const [s, e] = blocks[0];
          return { ...p, year: p.year + 1, startMonth: s, endMonth: e };
        }
      }
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
    return ordersService.getDateRange(period.year, period.startMonth, period.endMonth);
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

export function OrdersTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/orders");
  const { t: tCommon } = useTranslation("common");

  const [orders, setOrders] = useState<ordersService.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nav = usePeriodNavigation();
  const MONTHS_SHORT = t("months.short", { returnObjects: true }) as string[];

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = nav.getDateRangeISO();
      const data = await ordersService.getOrders({ "date.from": range.from, "date.to": range.to });
      setOrders(data);
      nav.setAnchor();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  }, [nav.getDateRangeISO, nav.setAnchor, t]);

  useEffect(() => {
    loadOrders();
  }, [nav.year, nav.startMonth, nav.endMonth]);

  const exportCSV = () => {
    const headers = ["ID", "Date", "Montant HT", "TVA", "Montant TTC", "Expiration"];
    const rows = orders.map((o) => [
      o.orderId.toString(),
      ordersService.formatDate(o.date),
      o.priceWithoutTax.text,
      o.tax.text,
      o.priceWithTax.text,
      o.expirationDate ? ordersService.formatDate(o.expirationDate) : "-",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commandes_${nav.year}_${nav.startMonth + 1}-${nav.endMonth + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    orders.forEach((o) => {
      if (o.pdfUrl) window.open(o.pdfUrl, "_blank");
    });
  };

  if (loading) {
    return (
      <div className="billing-orders-tab-panel">
        <div className="billing-orders-loading-state">
          <div className="billing-orders-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-orders-tab-panel">
        <div className="billing-orders-error-banner">
          {error}
          <button onClick={loadOrders} className="billing-orders-btn orders-btn-sm orders-btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-orders-tab-panel">
      <div className="billing-orders-toolbar">
        <div className="billing-orders-toolbar-left">
          <span className="billing-orders-year-label">{nav.year}</span>
          <button className="billing-orders-btn orders-nav-btn" onClick={nav.goToPrevious} disabled={!nav.canGoPrevious} title={t("nav.previous")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <select className="billing-orders-period-select" value={nav.startMonth} onChange={(e) => nav.handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          <span className="billing-orders-date-separator">→</span>
          <select className="billing-orders-period-select" value={nav.endMonth} onChange={(e) => nav.handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          <button className="billing-orders-btn orders-nav-btn" onClick={nav.goToNext} disabled={!nav.canGoNext} title={t("nav.next")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          {nav.showReset && (
            <button className="billing-orders-btn orders-reset-btn" onClick={nav.resetToAnchor} title={t("nav.reset")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        <div className="billing-orders-toolbar-right">
          {orders.length > 0 && (
            <>
              <button className="billing-orders-btn orders-btn-sm orders-btn-secondary" onClick={exportCSV} title={t("export.csv")}>
                <FileTextIcon /> CSV
              </button>
              <button className="billing-orders-btn orders-btn-sm orders-btn-secondary" onClick={exportPDF} title={t("export.pdf")}>
                <FileIcon /> PDF
              </button>
            </>
          )}
          <span className="billing-orders-result-count">{t("count", { count: orders.length })}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="billing-orders-empty-state">
          <ShoppingCartIcon />
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="billing-orders-table-container">
          <table className="billing-orders-data-table">
            <thead>
              <tr>
                <th>{t("columns.id")}</th>
                <th>{t("columns.date")}</th>
                <th>{t("columns.amountHT")}</th>
                <th>{t("columns.tax")}</th>
                <th>{t("columns.amountTTC")}</th>
                <th>{t("columns.expiration")}</th>
                <th>{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="billing-orders-order-id">{order.orderId}</td>
                  <td>{ordersService.formatDate(order.date)}</td>
                  <td>{order.priceWithoutTax.text}</td>
                  <td>{order.tax.text}</td>
                  <td className="billing-orders-amount-ttc">{order.priceWithTax.text}</td>
                  <td>{order.expirationDate ? ordersService.formatDate(order.expirationDate) : "-"}</td>
                  <td className="billing-orders-actions-cell">
                    {order.pdfUrl && (
                      <a href={order.pdfUrl} target="_blank" rel="noopener noreferrer" className="billing-orders-btn orders-btn-outline orders-btn-sm">
                        PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
