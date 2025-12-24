// ============================================================
// PERIOD TOOLBAR - Barre d'outils navigation période + export
// ============================================================

import { useTranslation } from "react-i18next";
import { FileTextIcon, FileIcon } from "../icons";

// ============ TYPES ============

export interface PeriodToolbarProps {
  year: number;
  startMonth: number;
  endMonth: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  showReset: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  resetToAnchor: () => void;
  handleStartMonthChange: (value: number) => void;
  handleEndMonthChange: (value: number) => void;
  loadingIds: boolean;
  loadedCount: number;
  totalCount: number;
  allLoaded: boolean;
  onExportCSV: () => void;
  onExportPDF: () => void;
  countLabelKey: string;
}

// ============ COMPOSANT ============

/** Toolbar de navigation par période avec boutons prev/next, selects mois, reset, et boutons export CSV/PDF. */
export function PeriodToolbar({
  year,
  startMonth,
  endMonth,
  canGoPrevious,
  canGoNext,
  showReset,
  goToPrevious,
  goToNext,
  resetToAnchor,
  handleStartMonthChange,
  handleEndMonthChange,
  loadingIds,
  loadedCount,
  totalCount,
  allLoaded,
  onExportCSV,
  onExportPDF,
  countLabelKey,
}: PeriodToolbarProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');

  const MONTHS_SHORT = t('invoices.months.short', { returnObjects: true }) as string[];

  return (
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
        {allLoaded && totalCount > 0 && (
          <>
            <button className="btn btn-sm btn-secondary export-btn" onClick={onExportCSV} title={t('invoices.export.csv')}><FileTextIcon /> CSV</button>
            <button className="btn btn-sm btn-secondary export-btn" onClick={onExportPDF} title={t('invoices.export.pdf')}><FileIcon /> PDF</button>
          </>
        )}
        <span className="result-count">{loadingIds ? tCommon('loading') : t(countLabelKey, { loaded: loadedCount, total: totalCount })}</span>
      </div>
    </div>
  );
}
