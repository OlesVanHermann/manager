// ============================================================
// INVOICES TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as invoicesService from "./InvoicesTab.service";
import { FileTextIcon, FileIcon } from "./InvoicesTab.icons";
import type { TabProps } from "../../billing.types";
import "./InvoicesTab.css";

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
  const windowSize = invoicesService.getWindowSizeFromRange(monthCount);

  const canGoPrevious = period.year > invoicesService.MIN_YEAR || period.startMonth > 0;
  const canGoNext = (() => {
    if (period.year < currentYear) return true;
    if (period.year === currentYear) {
      const blocks = invoicesService.getBlocks(windowSize);
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
      const blocks = invoicesService.getBlocks(windowSize);
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
      const blocks = invoicesService.getBlocks(windowSize);
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
    return invoicesService.getDateRange(period.year, period.startMonth, period.endMonth);
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

export function InvoicesTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/invoices");
  const { t: tCommon } = useTranslation("common");

  const [bills, setBills] = useState<invoicesService.Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nav = usePeriodNavigation();
  const MONTHS_SHORT = t("months.short", { returnObjects: true }) as string[];

  const loadBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = nav.getDateRangeISO();
      const data = await invoicesService.getBills({ "date.from": range.from, "date.to": range.to });
      setBills(data);
      nav.setAnchor();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  }, [nav.getDateRangeISO, nav.setAnchor, t]);

  useEffect(() => {
    loadBills();
  }, [nav.year, nav.startMonth, nav.endMonth]);

  const exportCSV = () => {
    const headers = ["ID", "Date", "Montant HT", "TVA", "Montant TTC"];
    const rows = bills.map((b) => [
      b.billId,
      invoicesService.formatDate(b.date),
      b.priceWithoutTax.text,
      b.tax.text,
      b.priceWithTax.text,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factures_${nav.year}_${nav.startMonth + 1}-${nav.endMonth + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    bills.forEach((b) => {
      if (b.pdfUrl) window.open(b.pdfUrl, "_blank");
    });
  };

  if (loading) {
    return (
      <div className="billing-invoices-tab-panel">
        <div className="billing-invoices-loading-state">
          <div className="billing-invoices-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-invoices-tab-panel">
        <div className="billing-invoices-error-banner">
          {error}
          <button onClick={loadBills} className="billing-invoices-btn invoices-btn-sm invoices-btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-invoices-tab-panel">
      <div className="billing-invoices-toolbar">
        <div className="billing-invoices-toolbar-left">
          <span className="billing-invoices-year-label">{nav.year}</span>
          <button className="billing-invoices-btn invoices-nav-btn" onClick={nav.goToPrevious} disabled={!nav.canGoPrevious} title={t("nav.previous")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <select className="billing-invoices-period-select" value={nav.startMonth} onChange={(e) => nav.handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          <span className="billing-invoices-date-separator">→</span>
          <select className="billing-invoices-period-select" value={nav.endMonth} onChange={(e) => nav.handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          <button className="billing-invoices-btn invoices-nav-btn" onClick={nav.goToNext} disabled={!nav.canGoNext} title={t("nav.next")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          {nav.showReset && (
            <button className="billing-invoices-btn invoices-reset-btn" onClick={nav.resetToAnchor} title={t("nav.reset")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        <div className="billing-invoices-toolbar-right">
          {bills.length > 0 && (
            <>
              <button className="billing-invoices-btn invoices-btn-sm invoices-btn-secondary" onClick={exportCSV} title={t("export.csv")}>
                <FileTextIcon /> CSV
              </button>
              <button className="billing-invoices-btn invoices-btn-sm invoices-btn-secondary" onClick={exportPDF} title={t("export.pdf")}>
                <FileIcon /> PDF
              </button>
            </>
          )}
          <span className="billing-invoices-result-count">{t("count", { count: bills.length })}</span>
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="billing-invoices-empty-state">
          <FileTextIcon />
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="billing-invoices-table-container">
          <table className="billing-invoices-data-table">
            <thead>
              <tr>
                <th>{t("columns.id")}</th>
                <th>{t("columns.date")}</th>
                <th>{t("columns.amountHT")}</th>
                <th>{t("columns.tax")}</th>
                <th>{t("columns.amountTTC")}</th>
                <th>{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.billId}>
                  <td className="billing-invoices-bill-id">{bill.billId}</td>
                  <td>{invoicesService.formatDate(bill.date)}</td>
                  <td>{bill.priceWithoutTax.text}</td>
                  <td>{bill.tax.text}</td>
                  <td className="billing-invoices-amount-ttc">{bill.priceWithTax.text}</td>
                  <td className="billing-invoices-actions-cell">
                    {bill.pdfUrl && (
                      <a href={bill.pdfUrl} target="_blank" rel="noopener noreferrer" className="billing-invoices-btn invoices-btn-outline invoices-btn-sm">
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
