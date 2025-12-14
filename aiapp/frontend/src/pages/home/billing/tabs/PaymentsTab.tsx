// ============================================================
// PAYMENTS TAB - Paiements avec chargement streaming + fallback
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, formatAmount, formatDateISO } from "../utils";
import { DownloadIcon, ExternalIcon, CheckIcon, FileTextIcon, FileIcon } from "../icons";

// ============ CONSTANTES ============

const MIN_YEAR = 2020;
const BATCH_SIZE = 10;
const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

// ============ TYPES ============

interface DepositRow {
  depositId: string;
  loaded: boolean;
  details?: billingService.Deposit;
}

// ============ HELPERS BLOCS ALIGNÉS ============

function getWindowSizeFromRange(monthCount: number): number {
  for (let i = VALID_WINDOW_SIZES.length - 1; i >= 0; i--) {
    if (VALID_WINDOW_SIZES[i] <= monthCount) {
      return VALID_WINDOW_SIZES[i];
    }
  }
  return 1;
}

function getBlocks(windowSize: number): [number, number][] {
  const blocks: [number, number][] = [];
  for (let i = 0; i < 12; i += windowSize) {
    blocks.push([i, Math.min(i + windowSize - 1, 11)]);
  }
  return blocks;
}

function getLastCompleteBlock(month: number, windowSize: number): [number, number] | null {
  const blocks = getBlocks(windowSize);
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i][1] <= month) {
      return blocks[i];
    }
  }
  return null;
}

function calculateAnchor(
  currentMonth: number, 
  windowSize: number
): { startMonth: number; endMonth: number } {
  const blocks = getBlocks(windowSize);
  const currentBlockIndex = blocks.findIndex(([s, e]) => s <= currentMonth && currentMonth <= e);
  const currentBlock = blocks[currentBlockIndex];
  
  if (currentBlock[1] <= currentMonth) {
    return { startMonth: currentBlock[0], endMonth: currentBlock[1] };
  }
  
  if (currentBlockIndex > 0) {
    const prevBlock = blocks[currentBlockIndex - 1];
    return { startMonth: prevBlock[0], endMonth: currentMonth };
  }
  
  return { startMonth: 0, endMonth: currentMonth };
}

// ============ COMPOSANT ============

