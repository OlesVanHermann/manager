// ============================================================
// INVOICES TAB - Factures avec chargement streaming + fallback
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

interface BillRow {
  billId: string;
  loaded: boolean;
  details?: billingService.Bill;
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

export function InvoicesTab({ credentials }: TabProps) {
  const { t, i18n } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  
  const MONTHS_SHORT = t('invoices.months.short', { returnObjects: true }) as string[];
  const MONTHS_FULL = t('invoices.months.full', { returnObjects: true }) as string[];
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // ============ STATE ============
  
  const [year, setYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [endMonth, setEndMonth] = useState(currentMonth);
  
  const [billIds, setBillIds] = useState<string[]>([]);
  const [bills, setBills] = useState<Map<string, BillRow>>(new Map());
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
          const details = await billingService.getBill(id);
          return { id, details, success: true };
        } catch {
          return { id, details: null, success: false };
        }
      })
    );

    if (abortRef.current) return 0;

    setBills((prev) => {
      const next = new Map(prev);
      for (const r of results) {
        if (r.success && r.details) {
          next.set(r.id, { billId: r.id, loaded: true, details: r.details });
        } else {
          next.set(r.id, { billId: r.id, loaded: true });
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

  const loadBills = useCallback(async () => {
    abortRef.current = true;
    await new Promise(r => setTimeout(r, 50));
    abortRef.current = false;
    
    setLoadingIds(true);
    setError(null);
    setLoadedCount(0);
    setBills(new Map());
    setBillIds([]);
    
    try {
      const { from, to } = getDateRange();
      const ids = await billingService.getBillIds({ "date.from": from, "date.to": to });
      
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
      setBillIds(sortedIds);
      
      const initial = new Map<string, BillRow>();
      for (const id of sortedIds) {
        initial.set(id, { billId: id, loaded: false });
      }
      setBills(initial);
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
    loadBills();
  }, [year, startMonth, endMonth, fallbackIndex]);

  // ============ CALCUL DES TOTAUX ============

  const loadedData = Array.from(bills.values())
    .filter(r => r.loaded && r.details)
    .map(r => r.details!);
  
  const totalHT = loadedData.reduce((s, b) => s + b.priceWithoutTax.value, 0);
  const totalTVA = loadedData.reduce((s, b) => s + b.tax.value, 0);
  const totalTTC = loadedData.reduce((s, b) => s + b.priceWithTax.value, 0);
  const currency = loadedData[0]?.priceWithTax.currencyCode || "EUR";

  // ============ EXPORT CSV ============

  const exportCSV = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (data.length === 0) return;
    
    const headers = [t('columns.reference'), t('columns.date'), t('columns.amountHT'), t('invoices.vat'), t('columns.amountTTC'), t('invoices.currency')];
    const rows = data.map(b => [
      b.billId,
      formatDateISO(b.date),
      b.priceWithoutTax.value.toFixed(2),
      b.tax.value.toFixed(2),
      b.priceWithTax.value.toFixed(2),
      b.priceWithTax.currencyCode
    ]);
    
    const csvContent = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OVHcloud-${t('invoices.exportFilename')}_${year}-${String(startMonth + 1).padStart(2, "0")}_${year}-${String(endMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============ EXPORT PDF ============

  const exportPDF = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (data.length === 0) return;
    
    const periodLabel = `${MONTHS_FULL[startMonth]} ${year} - ${MONTHS_FULL[endMonth]} ${year}`;
    
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-${t('invoices.pdfTitle')} - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>${t('invoices.pdfTitle')}</h1><p class="period">${periodLabel} — ${data.length} ${t('invoices.invoiceUnit')}</p><table><thead><tr><th>${t('columns.reference')}</th><th>${t('columns.date')}</th><th class="amount">${t('invoices.ht')}</th><th class="amount">${t('invoices.vat')}</th><th class="amount">${t('invoices.ttc')}</th></tr></thead><tbody>${data.map(b => `<tr><td>${b.billId}</td><td>${formatDate(b.date)}</td><td class="amount">${formatAmount(b.priceWithoutTax.value, b.priceWithoutTax.currencyCode)}</td><td class="amount">${formatAmount(b.tax.value, b.tax.currencyCode)}</td><td class="amount">${formatAmount(b.priceWithTax.value, b.priceWithTax.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="2">${t('invoices.total')}</td><td class="amount">${formatAmount(totalHT, currency)}</td><td class="amount">${formatAmount(totalTVA, currency)}</td><td class="amount">${formatAmount(totalTTC, currency)}</td></tr></tbody></table><p class="footer">${t('invoices.generatedOn')} ${new Date().toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} ${t('invoices.fromManager')}</p></body></html>`;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  };

  // ============ RENDU ============

  const Skeleton = () => <span className="skeleton-text"></span>;

  const sortedRows = billIds.map((id) => bills.get(id)!).filter(Boolean);
  const loadedRows = sortedRows.filter((r) => r.loaded && r.details);
  loadedRows.sort((a, b) => new Date(b.details!.date).getTime() - new Date(a.details!.date).getTime());
  const unloadedRows = sortedRows.filter((r) => !r.loaded || !r.details);
  const finalRows = [...loadedRows, ...unloadedRows];

  const allLoaded = loadedCount >= billIds.length && billIds.length > 0;

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
          {allLoaded && billIds.length > 0 && (
            <>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportCSV} title={t('invoices.export.csv')}><FileTextIcon /> CSV</button>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportPDF} title={t('invoices.export.pdf')}><FileIcon /> PDF</button>
            </>
          )}
          <span className="result-count">{loadingIds ? tCommon('loading') : t('invoices.countProgress', { loaded: loadedCount, total: billIds.length })}</span>
        </div>
      </div>

      {/* ===== BARRE DES TOTAUX ===== */}
      {allLoaded && billIds.length > 0 && (
        <div className="totals-bar">
          <span className="total-label">{t('invoices.totalHT')}: <strong>{formatAmount(totalHT, currency)}</strong></span>
          <span className="total-label">{t('invoices.vat')}: <strong>{formatAmount(totalTVA, currency)}</strong></span>
          <span className="total-label">{t('invoices.totalTTC')}: <strong>{formatAmount(totalTTC, currency)}</strong></span>
        </div>
      )}

      {/* ===== CONTENU ===== */}
      {loadingIds ? (
        <div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : billIds.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>{t('invoices.empty.title')}</h3><p>{t('invoices.empty.description')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table bills-table">
            <thead>
              <tr>
                <th>{t('columns.reference')}</th>
                <th>{t('columns.date')}</th>
                <th>{t('columns.amountHT')}</th>
                <th>{t('invoices.vat')}</th>
                <th>{t('columns.amountTTC')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {finalRows.map((row) => (
                <tr key={row.billId} className={row.loaded ? "" : "loading-row"}>
                  <td className="ref-cell"><span className="ref-badge">{row.billId}</span></td>
                  <td>{row.loaded && row.details ? formatDate(row.details.date) : <Skeleton />}</td>
                  <td className="amount-cell">{row.loaded && row.details ? formatAmount(row.details.priceWithoutTax.value, row.details.priceWithoutTax.currencyCode) : <Skeleton />}</td>
                  <td className="amount-cell">{row.loaded && row.details ? formatAmount(row.details.tax.value, row.details.tax.currencyCode) : <Skeleton />}</td>
                  <td className="amount-cell">{row.loaded && row.details ? formatAmount(row.details.priceWithTax.value, row.details.priceWithTax.currencyCode) : <Skeleton />}</td>
                  <td className="actions-cell">
                    {row.loaded && row.details ? (
                      <>
                        <a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>
                        <a href={row.details.url} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a>
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
