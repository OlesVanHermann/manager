// ============================================================
// REFUNDS TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as refundsService from "./RefundsTab.service";
import { FileTextIcon, FileIcon } from "./RefundsTab.icons";
import type { TabProps } from "../../billing.types";
import "./RefundsTab.css";

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
  const windowSize = refundsService.getWindowSizeFromRange(monthCount);

  const canGoPrevious = period.year > refundsService.MIN_YEAR || period.startMonth > 0;
  const canGoNext = (() => {
    if (period.year < currentYear) return true;
    if (period.year === currentYear) {
      const blocks = refundsService.getBlocks(windowSize);
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
      const blocks = refundsService.getBlocks(windowSize);
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
      const blocks = refundsService.getBlocks(windowSize);
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
    return refundsService.getDateRange(period.year, period.startMonth, period.endMonth);
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

export function RefundsTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/refunds");
  const { t: tCommon } = useTranslation("common");

  const [refunds, setRefunds] = useState<refundsService.Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nav = usePeriodNavigation();
  const MONTHS_SHORT = t("months.short", { returnObjects: true }) as string[];

  const loadRefunds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = nav.getDateRangeISO();
      const data = await refundsService.getRefunds({ "date.from": range.from, "date.to": range.to });
      setRefunds(data);
      nav.setAnchor();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  }, [nav.getDateRangeISO, nav.setAnchor, t]);

  useEffect(() => {
    loadRefunds();
  }, [nav.year, nav.startMonth, nav.endMonth]);

  const exportCSV = () => {
    const headers = ["ID", "Date", "Montant HT", "TVA", "Montant TTC", "Facture origine"];
    const rows = refunds.map((r) => [
      r.refundId,
      refundsService.formatDate(r.date),
      r.priceWithoutTax.text,
      r.tax.text,
      r.priceWithTax.text,
      r.originalBillId || "-",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avoirs_${nav.year}_${nav.startMonth + 1}-${nav.endMonth + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    refunds.forEach((r) => {
      if (r.pdfUrl) window.open(r.pdfUrl, "_blank");
    });
  };

  if (loading) {
    return (
      <div className="refunds-tab-panel">
        <div className="refunds-loading-state">
          <div className="refunds-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="refunds-tab-panel">
        <div className="refunds-error-banner">
          {error}
          <button onClick={loadRefunds} className="refunds-btn refunds-btn-sm refunds-btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="refunds-tab-panel">
      <div className="refunds-toolbar">
        <div className="refunds-toolbar-left">
          <span className="refunds-year-label">{nav.year}</span>
          <button className="refunds-btn refunds-nav-btn" onClick={nav.goToPrevious} disabled={!nav.canGoPrevious} title={t("nav.previous")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <select className="refunds-period-select" value={nav.startMonth} onChange={(e) => nav.handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          <span className="refunds-date-separator">→</span>
          <select className="refunds-period-select" value={nav.endMonth} onChange={(e) => nav.handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          <button className="refunds-btn refunds-nav-btn" onClick={nav.goToNext} disabled={!nav.canGoNext} title={t("nav.next")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          {nav.showReset && (
            <button className="refunds-btn refunds-reset-btn" onClick={nav.resetToAnchor} title={t("nav.reset")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        <div className="refunds-toolbar-right">
          {refunds.length > 0 && (
            <>
              <button className="refunds-btn refunds-btn-sm refunds-btn-secondary" onClick={exportCSV} title={t("export.csv")}>
                <FileTextIcon /> CSV
              </button>
              <button className="refunds-btn refunds-btn-sm refunds-btn-secondary" onClick={exportPDF} title={t("export.pdf")}>
                <FileIcon /> PDF
              </button>
            </>
          )}
          <span className="refunds-result-count">{t("count", { count: refunds.length })}</span>
        </div>
      </div>

      {refunds.length === 0 ? (
        <div className="refunds-empty-state">
          <FileTextIcon />
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <div className="refunds-table-container">
          <table className="refunds-data-table">
            <thead>
              <tr>
                <th>{t("columns.id")}</th>
                <th>{t("columns.date")}</th>
                <th>{t("columns.amountHT")}</th>
                <th>{t("columns.tax")}</th>
                <th>{t("columns.amountTTC")}</th>
                <th>{t("columns.originalBill")}</th>
                <th>{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund) => (
                <tr key={refund.refundId}>
                  <td className="refunds-refund-id">{refund.refundId}</td>
                  <td>{refundsService.formatDate(refund.date)}</td>
                  <td>{refund.priceWithoutTax.text}</td>
                  <td>{refund.tax.text}</td>
                  <td className="refunds-amount-ttc">{refund.priceWithTax.text}</td>
                  <td>{refund.originalBillId || "-"}</td>
                  <td className="refunds-actions-cell">
                    {refund.pdfUrl && (
                      <a href={refund.pdfUrl} target="_blank" rel="noopener noreferrer" className="refunds-btn refunds-btn-outline refunds-btn-sm">
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
