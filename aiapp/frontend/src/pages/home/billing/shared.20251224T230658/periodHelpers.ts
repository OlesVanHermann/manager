// ============================================================
// PERIOD HELPERS - Fonctions de calcul des blocs de période
// ============================================================

import { VALID_WINDOW_SIZES } from "./constants";

// ============ HELPERS BLOCS ALIGNÉS ============

/** Retourne la taille de fenêtre valide la plus proche (inférieure ou égale) du nombre de mois donné. */
export function getWindowSizeFromRange(monthCount: number): number {
  for (let i = VALID_WINDOW_SIZES.length - 1; i >= 0; i--) {
    if (VALID_WINDOW_SIZES[i] <= monthCount) {
      return VALID_WINDOW_SIZES[i];
    }
  }
  return 1;
}

/** Génère les blocs [startMonth, endMonth] pour une année selon la taille de fenêtre. */
export function getBlocks(windowSize: number): [number, number][] {
  const blocks: [number, number][] = [];
  for (let i = 0; i < 12; i += windowSize) {
    blocks.push([i, Math.min(i + windowSize - 1, 11)]);
  }
  return blocks;
}

/** Retourne le dernier bloc complet (terminé) avant ou incluant le mois donné. */
export function getLastCompleteBlock(month: number, windowSize: number): [number, number] | null {
  const blocks = getBlocks(windowSize);
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i][1] <= month) {
      return blocks[i];
    }
  }
  return null;
}

/** Calcule l'ancrage (startMonth, endMonth) pour un mois donné et une taille de fenêtre. */
export function calculateAnchor(
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

/** Calcule la plage de dates ISO (from, to) pour une année et des mois donnés. */
export function getDateRange(year: number, startMonth: number, endMonth: number): { from: string; to: string } {
  const from = `${year}-${String(startMonth + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, endMonth + 1, 0).getDate();
  const to = `${year}-${String(endMonth + 1).padStart(2, "0")}-${lastDay}`;
  return { from, to };
}
