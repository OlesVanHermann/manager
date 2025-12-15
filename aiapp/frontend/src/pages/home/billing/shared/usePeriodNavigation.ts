// ============================================================
// USE PERIOD NAVIGATION - Hook de navigation par période avec fallback
// ============================================================

import { useState, useCallback } from "react";
import { MIN_YEAR, VALID_WINDOW_SIZES } from "./constants";
import { getWindowSizeFromRange, getBlocks, getLastCompleteBlock, calculateAnchor, getDateRange } from "./periodHelpers";

// ============ TYPES ============

export interface PeriodState {
  year: number;
  startMonth: number;
  endMonth: number;
  anchorYear: number | null;
  anchorStartMonth: number | null;
  anchorEndMonth: number | null;
  fallbackIndex: number;
  isAutoFallback: boolean;
}

export interface PeriodNavigation {
  // ---------- STATE ----------
  year: number;
  startMonth: number;
  endMonth: number;
  windowSizeCurrent: number;
  // ---------- NAVIGATION ----------
  canGoPrevious: boolean;
  canGoNext: boolean;
  showReset: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  resetToAnchor: () => void;
  handleStartMonthChange: (value: number) => void;
  handleEndMonthChange: (value: number) => void;
  // ---------- DATE RANGE ----------
  getDateRangeISO: () => { from: string; to: string };
  // ---------- FALLBACK ----------
  isAutoFallback: boolean;
  fallbackIndex: number;
  applyFallback: () => void;
  setAnchor: () => void;
  disableAutoFallback: () => void;
}

// ============ HOOK ============

/** Hook de navigation par période avec fallback automatique. Gère year, startMonth, endMonth, et la logique de blocs alignés. */
export function usePeriodNavigation(): PeriodNavigation {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // ---------- STATE ----------
  const [year, setYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [endMonth, setEndMonth] = useState(currentMonth);

  const [anchorYear, setAnchorYear] = useState<number | null>(null);
  const [anchorStartMonth, setAnchorStartMonth] = useState<number | null>(null);
  const [anchorEndMonth, setAnchorEndMonth] = useState<number | null>(null);

  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isAutoFallback, setIsAutoFallback] = useState(true);

  // ---------- COMPUTED ----------
  const monthCount = endMonth - startMonth + 1;
  const windowSizeCurrent = getWindowSizeFromRange(monthCount);

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

  // ---------- NAVIGATION ----------
  const goToPrevious = useCallback(() => {
    if (!canGoPrevious) return;
    setIsAutoFallback(false);

    const blocks = getBlocks(windowSizeCurrent);
    const currentBlockIndex = blocks.findIndex(([s]) => s === startMonth);

    if (currentBlockIndex > 0) {
      const [s, e] = blocks[currentBlockIndex - 1];
      setStartMonth(s);
      setEndMonth(e);
    } else if (currentBlockIndex === 0) {
      setYear(y => y - 1);
      const [s, e] = blocks[blocks.length - 1];
      setStartMonth(s);
      setEndMonth(e);
    } else {
      const prevBlock = blocks.find(([, e]) => e < startMonth);
      if (prevBlock) {
        setStartMonth(prevBlock[0]);
        setEndMonth(prevBlock[1]);
      } else {
        setYear(y => y - 1);
        const [s, e] = blocks[blocks.length - 1];
        setStartMonth(s);
        setEndMonth(e);
      }
    }
  }, [canGoPrevious, windowSizeCurrent, startMonth]);

  const goToNext = useCallback(() => {
    if (!canGoNext) return;
    setIsAutoFallback(false);

    const blocks = getBlocks(windowSizeCurrent);
    const currentBlockIndex = blocks.findIndex(([s]) => s === startMonth);

    if (currentBlockIndex >= 0 && currentBlockIndex < blocks.length - 1) {
      const [s, e] = blocks[currentBlockIndex + 1];
      setStartMonth(s);
      setEndMonth(e);
    } else if (currentBlockIndex === blocks.length - 1) {
      setYear(y => y + 1);
      const [s, e] = blocks[0];
      setStartMonth(s);
      setEndMonth(e);
    }
  }, [canGoNext, windowSizeCurrent, startMonth]);

  const resetToAnchor = useCallback(() => {
    if (anchorYear !== null) {
      setIsAutoFallback(false);
      setYear(anchorYear);
      setStartMonth(anchorStartMonth!);
      setEndMonth(anchorEndMonth!);
    }
  }, [anchorYear, anchorStartMonth, anchorEndMonth]);

  const handleStartMonthChange = useCallback((value: number) => {
    setIsAutoFallback(false);
    setStartMonth(value);
  }, []);

  const handleEndMonthChange = useCallback((value: number) => {
    setIsAutoFallback(false);
    setEndMonth(value);
  }, []);

  // ---------- DATE RANGE ----------
  const getDateRangeISO = useCallback(() => {
    return getDateRange(year, startMonth, endMonth);
  }, [year, startMonth, endMonth]);

  // ---------- FALLBACK ----------
  const applyFallback = useCallback(() => {
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
  }, [fallbackIndex, currentMonth, currentYear]);

  const setAnchor = useCallback(() => {
    setIsAutoFallback(false);
    setAnchorYear(year);
    setAnchorStartMonth(startMonth);
    setAnchorEndMonth(endMonth);
  }, [year, startMonth, endMonth]);

  const disableAutoFallback = useCallback(() => {
    setIsAutoFallback(false);
  }, []);

  // ---------- RETURN ----------
  return {
    year,
    startMonth,
    endMonth,
    windowSizeCurrent,
    canGoPrevious,
    canGoNext,
    showReset,
    goToPrevious,
    goToNext,
    resetToAnchor,
    handleStartMonthChange,
    handleEndMonthChange,
    getDateRangeISO,
    isAutoFallback,
    fallbackIndex,
    applyFallback,
    setAnchor,
    disableAutoFallback,
  };
}
