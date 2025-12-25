// ============================================================
// INVOICES TAB SERVICE - Service ISOLÉ
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FileTextIcon, FileIcon } from "../../icons";

// ============ CONSTANTES ============
export const MIN_YEAR = 2020;
export const BATCH_SIZE = 10;
export const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

// ============ HELPERS PÉRIODE ============
export function getWindowSizeFromRange(monthCount: number): number {
  for (let i = VALID_WINDOW_SIZES.length - 1; i >= 0; i--) {
    if (VALID_WINDOW_SIZES[i] <= monthCount) return VALID_WINDOW_SIZES[i];
  }
  return 1;
}

export function getBlocks(windowSize: number): [number, number][] {
  const blocks: [number, number][] = [];
  for (let i = 0; i < 12; i += windowSize) {
    blocks.push([i, Math.min(i + windowSize - 1, 11)]);
  }
  return blocks;
}

export function getLastCompleteBlock(month: number, windowSize: number): [number, number] | null {
  const blocks = getBlocks(windowSize);
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i][1] <= month) return blocks[i];
  }
  return null;
}

export function calculateAnchor(currentMonth: number, windowSize: number): { startMonth: number; endMonth: number } {
  const blocks = getBlocks(windowSize);
  const currentBlockIndex = blocks.findIndex(([s, e]) => s <= currentMonth && currentMonth <= e);
  const currentBlock = blocks[currentBlockIndex];
  if (currentBlock[1] <= currentMonth) return { startMonth: currentBlock[0], endMonth: currentBlock[1] };
  if (currentBlockIndex > 0) {
    const prevBlock = blocks[currentBlockIndex - 1];
    return { startMonth: prevBlock[0], endMonth: currentMonth };
  }
  return { startMonth: 0, endMonth: currentMonth };
}

export function getDateRange(year: number, startMonth: number, endMonth: number): { from: string; to: string } {
  const from = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, endMonth + 1, 0).getDate();
  const to = `${year}-${String(endMonth + 1).padStart(2, "0")}-${lastDay}`;
  return { from, to };
}

// ============ HELPERS FORMATAGE ============
export const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
export const formatDateISO = (d: string) => new Date(d).toISOString().split("T")[0];
export const formatAmount = (v: number, c: string) => {
  if (!c || c.toLowerCase() === "points") return `${v.toLocaleString("fr-FR")} pts`;
  try { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v); }
  catch { return `${v.toLocaleString("fr-FR")} ${c}`; }
};

// ============ TYPES HOOK ============
export interface PeriodNavigation {
  year: number; startMonth: number; endMonth: number; windowSizeCurrent: number;
  canGoPrevious: boolean; canGoNext: boolean; showReset: boolean;
  goToPrevious: () => void; goToNext: () => void; resetToAnchor: () => void;
  handleStartMonthChange: (value: number) => void; handleEndMonthChange: (value: number) => void;
  getDateRangeISO: () => { from: string; to: string };
  isAutoFallback: boolean; fallbackIndex: number;
  applyFallback: () => void; setAnchor: () => void; disableAutoFallback: () => void;
}

