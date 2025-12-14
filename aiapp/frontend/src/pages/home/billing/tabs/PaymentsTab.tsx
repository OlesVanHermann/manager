// ============================================================
// PAYMENTS TAB - Paiements avec chargement streaming + fallback
// ============================================================
// 
// FALLBACK AUTOMATIQUE:
// Cherche dans des blocs alignés de taille croissante (1, 2, 3, 4, 6, 12 mois)
// jusqu'à trouver des résultats.
// 
// BLOCS ALIGNÉS:
// - 1 mois  : Jan, Fév, Mars, ..., Déc
// - 2 mois  : Jan-Fév, Mars-Avr, Mai-Juin, Juil-Août, Sep-Oct, Nov-Déc
// - 3 mois  : Jan-Mars, Avr-Juin, Juil-Sep, Oct-Déc
// - 4 mois  : Jan-Avr, Mai-Août, Sep-Déc
// - 6 mois  : Jan-Juin, Juil-Déc
// - 12 mois : Jan-Déc
// 
// ANCRE AFFICHÉE:
// Si le bloc courant est incomplet (fin > mois actuel), on affiche:
// bloc précédent complet + mois jusqu'au mois courant
// Ex: Juillet 2025, windowSize=2 → Mai-Juil (Mai-Juin + Juil)
// 
// NAVIGATION < > :
// Se déplace par blocs alignés de taille windowSizeCurrent
// windowSizeCurrent est calculé dynamiquement selon la sélection:
// monthCount → windowSize (1→1, 2→2, 3→3, 4→4, 5→4, 6→6, 7-11→6, 12→12)
// 
// RESET ↺ :
// Retourne à l'ancre initiale (windowSizeInitial)
// 
// TOOLBAR LAYOUT:
// ┌──────────────────────────────────────────────────────────────────────────┐
// │  2025    [<] [Mai ▼] → [Juil. ▼] [>]    [↺]       [CSV] [PDF]  5/5 paie. │
// │    ↑      ↑                       ↑      ↑                               │
// │  année  prev                    next  reset                              │
// └──────────────────────────────────────────────────────────────────────────┘
// 
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, formatAmount, formatDateISO } from "../utils";
import { DownloadIcon, ExternalIcon, CheckIcon, FileTextIcon, FileIcon } from "../icons";

// ============ CONSTANTES ============

const MONTHS_FR = ["Janv.", "Fév.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
const MONTHS_FR_FULL = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MIN_YEAR = 2020;
const BATCH_SIZE = 10;

const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

const PAYMENT_LABELS: Record<string, string> = {
  creditCard: "Carte",
  withdrawal: "Prélèvement",
  bankAccount: "Virement",
  paypal: "PayPal",
  fidelityAccount: "Points fidélité",
  ovhAccount: "Compte OVH",
  voucher: "Bon d'achat",
};

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

  const formatPayment = (info?: { paymentType: string; publicLabel?: string }) => {
    if (!info) return "-";
    const label = PAYMENT_LABELS[info.paymentType] || info.paymentType;
    if (info.publicLabel) {
      const short = info.publicLabel.length > 20 
        ? info.publicLabel.slice(-12) 
        : info.publicLabel.replace(/X/g, "•").slice(-8);
      return `${label} ${short}`;
    }
    return label;
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
      setError(err instanceof Error ? err.message : "Erreur de chargement");
      setLoadingIds(false);
    }
  }, [year, startMonth, endMonth, isAutoFallback, fallbackIndex, loadAllDetails]);

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
    
    const headers = ["Référence", "Date", "Montant", "Devise", "Moyen de paiement"];
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
    a.download = `OVHcloud-paiements_${year}-${String(startMonth + 1).padStart(2, "0")}_${year}-${String(endMonth + 1).padStart(2, "0")}.csv`;
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
    const periodLabel = `${MONTHS_FR_FULL[startMonth]} ${year} - ${MONTHS_FR_FULL[endMonth]} ${year}`;
    
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-Paiements - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>Historique des paiements</h1><p class="period">${periodLabel} — ${loadedData.length} paiement(s)</p><table><thead><tr><th>Référence</th><th>Date</th><th>Moyen</th><th class="amount">Montant</th></tr></thead><tbody>${loadedData.map(d => `<tr><td>${d.depositId}</td><td>${formatDate(d.date)}</td><td>${formatPayment(d.paymentInfo)}</td><td class="amount">${formatAmount(d.amount.value, d.amount.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="3">Total</td><td class="amount">${formatAmount(total, currency)}</td></tr></tbody></table><p class="footer">Généré le ${new Date().toLocaleDateString("fr-FR")} depuis OVHcloud Manager</p></body></html>`;
    
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
          {/* Année */}
          <span className="year-label">{year}</span>
          
          {/* Navigation < */}
          <button className="btn year-nav-btn" onClick={goToPrevious} disabled={!canGoPrevious} title="Période précédente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <select className="period-select month-select" value={startMonth} onChange={(e) => handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_FR.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          
          <span className="date-separator">→</span>
          
          <select className="period-select month-select" value={endMonth} onChange={(e) => handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_FR.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          
          {/* Navigation > */}
          <button className="btn year-nav-btn" onClick={goToNext} disabled={!canGoNext} title="Période suivante">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          
          {showReset && (
            <button className="btn reset-btn" onClick={resetToAnchor} title="Retour à la période initiale">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        
        <div className="toolbar-right">
          {allLoaded && depositIds.length > 0 && (
            <>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportCSV} title="Exporter en CSV"><FileTextIcon /> CSV</button>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportPDF} title="Exporter en PDF"><FileIcon /> PDF</button>
            </>
          )}
          <span className="result-count">{loadingIds ? "Chargement..." : `${loadedCount}/${depositIds.length} paiement(s)`}</span>
        </div>
      </div>

      {/* ===== CONTENU ===== */}
      {loadingIds ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : depositIds.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>Aucun paiement</h3><p>Aucun paiement enregistré sur cette période.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Moyen</th>
                <th>Actions</th>
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
                        {row.details.pdfUrl && <a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>}
                        {row.details.url && <a href={row.details.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>}
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