export function PaymentsTab({ credentials }: TabProps) {
  const { t, i18n } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  
  const MONTHS_SHORT = t('invoices.months.short', { returnObjects: true }) as string[];
  const MONTHS_FULL = t('invoices.months.full', { returnObjects: true }) as string[];
  
  const PAYMENT_LABELS: Record<string, string> = {
    creditCard: t('payments.methods.creditCard'),
    withdrawal: t('payments.methods.withdrawal'),
    bankAccount: t('payments.methods.bankAccount'),
    paypal: t('payments.methods.paypal'),
    fidelityAccount: t('payments.methods.fidelityAccount'),
    ovhAccount: t('payments.methods.ovhAccount'),
    voucher: t('payments.methods.voucher'),
  };

  const formatPayment = (info: billingService.PaymentInfo | undefined): string => {
    if (!info) return "-";
    const label = PAYMENT_LABELS[info.paymentType] || info.paymentType;
    if (info.publicLabel) return `${label} (${info.publicLabel})`;
    return label;
  };
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // ============ STATE ============
  
  const [year, setYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [endMonth, setEndMonth] = useState(currentMonth);
  
  const [depositIds, setDepositIds] = useState<string[]>([]);
  const [deposits, setDeposits] = useState<Map<string, DepositRow>>(new Map());
  const [loadingIds, setLoadingIds] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isAutoFallback, setIsAutoFallback] = useState(true);
  
  const [anchorYear, setAnchorYear] = useState<number | null>(null);
  const [anchorStartMonth, setAnchorStartMonth] = useState<number | null>(null);
  const [anchorEndMonth, setAnchorEndMonth] = useState<number | null>(null);
  
  const abortRef = useRef(false);

  // ============ CALCUL DYNAMIQUE DE windowSizeCurrent ============
  
  const monthCount = endMonth - startMonth + 1;
  const windowSizeCurrent = getWindowSizeFromRange(monthCount);

  // ============ NAVIGATION ============

  const canGoPrevious = year > MIN_YEAR || startMonth > 0;
  const canGoNext = (() => {
    if (year < currentYear) return true;
    if (year === currentYear) {
      const blocks = getBlocks(windowSizeCurrent);
      const currentBlockIndex = blocks.findIndex(([s]) => s === startMonth);
      if (currentBlockIndex >= 0 && currentBlockIndex < blocks.length - 1) {
        const nextBlock = blocks[currentBlockIndex + 1];
        return nextBlock[1] <= currentMonth;
      }
    }
    return false;
  })();
  
  const showReset = anchorYear !== null && (
    year !== anchorYear || 
    startMonth !== anchorStartMonth || 
    endMonth !== anchorEndMonth
  );

  const goToPrevious = () => {
    if (!canGoPrevious) return;
    setIsAutoFallback(false);
    
    const blocks = getBlocks(windowSizeCurrent);
    const currentBlockIndex = blocks.findIndex(([s]) => s === startMonth);
    
    if (currentBlockIndex > 0) {
      const [s, e] = blocks[currentBlockIndex - 1];
      setStartMonth(s);
      setEndMonth(e);
    } else if (currentBlockIndex === 0) {
      setYear(year - 1);
      const [s, e] = blocks[blocks.length - 1];
      setStartMonth(s);
      setEndMonth(e);
    } else {
      const prevBlock = blocks.find(([s, e]) => e < startMonth);
      if (prevBlock) {
        setStartMonth(prevBlock[0]);
        setEndMonth(prevBlock[1]);
      } else {
        setYear(year - 1);
        const [s, e] = blocks[blocks.length - 1];
        setStartMonth(s);
        setEndMonth(e);
      }
    }
  };

  const goToNext = () => {
    if (!canGoNext) return;
    setIsAutoFallback(false);
    
    const blocks = getBlocks(windowSizeCurrent);
    const currentBlockIndex = blocks.findIndex(([s]) => s === startMonth);
    
    if (currentBlockIndex >= 0 && currentBlockIndex < blocks.length - 1) {
      const [s, e] = blocks[currentBlockIndex + 1];
      setStartMonth(s);
      setEndMonth(e);
    } else if (currentBlockIndex === blocks.length - 1) {
      setYear(year + 1);
      const [s, e] = blocks[0];
      setStartMonth(s);
      setEndMonth(e);
    }
  };

  const resetToAnchor = () => {
    if (anchorYear !== null) {
      setIsAutoFallback(false);
      setYear(anchorYear);
      setStartMonth(anchorStartMonth!);
      setEndMonth(anchorEndMonth!);
    }
  };

  const handleStartMonthChange = (value: number) => {
    setIsAutoFallback(false);
    setStartMonth(value);
  };

  const handleEndMonthChange = (value: number) => {
    setIsAutoFallback(false);
    setEndMonth(value);
  };

  // ============ CALCUL PLAGE DE DATES ============

  const getDateRange = () => {
    const from = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, endMonth + 1, 0).getDate();
    const to = `${year}-${String(endMonth + 1).padStart(2, "0")}-${lastDay}`;
    return { from, to };
  };

  // ============ LOGIQUE DE FALLBACK ============
  
  const applyFallback = () => {
    const nextIndex = fallbackIndex + 1;
    
    if (nextIndex >= VALID_WINDOW_SIZES.length) {
      setIsAutoFallback(false);
      return;
    }
    
    const nextWindowSize = VALID_WINDOW_SIZES[nextIndex];
    const lastCompleteBlock = getLastCompleteBlock(currentMonth, nextWindowSize);
    
    if (lastCompleteBlock) {
      const anchor = calculateAnchor(currentMonth, nextWindowSize);
      setStartMonth(anchor.startMonth);
      setEndMonth(anchor.endMonth);
    } else {
      setYear(currentYear - 1);
      const blocks = getBlocks(nextWindowSize);
      const lastBlock = blocks[blocks.length - 1];
      setStartMonth(lastBlock[0]);
      setEndMonth(lastBlock[1]);
    }
    
    setFallbackIndex(nextIndex);
  };

  // ============ CHARGEMENT PAR BATCH (STREAMING) ============

  const loadBatch = useCallback(async (ids: string[]): Promise<number> => {
    if (abortRef.current) return 0;
    
    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const details = await billingService.getDeposit(id);
          return { id, details, success: true };
        } catch {
          return { id, details: null, success: false };
        }
      })
    );

    if (abortRef.current) return 0;

    setDeposits((prev) => {
      const next = new Map(prev);
      for (const r of results) {
        if (r.success && r.details) {
          next.set(r.id, { depositId: r.id, loaded: true, details: r.details });
        } else {
          next.set(r.id, { depositId: r.id, loaded: true });
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

  // ============ CHARGEMENT PRINCIPAL ============

  const loadDeposits = useCallback(async () => {
    abortRef.current = true;
    await new Promise(r => setTimeout(r, 50));
    abortRef.current = false;
    
    setLoadingIds(true);
    setError(null);
    setLoadedCount(0);
    setDeposits(new Map());
    setDepositIds([]);
    
    try {
      const { from, to } = getDateRange();
      const ids = await billingService.getDepositIds({ "date.from": from, "date.to": to });
      
      if (ids.length === 0 && isAutoFallback && fallbackIndex < VALID_WINDOW_SIZES.length - 1) {
        setLoadingIds(false);
        applyFallback();
        return;
      }
      
      if (isAutoFallback) {
        setIsAutoFallback(false);
        setAnchorYear(year);
        setAnchorStartMonth(startMonth);
        setAnchorEndMonth(endMonth);
      }
      
      const sortedIds = [...ids].sort((a, b) => b.localeCompare(a));
      setDepositIds(sortedIds);
      
      const initial = new Map<string, DepositRow>();
      for (const id of sortedIds) {
        initial.set(id, { depositId: id, loaded: false });
      }
      setDeposits(initial);
      setLoadingIds(false);
      
      if (sortedIds.length > 0) {
        loadAllDetails(sortedIds);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
      setLoadingIds(false);
    }
  }, [year, startMonth, endMonth, isAutoFallback, fallbackIndex, loadAllDetails, t]);

  useEffect(() => {
    loadDeposits();
  }, [year, startMonth, endMonth, fallbackIndex]);

  // ============ EXPORT CSV ============

  const exportCSV = () => {
    const loadedData = Array.from(deposits.values())
      .filter(r => r.loaded && r.details)
      .map(r => r.details!)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (loadedData.length === 0) return;
    
    const headers = [t('columns.reference'), t('columns.date'), t('columns.amount'), t('invoices.currency'), t('payments.method')];
    const rows = loadedData.map(d => [
      d.depositId,
      formatDateISO(d.date),
      d.amount.value.toFixed(2),
      d.amount.currencyCode,
      formatPayment(d.paymentInfo)
    ]);
    
    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OVHcloud-${t('payments.exportFilename')}_${year}-${String(startMonth + 1).padStart(2, "0")}_${year}-${String(endMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============ EXPORT PDF ============

  const exportPDF = () => {
    const loadedData = Array.from(deposits.values())
      .filter(r => r.loaded && r.details)
      .map(r => r.details!)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (loadedData.length === 0) return;
    
    const total = loadedData.reduce((s, d) => s + d.amount.value, 0);
    const currency = loadedData[0]?.amount.currencyCode || "EUR";
    const periodLabel = `${MONTHS_FULL[startMonth]} ${year} - ${MONTHS_FULL[endMonth]} ${year}`;
    
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-${t('payments.pdfTitle')} - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>${t('payments.pdfTitle')}</h1><p class="period">${periodLabel} — ${loadedData.length} ${t('payments.paymentUnit')}</p><table><thead><tr><th>${t('columns.reference')}</th><th>${t('columns.date')}</th><th>${t('payments.method')}</th><th class="amount">${t('columns.amount')}</th></tr></thead><tbody>${loadedData.map(d => `<tr><td>${d.depositId}</td><td>${formatDate(d.date)}</td><td>${formatPayment(d.paymentInfo)}</td><td class="amount">${formatAmount(d.amount.value, d.amount.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="3">${t('invoices.total')}</td><td class="amount">${formatAmount(total, currency)}</td></tr></tbody></table><p class="footer">${t('invoices.generatedOn')} ${new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} ${t('invoices.fromManager')}</p></body></html>`;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  };

  // ============ RENDU ============

  const Skeleton = () => <span className="skeleton-text"></span>;

  const sortedRows = depositIds.map((id) => deposits.get(id)!).filter(Boolean);
  const loadedRows = sortedRows.filter((r) => r.loaded && r.details);
  loadedRows.sort((a, b) => new Date(b.details!.date).getTime() - new Date(a.details!.date).getTime());
  const unloadedRows = sortedRows.filter((r) => !r.loaded || !r.details);
  const finalRows = [...loadedRows, ...unloadedRows];

  const allLoaded = loadedCount >= depositIds.length && depositIds.length > 0;

  return (
    <div className="tab-panel">
      {/* ===== TOOLBAR ===== */}
      <div className="toolbar payments-toolbar">
        <div className="toolbar-left">
          <span className="year-label">{year}</span>
          
          <button className="btn year-nav-btn" onClick={goToPrevious} disabled={!canGoPrevious} title={t('invoices.nav.previous')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <select className="period-select month-select" value={startMonth} onChange={(e) => handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          
          <span className="date-separator">→</span>
          
          <select className="period-select month-select" value={endMonth} onChange={(e) => handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_SHORT.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          
          <button className="btn year-nav-btn" onClick={goToNext} disabled={!canGoNext} title={t('invoices.nav.next')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          
          {showReset && (
            <button className="btn reset-btn" onClick={resetToAnchor} title={t('invoices.nav.reset')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        
        <div className="toolbar-right">
          {allLoaded && depositIds.length > 0 && (
            <>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportCSV} title={t('invoices.export.csv')}><FileTextIcon /> CSV</button>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportPDF} title={t('invoices.export.pdf')}><FileIcon /> PDF</button>
            </>
          )}
          <span className="result-count">{loadingIds ? tCommon('loading') : t('payments.countProgress', { loaded: loadedCount, total: depositIds.length })}</span>
        </div>
      </div>

      {/* ===== CONTENU ===== */}
      {loadingIds ? (
        <div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : depositIds.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>{t('payments.empty.title')}</h3><p>{t('payments.empty.description')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('columns.reference')}</th>
                <th>{t('columns.date')}</th>
                <th>{t('columns.amount')}</th>
                <th>{t('payments.method')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {finalRows.map((row) => (
                <tr key={row.depositId} className={row.loaded ? "" : "loading-row"}>
                  <td className="ref-cell"><span className="ref-badge">{row.depositId}</span></td>
                  <td>{row.loaded && row.details ? formatDate(row.details.date) : <Skeleton />}</td>
                  <td className="amount-cell">{row.loaded && row.details ? formatAmount(row.details.amount.value, row.details.amount.currencyCode) : <Skeleton />}</td>
                  <td>{row.loaded && row.details ? formatPayment(row.details.paymentInfo) : <Skeleton />}</td>
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
