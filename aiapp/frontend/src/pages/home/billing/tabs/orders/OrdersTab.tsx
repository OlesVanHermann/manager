// ============================================================
// ORDERS TAB - Commandes (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as ordersTabService from "./OrdersTab.service";
import type { TabProps } from "../../../billing.types";
import { DownloadIcon, ExternalIcon, CartIcon } from "../../icons";
import { BATCH_SIZE, VALID_WINDOW_SIZES, usePeriodNavigation, PeriodToolbar, formatDate, formatAmount, formatDateISO } from "./OrdersTab.service";
import "./OrdersTab.css";

interface OrderRow { orderId: number; loaded: boolean; details?: ordersTabService.OrderWithStatus; }

export function OrdersTab({ credentials }: TabProps) {
  const { t, i18n } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const MONTHS_FULL = t('invoices.months.full', { returnObjects: true }) as string[];
  const nav = usePeriodNavigation();

  const [orderIds, setOrderIds] = useState<number[]>([]);
  const [orders, setOrders] = useState<Map<number, OrderRow>>(new Map());
  const [loadingIds, setLoadingIds] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <span className="orders-status-badge orders-badge-success">{t('orders.status.delivered')}</span>;
      case "delivering": return <span className="orders-status-badge orders-badge-info">{t('orders.status.delivering')}</span>;
      case "checking": return <span className="orders-status-badge orders-badge-warning">{t('orders.status.checking')}</span>;
      case "notpaid": return <span className="orders-status-badge orders-badge-warning">{t('orders.status.notPaid')}</span>;
      case "cancelled": return <span className="orders-status-badge orders-badge-error">{t('orders.status.cancelled')}</span>;
      default: return <span className="orders-status-badge">{status || "-"}</span>;
    }
  };

  const loadBatch = useCallback(async (ids: number[]): Promise<number> => {
    if (abortRef.current) return 0;
    const results = await Promise.all(ids.map(async (id) => {
      try {
        const [order, status] = await Promise.all([
          ordersTabService.getOrder(credentials, id),
          ordersTabService.getOrderStatus(credentials, id).catch(() => ({ status: "unknown" as const })),
        ]);
        const details: ordersTabService.OrderWithStatus = { ...order, status: status.status };
        return { id, details, success: true };
      } catch { return { id, details: null, success: false }; }
    }));
    if (abortRef.current) return 0;
    setOrders((prev) => { const next = new Map(prev); for (const r of results) { if (r.success && r.details) next.set(r.id, { orderId: r.id, loaded: true, details: r.details }); else next.set(r.id, { orderId: r.id, loaded: true }); } return next; });
    return results.length;
  }, [credentials]);

  const loadAllDetails = useCallback(async (ids: number[]) => {
    let count = 0;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) { if (abortRef.current) break; const batch = ids.slice(i, i + BATCH_SIZE); const loaded = await loadBatch(batch); count += loaded; setLoadedCount(count); }
  }, [loadBatch]);

  const loadOrders = useCallback(async () => {
    abortRef.current = true; await new Promise(r => setTimeout(r, 50)); abortRef.current = false;
    setLoadingIds(true); setError(null); setLoadedCount(0); setOrders(new Map()); setOrderIds([]);
    try {
      const { from, to } = nav.getDateRangeISO();
      const ids = await ordersTabService.getOrderIds(credentials, { "date.from": from, "date.to": to });
      if (ids.length === 0 && nav.isAutoFallback && nav.fallbackIndex < VALID_WINDOW_SIZES.length - 1) { setLoadingIds(false); nav.applyFallback(); return; }
      if (nav.isAutoFallback) nav.setAnchor();
      const sortedIds = [...ids].sort((a, b) => b - a); setOrderIds(sortedIds);
      const initial = new Map<number, OrderRow>(); for (const id of sortedIds) initial.set(id, { orderId: id, loaded: false }); setOrders(initial); setLoadingIds(false);
      if (sortedIds.length > 0) loadAllDetails(sortedIds);
    } catch (err) { setError(err instanceof Error ? err.message : t('errors.loadError')); setLoadingIds(false); }
  }, [nav, credentials, loadAllDetails, t]);

  useEffect(() => { loadOrders(); }, [nav.year, nav.startMonth, nav.endMonth, nav.fallbackIndex]);

  const loadedData = Array.from(orders.values()).filter(r => r.loaded && r.details).map(r => r.details!);
  const totalHT = loadedData.reduce((s, o) => s + (o.priceWithoutTax?.value || 0), 0);
  const totalTTC = loadedData.reduce((s, o) => s + (o.priceWithTax?.value || 0), 0);
  const currency = loadedData[0]?.priceWithTax?.currencyCode || "EUR";
  const allLoaded = loadedCount >= orderIds.length && orderIds.length > 0;

  const exportCSV = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (data.length === 0) return;
    const headers = [t('columns.orderId'), t('columns.date'), t('columns.amountHT'), t('columns.amountTTC'), t('invoices.currency'), t('columns.status')];
    const rows = data.map(o => [o.orderId.toString(), formatDateISO(o.date), (o.priceWithoutTax?.value || 0).toFixed(2), (o.priceWithTax?.value || 0).toFixed(2), o.priceWithTax?.currencyCode || "EUR", o.status]);
    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `OVHcloud-${t('orders.exportFilename')}_${nav.year}-${String(nav.startMonth + 1).padStart(2, "0")}_${nav.year}-${String(nav.endMonth + 1).padStart(2, "0")}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); if (data.length === 0) return;
    const periodLabel = `${MONTHS_FULL[nav.startMonth]} ${nav.year} - ${MONTHS_FULL[nav.endMonth]} ${nav.year}`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-${t('orders.pdfTitle')} - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}.badge{padding:2px 8px;border-radius:4px;font-size:12px}.badge-success{background:#e8f5e9;color:#2e7d32}.badge-warning{background:#fff3e0;color:#e65100}.badge-error{background:#ffebee;color:#c62828}.badge-info{background:#e3f2fd;color:#1565c0}@media print{body{margin:20px}}</style></head><body><h1>${t('orders.pdfTitle')}</h1><p class="period">${periodLabel} — ${data.length} ${t('orders.orderUnit')}</p><table><thead><tr><th>${t('columns.orderId')}</th><th>${t('columns.date')}</th><th class="amount">${t('columns.amountHT')}</th><th class="amount">${t('columns.amountTTC')}</th><th>${t('columns.status')}</th></tr></thead><tbody>${data.map(o => `<tr><td>${o.orderId}</td><td>${formatDate(o.date)}</td><td class="amount">${formatAmount(o.priceWithoutTax?.value || 0, o.priceWithoutTax?.currencyCode || "EUR")}</td><td class="amount">${formatAmount(o.priceWithTax?.value || 0, o.priceWithTax?.currencyCode || "EUR")}</td><td>${o.status}</td></tr>`).join("")}<tr class="total-row"><td colspan="2">${t('invoices.total')}</td><td class="amount">${formatAmount(totalHT, currency)}</td><td class="amount">${formatAmount(totalTTC, currency)}</td><td></td></tr></tbody></table><p class="footer">${t('invoices.generatedOn')} ${new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} ${t('invoices.fromManager')}</p></body></html>`;
    const printWindow = window.open("", "_blank"); if (printWindow) { printWindow.document.write(html); printWindow.document.close(); printWindow.onload = () => printWindow.print(); }
  };

  const Skeleton = () => <span className="orders-skeleton-text"></span>;
  const sortedRows = orderIds.map((id) => orders.get(id)!).filter(Boolean);
  const loadedRows = sortedRows.filter((r) => r.loaded && r.details); loadedRows.sort((a, b) => new Date(b.details!.date).getTime() - new Date(a.details!.date).getTime());
  const unloadedRows = sortedRows.filter((r) => !r.loaded || !r.details);
  const finalRows = [...loadedRows, ...unloadedRows];

  return (
    <div className="orders-tab-panel">
      <PeriodToolbar year={nav.year} startMonth={nav.startMonth} endMonth={nav.endMonth} canGoPrevious={nav.canGoPrevious} canGoNext={nav.canGoNext} showReset={nav.showReset} goToPrevious={nav.goToPrevious} goToNext={nav.goToNext} resetToAnchor={nav.resetToAnchor} handleStartMonthChange={nav.handleStartMonthChange} handleEndMonthChange={nav.handleEndMonthChange} loadingIds={loadingIds} loadedCount={loadedCount} totalCount={orderIds.length} allLoaded={allLoaded} onExportCSV={exportCSV} onExportPDF={exportPDF} countLabelKey="orders.countProgress" />
      {allLoaded && orderIds.length > 0 && (<div className="orders-totals-bar"><span className="orders-total-label">{t('invoices.totalHT')}: <strong>{formatAmount(totalHT, currency)}</strong></span><span className="orders-total-label">{t('invoices.totalTTC')}: <strong>{formatAmount(totalTTC, currency)}</strong></span></div>)}
      {loadingIds ? (<div className="orders-loading-state"><div className="orders-spinner"></div><p>{tCommon('loading')}</p></div>) : error ? (<div className="orders-error-banner">{error}</div>) : orderIds.length === 0 ? (<div className="orders-empty-state"><CartIcon /><h3>{t('orders.empty.title')}</h3><p>{t('orders.empty.description')}</p></div>) : (
        <div className="orders-table-container"><table className="orders-data-table"><thead><tr><th>{t('columns.orderId')}</th><th>{t('columns.date')}</th><th>{t('columns.amountHT')}</th><th>{t('columns.amountTTC')}</th><th>{t('columns.status')}</th><th>{t('columns.actions')}</th></tr></thead><tbody>
          {finalRows.map((row) => (<tr key={row.orderId} className={row.loaded ? "" : "orders-loading-row"}><td className="orders-ref-cell"><span className="orders-ref-badge">{row.orderId}</span></td><td>{row.loaded && row.details ? formatDate(row.details.date) : <Skeleton />}</td><td className="orders-amount-cell">{row.loaded && row.details ? formatAmount(row.details.priceWithoutTax?.value || 0, row.details.priceWithoutTax?.currencyCode || "EUR") : <Skeleton />}</td><td className="orders-amount-cell">{row.loaded && row.details ? formatAmount(row.details.priceWithTax?.value || 0, row.details.priceWithTax?.currencyCode || "EUR") : <Skeleton />}</td><td>{row.loaded && row.details ? getStatusBadge(row.details.status) : <Skeleton />}</td><td className="orders-actions-cell">{row.loaded && row.details ? (<>{row.details.pdfUrl && <a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="orders-action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>}{row.details.url && <a href={row.details.url} target="_blank" rel="noopener noreferrer" className="orders-action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a>}</>) : <Skeleton />}</td></tr>))}
        </tbody></table></div>
      )}
    </div>
  );
}