// ============ HOOK ============
export function usePeriodNavigation(): PeriodNavigation {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [year, setYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [anchorYear, setAnchorYear] = useState<number | null>(null);
  const [anchorStartMonth, setAnchorStartMonth] = useState<number | null>(null);
  const [anchorEndMonth, setAnchorEndMonth] = useState<number | null>(null);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isAutoFallback, setIsAutoFallback] = useState(true);

  const monthCount = endMonth - startMonth + 1;
  const windowSizeCurrent = getWindowSizeFromRange(monthCount);
  const canGoPrevious = year > MIN_YEAR || startMonth > 0;
  const canGoNext = (() => {
    if (year < currentYear) return true;
    if (year === currentYear) {
      const blocks = getBlocks(windowSizeCurrent);
      const idx = blocks.findIndex(([s]) => s === startMonth);
      if (idx >= 0 && idx < blocks.length - 1) return blocks[idx + 1][1] <= currentMonth;
    }
    return false;
  })();
  const showReset = anchorYear !== null && (year !== anchorYear || startMonth !== anchorStartMonth || endMonth !== anchorEndMonth);

  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    setIsAutoFallback(false);
    const blocks = getBlocks(windowSizeCurrent);
    const idx = blocks.findIndex(([s]) => s === startMonth);
    if (idx > 0) { const [s, e] = blocks[idx - 1]; setStartMonth(s); setEndMonth(e); }
    else if (idx === 0) { setYear(y => y - 1); const [s, e] = blocks[blocks.length - 1]; setStartMonth(s); setEndMonth(e); }
    else { const prev = blocks.find(([, e]) => e < startMonth); if (prev) { setStartMonth(prev[0]); setEndMonth(prev[1]); } else { setYear(y => y - 1); const [s, e] = blocks[blocks.length - 1]; setStartMonth(s); setEndMonth(e); } }
  }, [canGoPrevious, windowSizeCurrent, startMonth]);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    setIsAutoFallback(false);
    const blocks = getBlocks(windowSizeCurrent);
    const idx = blocks.findIndex(([s]) => s === startMonth);
    if (idx >= 0 && idx < blocks.length - 1) { const [s, e] = blocks[idx + 1]; setStartMonth(s); setEndMonth(e); }
    else if (idx === blocks.length - 1) { setYear(y => y + 1); const [s, e] = blocks[0]; setStartMonth(s); setEndMonth(e); }
  }, [canGoNext, windowSizeCurrent, startMonth]);

  const resetToAnchor = useCallback(() => { if (anchorYear !== null) { setIsAutoFallback(false); setYear(anchorYear); setStartMonth(anchorStartMonth!); setEndMonth(anchorEndMonth!); } }, [anchorYear, anchorStartMonth, anchorEndMonth]);
  const handleStartMonthChange = useCallback((v: number) => { setIsAutoFallback(false); setStartMonth(v); }, []);
  const handleEndMonthChange = useCallback((v: number) => { setIsAutoFallback(false); setEndMonth(v); }, []);
  const getDateRangeISO = useCallback(() => getDateRange(year, startMonth, endMonth), [year, startMonth, endMonth]);

  const applyFallback = useCallback(() => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex >= VALID_WINDOW_SIZES.length) { setIsAutoFallback(false); return; }
    const nextWindowSize = VALID_WINDOW_SIZES[nextIndex];
    const lastComplete = getLastCompleteBlock(currentMonth, nextWindowSize);
    if (lastComplete) { const anchor = calculateAnchor(currentMonth, nextWindowSize); setStartMonth(anchor.startMonth); setEndMonth(anchor.endMonth); }
    else { setYear(currentYear - 1); const blocks = getBlocks(nextWindowSize); const last = blocks[blocks.length - 1]; setStartMonth(last[0]); setEndMonth(last[1]); }
    setFallbackIndex(nextIndex);
  }, [fallbackIndex, currentMonth, currentYear]);

  const setAnchor = useCallback(() => { setIsAutoFallback(false); setAnchorYear(year); setAnchorStartMonth(startMonth); setAnchorEndMonth(endMonth); }, [year, startMonth, endMonth]);
  const disableAutoFallback = useCallback(() => { setIsAutoFallback(false); }, []);

  return { year, startMonth, endMonth, windowSizeCurrent, canGoPrevious, canGoNext, showReset, goToPrevious, goToNext, resetToAnchor, handleStartMonthChange, handleEndMonthChange, getDateRangeISO, isAutoFallback, fallbackIndex, applyFallback, setAnchor, disableAutoFallback };
}

