// ============================================================
// INVOICES TAB - Factures (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as invoicesService from "./InvoicesTab.service";
import type { TabProps } from "../../billing.types";
import { DownloadIcon, ExternalIcon, CheckIcon } from "./InvoicesTab.icons";
import { BATCH_SIZE, VALID_WINDOW_SIZES, usePeriodNavigation, PeriodToolbar, formatDate, formatAmount, formatDateISO } from "./InvoicesTab.service";
import "./InvoicesTab.css";

interface BillRow { billId: string; loaded: boolean; details?: invoicesService.Bill; }

export function InvoicesTab({ credentials }: TabProps) {
  const { t, i18n } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const MONTHS_FULL = t('invoices.months.full', { returnObjects: true }) as string[];
  const nav = usePeriodNavigation();

  const [billIds, setBillIds] = useState<string[]>([]);
  const [bills, setBills] = useState<Map<string, BillRow>>(new Map());
  const [loadingIds, setLoadingIds] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const loadBatch = useCallback(async (ids: string[]): Promise<number> => {
    if (abortRef.current) return 0;
    const results = await Promise.all(ids.map(async (id) => { try { const details = await invoicesService.getBill(id); return { id, details, success: true }; } catch { return { id, details: null, success: false }; } }));
    if (abortRef.current) return 0;
    setBills((prev) => { const next = new Map(prev); for (const r of results) { if (r.success && r.details) next.set(r.id, { billId: r.id, loaded: true, details: r.details }); else next.set(r.id, { billId: r.id, loaded: true }); } return next; });
    return results.length;
  }, []);

  const loadAllDetails = useCallback(async (ids: string[]) => {
    let count = 0;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) { if (abortRef.current) break; const batch = ids.slice(i, i + BATCH_SIZE); const loaded = await loadBatch(batch); count += loaded; setLoadedCount(count); }
  }, [loadBatch]);

  const loadBills = useCallback(async () => {
    abortRef.current = true; await new Promise(r => setTimeout(r, 50)); abortRef.current = false;
    setLoadingIds(true); setError(null); setLoadedCount(0); setBills(new Map()); setBillIds([]);
    try {
      const { from, to } = nav.getDateRangeISO();
      const ids = await invoicesService.getBillIds({ "date.from": from, "date.to": to });
      if (ids.length === 0 && nav.isAutoFallback && nav.fallbackIndex < VALID_WINDOW_SIZES.length - 1) { setLoadingIds(false); nav.applyFallback(); return; }
      if (nav.isAutoFallback) nav.setAnchor();
      const sortedIds = [...ids].sort((a, b) => b.localeCompare(a)); setBillIds(sortedIds);
      const initial = new Map<string, BillRow>(); for (const id of sortedIds) initial.set(id, { billId: id, loaded: false }); setBills(initial); setLoadingIds(false);
      if (sortedIds.length > 0) loadAllDetails(sortedIds);
    } catch (err) { setError(err instanceof Error ? err.message : t('errors.loadError')); setLoadingIds(false); }
  }, [nav, loadAllDetails, t]);

  useEffect(() => { loadBills(); }, [nav.year, nav.startMonth, nav.endMonth, nav.fallbackIndex]);

  const loadedData = Array.from(bills.values()).filter(r => r.loaded && r.details).map(r => r.details!);
  const totalHT = loadedData.reduce((s, b) => s + b.priceWithoutTax.value, 0);
  const totalTVA = loadedData.reduce((s, b) => s + b.tax.value, 0);
  const totalTTC = loadedData.reduce((s, b) => s + b.priceWithTax.value, 0);
  const currency = loadedData[0]?.priceWithTax.currencyCode || "EUR";
  const allLoaded = loadedCount >= billIds.length && billIds.length > 0;

  const exportCSV = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (data.length === 0) return;
    const headers = [t('columns.reference'), t('columns.date'), t('columns.amountHT'), t('invoices.vat'), t('columns.amountTTC'), t('invoices.currency')];
    const rows = data.map(b => [b.billId, formatDateISO(b.date), b.priceWithoutTax.value.toFixed(2), b.tax.value.toFixed(2), b.priceWithTax.value.toFixed(2), b.priceWithTax.currencyCode]);
    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `OVHcloud-${t('invoices.exportFilename')}_${nav.year}-${String(nav.startMonth + 1).padStart(2, "0")}_${nav.year}-${String(nav.endMonth + 1).padStart(2, "0")}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (data.length === 0) return;
    const periodLabel = `${MONTHS_FULL[nav.startMonth]} ${nav.year} - ${MONTHS_FULL[nav.endMonth]} ${nav.year}`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-${t('invoices.pdfTitle')} - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>${t('invoices.pdfTitle')}</h1><p class="period">${periodLabel} — ${data.length} ${t('invoices.invoiceUnit')}</p><table><thead><tr><th>${t('columns.reference')}</th><th>${t('columns.date')}</th><th class="amount">${t('invoices.ht')}</th><th class="amount">${t('invoices.vat')}</th><th class="amount">${t('invoices.ttc')}</th></tr></thead><tbody>${data.map(b => `<tr><td>${b.billId}</td><td>${formatDate(b.date)}</td><td class="amount">${formatAmount(b.priceWithoutTax.value, b.priceWithoutTax.currencyCode)}</td><td class="amount">${formatAmount(b.tax.value, b.tax.currencyCode)}</td><td class="amount">${formatAmount(b.priceWithTax.value, b.priceWithTax.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="2">${t('invoices.total')}</td><td class="amount">${formatAmount(totalHT, currency)}</td><td class="amount">${formatAmount(totalTVA, currency)}</td><td class="amount">${formatAmount(totalTTC, currency)}</td></tr></tbody></table><p class="footer">${t('invoices.generatedOn')} ${new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} ${t('invoices.fromManager')}</p></body></html>`;
    const printWindow = window.open("", "_blank"); if (printWindow) { printWindow.document.write(html); printWindow.document.close(); printWindow.onload = () => printWindow.print(); }
  };

  const Skeleton = () => <span className="invoices-skeleton-text"></span>;
  const sortedRows = billIds.map((id) => bills.get(id)!).filter(Boolean);
  const loadedRows = sortedRows.filter((r) => r.loaded && r.details); loadedRows.sort((a, b) => new Date(b.details!.date).getTime() - new Date(a.details!.date).getTime());
  const unloadedRows = sortedRows.filter((r) => !r.loaded || !r.details);
  const finalRows = [...loadedRows, ...unloadedRows];

  return (
    <div className="invoices-tab-panel">
      <PeriodToolbar year={nav.year} startMonth={nav.startMonth} endMonth={nav.endMonth} canGoPrevious={nav.canGoPrevious} canGoNext={nav.canGoNext} showReset={nav.showReset} goToPrevious={nav.goToPrevious} goToNext={nav.goToNext} resetToAnchor={nav.resetToAnchor} handleStartMonthChange={nav.handleStartMonthChange} handleEndMonthChange={nav.handleEndMonthChange} loadingIds={loadingIds} loadedCount={loadedCount} totalCount={billIds.length} allLoaded={allLoaded} onExportCSV={exportCSV} onExportPDF={exportPDF} countLabelKey="invoices.countProgress" />
      {allLoaded && billIds.length > 0 && (<div className="invoices-totals-bar"><span className="invoices-total-label">{t('invoices.totalHT')}: <strong>{formatAmount(totalHT, currency)}</strong></span><span className="invoices-total-label">{t('invoices.vat')}: <strong>{formatAmount(totalTVA, currency)}</strong></span><span className="invoices-total-label">{t('invoices.totalTTC')}: <strong>{formatAmount(totalTTC, currency)}</strong></span></div>)}
      {loadingIds ? (<div className="invoices-loading-state"><div className="invoices-spinner"></div><p>{tCommon('loading')}</p></div>) : error ? (<div className="invoices-error-banner">{error}</div>) : billIds.length === 0 ? (<div className="invoices-empty-state"><CheckIcon /><h3>{t('invoices.empty.title')}</h3><p>{t('invoices.empty.description')}</p></div>) : (
        <div className="invoices-table-container"><table className="invoices-data-table"><thead><tr><th>{t('columns.reference')}</th><th>{t('columns.date')}</th><th>{t('columns.amountHT')}</th><th>{t('invoices.vat')}</th><th>{t('columns.amountTTC')}</th><th>{t('columns.actions')}</th></tr></thead><tbody>
          {finalRows.map((row) => (<tr key={row.billId} className={row.loaded ? "" : "invoices-loading-row"}><td className="invoices-ref-cell"><span className="invoices-ref-badge">{row.billId}</span></td><td>{row.loaded && row.details ? formatDate(row.details.date) : <Skeleton />}</td><td className="invoices-amount-cell">{row.loaded && row.details ? formatAmount(row.details.priceWithoutTax.value, row.details.priceWithoutTax.currencyCode) : <Skeleton />}</td><td className="invoices-amount-cell">{row.loaded && row.details ? formatAmount(row.details.tax.value, row.details.tax.currencyCode) : <Skeleton />}</td><td className="invoices-amount-cell">{row.loaded && row.details ? formatAmount(row.details.priceWithTax.value, row.details.priceWithTax.currencyCode) : <Skeleton />}</td><td className="invoices-actions-cell">{row.loaded && row.details ? (<><a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="invoices-action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a><a href={row.details.url} target="_blank" rel="noopener noreferrer" className="invoices-action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a></>) : <Skeleton />}</td></tr>))}
        </tbody></table></div>
      )}
    </div>
  );
}
