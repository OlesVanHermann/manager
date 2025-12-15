// ============================================================
// REFUNDS TAB - Avoirs avec chargement streaming + fallback
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, formatAmount, formatDateISO } from "../utils";
import { DownloadIcon, ExternalIcon, CheckIcon } from "../icons";
import { BATCH_SIZE, VALID_WINDOW_SIZES, usePeriodNavigation, PeriodToolbar } from "../shared";

// ============ TYPES ============

interface RefundRow {
  refundId: string;
  loaded: boolean;
  details?: billingService.Credit;
}

// ============ COMPOSANT ============

/** Affiche l'historique des avoirs avec filtrage par période, chargement streaming, et export CSV/PDF. */
export function RefundsTab({ credentials }: TabProps) {
  const { t, i18n } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');

  const MONTHS_FULL = t('invoices.months.full', { returnObjects: true }) as string[];

  // ---------- PERIOD NAVIGATION ----------
  const nav = usePeriodNavigation();

  // ---------- STATE ----------
  const [refundIds, setRefundIds] = useState<string[]>([]);
  const [refunds, setRefunds] = useState<Map<string, RefundRow>>(new Map());
  const [loadingIds, setLoadingIds] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef(false);

  // ---------- BATCH LOADING ----------
  const loadBatch = useCallback(async (ids: string[]): Promise<number> => {
    if (abortRef.current) return 0;

    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const details = await billingService.getRefund(id);
          return { id, details, success: true };
        } catch {
          return { id, details: null, success: false };
        }
      })
    );

    if (abortRef.current) return 0;

    setRefunds((prev) => {
      const next = new Map(prev);
      for (const r of results) {
        if (r.success && r.details) {
          next.set(r.id, { refundId: r.id, loaded: true, details: r.details });
        } else {
          next.set(r.id, { refundId: r.id, loaded: true });
        }
      }
      return next;
    });

    return results.length;
  }, []);

  const loadAllDetails = useCallback(async (ids: string[]) => {
    let count = 0;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      if (abortRef.current) break;
      const batch = ids.slice(i, i + BATCH_SIZE);
      const loaded = await loadBatch(batch);
      count += loaded;
      setLoadedCount(count);
    }
  }, [loadBatch]);

  // ---------- MAIN LOADER ----------
  const loadRefunds = useCallback(async () => {
    abortRef.current = true;
    await new Promise(r => setTimeout(r, 50));
    abortRef.current = false;

    setLoadingIds(true);
    setError(null);
    setLoadedCount(0);
    setRefunds(new Map());
    setRefundIds([]);

    try {
      const { from, to } = nav.getDateRangeISO();
      const ids = await billingService.getRefundIds({ "date.from": from, "date.to": to });

      if (ids.length === 0 && nav.isAutoFallback && nav.fallbackIndex < VALID_WINDOW_SIZES.length - 1) {
        setLoadingIds(false);
        nav.applyFallback();
        return;
      }

      if (nav.isAutoFallback) {
        nav.setAnchor();
      }

      const sortedIds = [...ids].sort((a, b) => b.localeCompare(a));
      setRefundIds(sortedIds);

      const initial = new Map<string, RefundRow>();
      for (const id of sortedIds) {
        initial.set(id, { refundId: id, loaded: false });
      }
      setRefunds(initial);
      setLoadingIds(false);

      if (sortedIds.length > 0) {
        loadAllDetails(sortedIds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
      setLoadingIds(false);
    }
  }, [nav, loadAllDetails, t]);

  useEffect(() => {
    loadRefunds();
  }, [nav.year, nav.startMonth, nav.endMonth, nav.fallbackIndex]);

  // ---------- COMPUTED ----------
  const loadedData = Array.from(refunds.values()).filter(r => r.loaded && r.details).map(r => r.details!);
  const totalHT = loadedData.reduce((s, r) => s + r.amount.value, 0);
  const currency = loadedData[0]?.amount.currencyCode || "EUR";
  const allLoaded = loadedCount >= refundIds.length && refundIds.length > 0;

  // ---------- EXPORT CSV ----------
  const exportCSV = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (data.length === 0) return;

    const headers = [t('columns.reference'), t('columns.date'), t('columns.amount'), t('invoices.currency'), t('refunds.originalBill')];
    const rows = data.map(r => [r.refundId, formatDateISO(r.date), r.amount.value.toFixed(2), r.amount.currencyCode, r.originalBillId || "-"]);

    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OVHcloud-${t('refunds.exportFilename')}_${nav.year}-${String(nav.startMonth + 1).padStart(2, "0")}_${nav.year}-${String(nav.endMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- EXPORT PDF ----------
  const exportPDF = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (data.length === 0) return;

    const periodLabel = `${MONTHS_FULL[nav.startMonth]} ${nav.year} - ${MONTHS_FULL[nav.endMonth]} ${nav.year}`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-${t('refunds.pdfTitle')} - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.amount-positive{color:#2e7d32}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>${t('refunds.pdfTitle')}</h1><p class="period">${periodLabel} — ${data.length} ${t('refunds.refundUnit')}</p><table><thead><tr><th>${t('columns.reference')}</th><th>${t('columns.date')}</th><th>${t('refunds.originalBill')}</th><th class="amount">${t('columns.amount')}</th></tr></thead><tbody>${data.map(r => `<tr><td>${r.refundId}</td><td>${formatDate(r.date)}</td><td>${r.originalBillId || "-"}</td><td class="amount amount-positive">${formatAmount(r.amount.value, r.amount.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="3">${t('invoices.total')}</td><td class="amount amount-positive">${formatAmount(totalHT, currency)}</td></tr></tbody></table><p class="footer">${t('invoices.generatedOn')} ${new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} ${t('invoices.fromManager')}</p></body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  };

  // ---------- RENDER HELPERS ----------
  const Skeleton = () => <span className="skeleton-text"></span>;

  const sortedRows = refundIds.map((id) => refunds.get(id)!).filter(Boolean);
  const loadedRows = sortedRows.filter((r) => r.loaded && r.details);
  loadedRows.sort((a, b) => new Date(b.details!.date).getTime() - new Date(a.details!.date).getTime());
  const unloadedRows = sortedRows.filter((r) => !r.loaded || !r.details);
  const finalRows = [...loadedRows, ...unloadedRows];

  // ---------- RENDER ----------
  return (
    <div className="tab-panel">
      <PeriodToolbar
        year={nav.year}
        startMonth={nav.startMonth}
        endMonth={nav.endMonth}
        canGoPrevious={nav.canGoPrevious}
        canGoNext={nav.canGoNext}
        showReset={nav.showReset}
        goToPrevious={nav.goToPrevious}
        goToNext={nav.goToNext}
        resetToAnchor={nav.resetToAnchor}
        handleStartMonthChange={nav.handleStartMonthChange}
        handleEndMonthChange={nav.handleEndMonthChange}
        loadingIds={loadingIds}
        loadedCount={loadedCount}
        totalCount={refundIds.length}
        allLoaded={allLoaded}
        onExportCSV={exportCSV}
        onExportPDF={exportPDF}
        countLabelKey="refunds.countProgress"
      />

      {allLoaded && refundIds.length > 0 && (
        <div className="totals-bar">
          <span className="total-label">{t('refunds.totalAmount')}: <strong className="amount-positive">{formatAmount(totalHT, currency)}</strong></span>
        </div>
      )}

      {loadingIds ? (
        <div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : refundIds.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>{t('refunds.empty.title')}</h3><p>{t('refunds.empty.description')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('columns.reference')}</th>
                <th>{t('columns.date')}</th>
                <th>{t('refunds.originalBill')}</th>
                <th>{t('columns.amount')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {finalRows.map((row) => (
                <tr key={row.refundId} className={row.loaded ? "" : "loading-row"}>
                  <td className="ref-cell"><span className="ref-badge">{row.refundId}</span></td>
                  <td>{row.loaded && row.details ? formatDate(row.details.date) : <Skeleton />}</td>
                  <td>{row.loaded && row.details ? (row.details.originalBillId || "-") : <Skeleton />}</td>
                  <td className="amount-cell amount-positive">{row.loaded && row.details ? formatAmount(row.details.amount.value, row.details.amount.currencyCode) : <Skeleton />}</td>
                  <td className="actions-cell">
                    {row.loaded && row.details ? (
                      <>
                        {row.details.pdfUrl && <a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>}
                        {row.details.url && <a href={row.details.url} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a>}
                      </>
                    ) : <Skeleton />}
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