// ============ PERIOD TOOLBAR ============
export interface PeriodToolbarProps {
  year: number; startMonth: number; endMonth: number;
  canGoPrevious: boolean; canGoNext: boolean; showReset: boolean;
  goToPrevious: () => void; goToNext: () => void; resetToAnchor: () => void;
  handleStartMonthChange: (value: number) => void; handleEndMonthChange: (value: number) => void;
  loadingIds: boolean; loadedCount: number; totalCount: number; allLoaded: boolean;
  onExportCSV: () => void; onExportPDF: () => void; countLabelKey: string;
}

export function PeriodToolbar({ year, startMonth, endMonth, canGoPrevious, canGoNext, showReset, goToPrevious, goToNext, resetToAnchor, handleStartMonthChange, handleEndMonthChange, loadingIds, loadedCount, totalCount, allLoaded, onExportCSV, onExportPDF, countLabelKey }: PeriodToolbarProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
  const MONTHS_SHORT = t('invoices.months.short', { returnObjects: true }) as string[];

  return (
    <div className="invoices-toolbar">
      <div className="invoices-toolbar-left">
        <span className="invoices-year-label">{year}</span>
        <button className="btn invoices-year-nav-btn" onClick={goToPrevious} disabled={!canGoPrevious} title={t('invoices.nav.previous')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
        <select className="invoices-period-select invoices-month-select" value={startMonth} onChange={(e) => handleStartMonthChange(Number(e.target.value))}>{MONTHS_SHORT.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}</select>
        <span className="invoices-date-separator">→</span>
        <select className="invoices-period-select invoices-month-select" value={endMonth} onChange={(e) => handleEndMonthChange(Number(e.target.value))}>{MONTHS_SHORT.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}</select>
        <button className="btn invoices-year-nav-btn" onClick={goToNext} disabled={!canGoNext} title={t('invoices.nav.next')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
        {showReset && <button className="btn invoices-reset-btn" onClick={resetToAnchor} title={t('invoices.nav.reset')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>}
      </div>
      <div className="invoices-toolbar-right">
        {allLoaded && totalCount > 0 && (<><button className="btn btn-sm btn-secondary invoices-export-btn" onClick={onExportCSV} title={t('invoices.export.csv')}><FileTextIcon /> CSV</button><button className="btn btn-sm btn-secondary invoices-export-btn" onClick={onExportPDF} title={t('invoices.export.pdf')}><FileIcon /> PDF</button></>)}
        <span className="invoices-result-count">{loadingIds ? tCommon('loading') : t(countLabelKey, { loaded: loadedCount, total: totalCount })}</span>
      </div>
    </div>
  );
}

// ============ TYPES API ============

export interface Bill {
  billId: string;
  date: string;
  orderId: number;
  password: string;
  pdfUrl: string;
  priceWithTax: { currencyCode: string; text: string; value: number };
  priceWithoutTax: { currencyCode: string; text: string; value: number };
  tax: { currencyCode: string; text: string; value: number };
  url: string;
}

// ============ BILLS API ============

import { ovhGet } from "../../../../../services/api";

export async function getBillIds(options?: { "date.from"?: string; "date.to"?: string }): Promise<string[]> {
  const params = new URLSearchParams();
  if (options?.["date.from"]) params.append("date.from", options["date.from"]);
  if (options?.["date.to"]) params.append("date.to", options["date.to"]);
  const query = params.toString() ? `?${params.toString()}` : "";
  return ovhGet<string[]>(`/me/bill${query}`);
}

export async function getBill(billId: string): Promise<Bill> {
  return ovhGet<Bill>(`/me/bill/${encodeURIComponent(billId)}`);
}

export async function getBills(options?: { "date.from"?: string; "date.to"?: string; limit?: number }): Promise<Bill[]> {
  const billIds = await getBillIds(options);
  const idsToFetch = options?.limit ? billIds.slice(0, options.limit) : billIds;
  const bills: Bill[] = [];
  for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
    const batch = idsToFetch.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => getBill(id).catch(() => null)));
    bills.push(...results.filter((b): b is Bill => b !== null));
  }
  return bills.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
