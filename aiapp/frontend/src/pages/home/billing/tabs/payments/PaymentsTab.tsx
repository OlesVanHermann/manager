// ============================================================
// PAYMENTS TAB - Paiements (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as paymentsService from "./PaymentsTab.service";
import type { TabProps } from "../../billing.types";
import { DownloadIcon, ExternalIcon, CheckIcon } from "./PaymentsTab.icons";
import { BATCH_SIZE, VALID_WINDOW_SIZES, usePeriodNavigation, PeriodToolbar, formatDate, formatAmount, formatDateISO } from "./PaymentsTab.service";
import "./PaymentsTab.css";

interface DepositRow { depositId: string; loaded: boolean; details?: paymentsService.Deposit; }

export function PaymentsTab({ credentials }: TabProps) {
  const { t, i18n } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const MONTHS_FULL = t('invoices.months.full', { returnObjects: true }) as string[];
  const nav = usePeriodNavigation();

  const PAYMENT_LABELS: Record<string, string> = {
    creditCard: t('payments.methods.creditCard'), withdrawal: t('payments.methods.withdrawal'),
    bankAccount: t('payments.methods.bankAccount'), paypal: t('payments.methods.paypal'),
    fidelityAccount: t('payments.methods.fidelityAccount'), ovhAccount: t('payments.methods.ovhAccount'),
    voucher: t('payments.methods.voucher'),
  };
  const formatPayment = (info: paymentsService.PaymentInfo | undefined): string => {
    if (!info) return "-";
    const label = PAYMENT_LABELS[info.paymentType] || info.paymentType;
    if (info.publicLabel) return `${label} (${info.publicLabel})`;
    return label;
  };

  const [depositIds, setDepositIds] = useState<string[]>([]);
  const [deposits, setDeposits] = useState<Map<string, DepositRow>>(new Map());
  const [loadingIds, setLoadingIds] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const loadBatch = useCallback(async (ids: string[]): Promise<number> => {
    if (abortRef.current) return 0;
    const results = await Promise.all(ids.map(async (id) => { try { const details = await paymentsService.getDeposit(id); return { id, details, success: true }; } catch { return { id, details: null, success: false }; } }));
    if (abortRef.current) return 0;
    setDeposits((prev) => { const next = new Map(prev); for (const r of results) { if (r.success && r.details) next.set(r.id, { depositId: r.id, loaded: true, details: r.details }); else next.set(r.id, { depositId: r.id, loaded: true }); } return next; });
    return results.length;
  }, []);

  const loadAllDetails = useCallback(async (ids: string[]) => {
    let count = 0;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) { if (abortRef.current) break; const batch = ids.slice(i, i + BATCH_SIZE); const loaded = await loadBatch(batch); count += loaded; setLoadedCount(count); }
  }, [loadBatch]);

  const loadDeposits = useCallback(async () => {
    abortRef.current = true; await new Promise(r => setTimeout(r, 50)); abortRef.current = false;
    setLoadingIds(true); setError(null); setLoadedCount(0); setDeposits(new Map()); setDepositIds([]);
    try {
      const { from, to } = nav.getDateRangeISO();
      const ids = await paymentsService.getDepositIds({ "date.from": from, "date.to": to });
      if (ids.length === 0 && nav.isAutoFallback && nav.fallbackIndex < VALID_WINDOW_SIZES.length - 1) { setLoadingIds(false); nav.applyFallback(); return; }
      if (nav.isAutoFallback) nav.setAnchor();
      const sortedIds = [...ids].sort((a, b) => b.localeCompare(a)); setDepositIds(sortedIds);
      const initial = new Map<string, DepositRow>(); for (const id of sortedIds) initial.set(id, { depositId: id, loaded: false }); setDeposits(initial); setLoadingIds(false);
      if (sortedIds.length > 0) loadAllDetails(sortedIds);
    } catch (err) { setError(err instanceof Error ? err.message : t('errors.loadError')); setLoadingIds(false); }
  }, [nav, loadAllDetails, t]);

  useEffect(() => { loadDeposits(); }, [nav.year, nav.startMonth, nav.endMonth, nav.fallbackIndex]);

  const loadedData = Array.from(deposits.values()).filter(r => r.loaded && r.details).map(r => r.details!);
  const allLoaded = loadedCount >= depositIds.length && depositIds.length > 0;

  const exportCSV = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (data.length === 0) return;
    const headers = [t('columns.reference'), t('columns.date'), t('columns.amount'), t('invoices.currency'), t('payments.method')];
    const rows = data.map(d => [d.depositId, formatDateISO(d.date), d.amount.value.toFixed(2), d.amount.currencyCode, formatPayment(d.paymentInfo)]);
    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `OVHcloud-${t('payments.exportFilename')}_${nav.year}-${String(nav.startMonth + 1).padStart(2, "0")}_${nav.year}-${String(nav.endMonth + 1).padStart(2, "0")}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (data.length === 0) return;
    const total = data.reduce((s, d) => s + d.amount.value, 0);
    const currency = data[0]?.amount.currencyCode || "EUR";
    const periodLabel = `${MONTHS_FULL[nav.startMonth]} ${nav.year} - ${MONTHS_FULL[nav.endMonth]} ${nav.year}`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-${t('payments.pdfTitle')} - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>${t('payments.pdfTitle')}</h1><p class="period">${periodLabel} — ${data.length} ${t('payments.paymentUnit')}</p><table><thead><tr><th>${t('columns.reference')}</th><th>${t('columns.date')}</th><th>${t('payments.method')}</th><th class="amount">${t('columns.amount')}</th></tr></thead><tbody>${data.map(d => `<tr><td>${d.depositId}</td><td>${formatDate(d.date)}</td><td>${formatPayment(d.paymentInfo)}</td><td class="amount">${formatAmount(d.amount.value, d.amount.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="3">${t('invoices.total')}</td><td class="amount">${formatAmount(total, currency)}</td></tr></tbody></table><p class="footer">${t('invoices.generatedOn')} ${new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} ${t('invoices.fromManager')}</p></body></html>`;
    const printWindow = window.open("", "_blank"); if (printWindow) { printWindow.document.write(html); printWindow.document.close(); printWindow.onload = () => printWindow.print(); }
  };

  const Skeleton = () => <span className="payments-skeleton-text"></span>;
  const sortedRows = depositIds.map((id) => deposits.get(id)!).filter(Boolean);
  const loadedRows = sortedRows.filter((r) => r.loaded && r.details); loadedRows.sort((a, b) => new Date(b.details!.date).getTime() - new Date(a.details!.date).getTime());
  const unloadedRows = sortedRows.filter((r) => !r.loaded || !r.details);
  const finalRows = [...loadedRows, ...unloadedRows];

  return (
    <div className="payments-tab-panel">
      <PeriodToolbar year={nav.year} startMonth={nav.startMonth} endMonth={nav.endMonth} canGoPrevious={nav.canGoPrevious} canGoNext={nav.canGoNext} showReset={nav.showReset} goToPrevious={nav.goToPrevious} goToNext={nav.goToNext} resetToAnchor={nav.resetToAnchor} handleStartMonthChange={nav.handleStartMonthChange} handleEndMonthChange={nav.handleEndMonthChange} loadingIds={loadingIds} loadedCount={loadedCount} totalCount={depositIds.length} allLoaded={allLoaded} onExportCSV={exportCSV} onExportPDF={exportPDF} countLabelKey="payments.countProgress" />
      {loadingIds ? (<div className="payments-loading-state"><div className="payments-spinner"></div><p>{tCommon('loading')}</p></div>) : error ? (<div className="payments-error-banner">{error}</div>) : depositIds.length === 0 ? (<div className="payments-empty-state"><CheckIcon /><h3>{t('payments.empty.title')}</h3><p>{t('payments.empty.description')}</p></div>) : (
        <div className="payments-table-container"><table className="payments-data-table"><thead><tr><th>{t('columns.reference')}</th><th>{t('columns.date')}</th><th>{t('columns.amount')}</th><th>{t('payments.method')}</th><th>{t('columns.actions')}</th></tr></thead><tbody>
          {finalRows.map((row) => (<tr key={row.depositId} className={row.loaded ? "" : "payments-loading-row"}><td className="payments-ref-cell"><span className="payments-ref-badge">{row.depositId}</span></td><td>{row.loaded && row.details ? formatDate(row.details.date) : <Skeleton />}</td><td className="payments-amount-cell">{row.loaded && row.details ? formatAmount(row.details.amount.value, row.details.amount.currencyCode) : <Skeleton />}</td><td>{row.loaded && row.details ? formatPayment(row.details.paymentInfo) : <Skeleton />}</td><td className="payments-actions-cell">{row.loaded && row.details ? (<>{row.details.pdfUrl && <a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="payments-action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>}{row.details.url && <a href={row.details.url} target="_blank" rel="noopener noreferrer" className="payments-action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a>}</>) : <Skeleton />}</td></tr>))}
        </tbody></table></div>
      )}
    </div>
  );
}
