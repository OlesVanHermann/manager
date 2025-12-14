// ============================================================
// INVOICES TAB - Factures avec chargement streaming + fallback
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
// │  2025    [<] [Mai ▼] → [Juil. ▼] [>]    [↺]       [CSV] [PDF]  5/5 fact. │
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

// Tailles de fenêtre valides pour le fallback et la navigation
const VALID_WINDOW_SIZES = [1, 2, 3, 4, 6, 12];

// ============ TYPES ============

interface BillRow {
  billId: string;
  loaded: boolean;
  details?: billingService.Bill;
}

// ============ HELPERS BLOCS ALIGNÉS ============

// Trouve le windowSize valide le plus proche (arrondi vers le bas)
function getWindowSizeFromRange(monthCount: number): number {
  for (let i = VALID_WINDOW_SIZES.length - 1; i >= 0; i--) {
    if (VALID_WINDOW_SIZES[i] <= monthCount) {
      return VALID_WINDOW_SIZES[i];
    }
  }
  return 1;
}

// Génère les blocs alignés pour une taille donnée
function getBlocks(windowSize: number): [number, number][] {
  const blocks: [number, number][] = [];
  for (let i = 0; i < 12; i += windowSize) {
    blocks.push([i, Math.min(i + windowSize - 1, 11)]);
  }
  return blocks;
}

// Trouve le bloc aligné dont la fin est <= mois donné
function getLastCompleteBlock(month: number, windowSize: number): [number, number] | null {
  const blocks = getBlocks(windowSize);
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i][1] <= month) {
      return blocks[i];
    }
  }
  return null;
}

// Calcule l'ancre initiale pour le fallback
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
  
  // État "ancre" = période déterminée par le fallback (pour le bouton reset)
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

  // Navigation < : bloc aligné précédent (selon windowSizeCurrent)
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
      // Premier bloc → année-1, dernier bloc
      setYear(year - 1);
      const [s, e] = blocks[blocks.length - 1];
      setStartMonth(s);
      setEndMonth(e);
    } else {
      // Pas dans un bloc aligné → trouver le bloc précédent le plus proche
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

  // Navigation > : bloc aligné suivant (selon windowSizeCurrent)
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
      // Dernier bloc → année+1, premier bloc
      setYear(year + 1);
      const [s, e] = blocks[0];
      setStartMonth(s);
      setEndMonth(e);
    }
  };

  // Reset ramène à l'état "ancre"
  const resetToAnchor = () => {
    if (anchorYear !== null) {
      setIsAutoFallback(false);
      setYear(anchorYear);
      setStartMonth(anchorStartMonth!);
      setEndMonth(anchorEndMonth!);
    }
  };

  // Handler pour changement manuel de mois
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
      setError(err instanceof Error ? err.message : "Erreur de chargement");
      setLoadingIds(false);
    }
  }, [year, startMonth, endMonth, isAutoFallback, fallbackIndex, loadAllDetails]);

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
    
    const headers = ["Référence", "Date", "Montant HT", "TVA", "Montant TTC", "Devise"];
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
    a.download = `OVHcloud-factures_${year}-${String(startMonth + 1).padStart(2, "0")}_${year}-${String(endMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============ EXPORT PDF ============

  const exportPDF = () => {
    const data = loadedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (data.length === 0) return;
    
    const periodLabel = `${MONTHS_FR_FULL[startMonth]} ${year} - ${MONTHS_FR_FULL[endMonth]} ${year}`;
    
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>OVHcloud-Factures - ${periodLabel}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#0050d7;margin-bottom:5px}.period{color:#666;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th,td{padding:10px;text-align:left;border-bottom:1px solid #ddd}th{background:#f5f5f5;font-weight:600}.amount{text-align:right}.total-row{font-weight:bold;background:#f0f7ff}.footer{margin-top:30px;color:#888;font-size:12px}@media print{body{margin:20px}}</style></head><body><h1>Historique des factures</h1><p class="period">${periodLabel} — ${data.length} facture(s)</p><table><thead><tr><th>Référence</th><th>Date</th><th class="amount">HT</th><th class="amount">TVA</th><th class="amount">TTC</th></tr></thead><tbody>${data.map(b => `<tr><td>${b.billId}</td><td>${formatDate(b.date)}</td><td class="amount">${formatAmount(b.priceWithoutTax.value, b.priceWithoutTax.currencyCode)}</td><td class="amount">${formatAmount(b.tax.value, b.tax.currencyCode)}</td><td class="amount">${formatAmount(b.priceWithTax.value, b.priceWithTax.currencyCode)}</td></tr>`).join("")}<tr class="total-row"><td colspan="2">Total</td><td class="amount">${formatAmount(totalHT, currency)}</td><td class="amount">${formatAmount(totalTVA, currency)}</td><td class="amount">${formatAmount(totalTTC, currency)}</td></tr></tbody></table><p class="footer">Généré le ${new Date().toLocaleDateString("fr-FR")} depuis OVHcloud Manager</p></body></html>`;
    
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
          {/* Année */}
          <span className="year-label">{year}</span>
          
          {/* Navigation < */}
          <button className="btn year-nav-btn" onClick={goToPrevious} disabled={!canGoPrevious} title="Période précédente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          {/* Sélecteur mois début */}
          <select className="period-select month-select" value={startMonth} onChange={(e) => handleStartMonthChange(Number(e.target.value))}>
            {MONTHS_FR.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
          </select>
          
          <span className="date-separator">→</span>
          
          {/* Sélecteur mois fin */}
          <select className="period-select month-select" value={endMonth} onChange={(e) => handleEndMonthChange(Number(e.target.value))}>
            {MONTHS_FR.map((m, i) => <option key={`end-${i}`} value={i}>{m}</option>)}
          </select>
          
          {/* Navigation > */}
          <button className="btn year-nav-btn" onClick={goToNext} disabled={!canGoNext} title="Période suivante">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          
          {/* Bouton reset (visible si écarté de l'ancre) */}
          {showReset && (
            <button className="btn reset-btn" onClick={resetToAnchor} title="Retour à la période initiale">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
        </div>
        
        <div className="toolbar-right">
          {allLoaded && billIds.length > 0 && (
            <>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportCSV} title="Exporter en CSV"><FileTextIcon /> CSV</button>
              <button className="btn btn-sm btn-secondary export-btn" onClick={exportPDF} title="Exporter en PDF"><FileIcon /> PDF</button>
            </>
          )}
          <span className="result-count">{loadingIds ? "Chargement..." : `${loadedCount}/${billIds.length} facture(s)`}</span>
        </div>
      </div>

      {/* ===== BARRE DES TOTAUX ===== */}
      {allLoaded && billIds.length > 0 && (
        <div className="totals-bar">
          <span className="total-label">Total HT: <strong>{formatAmount(totalHT, currency)}</strong></span>
          <span className="total-label">TVA: <strong>{formatAmount(totalTVA, currency)}</strong></span>
          <span className="total-label">Total TTC: <strong>{formatAmount(totalTTC, currency)}</strong></span>
        </div>
      )}

      {/* ===== CONTENU ===== */}
      {loadingIds ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : billIds.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>Aucune facture</h3><p>Aucune facture enregistrée sur cette période.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table bills-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
                <th>Montant HT</th>
                <th>TVA</th>
                <th>Montant TTC</th>
                <th>Actions</th>
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
                        <a href={row.details.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>
                        <a href={row.details.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>
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
